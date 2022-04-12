interface IInstance {
  timeoutId: number
  observer: PerformanceObserver
}

interface IOptions {
  filter?: string[]
}

type CallbackType = () => void

let idPool: number = 0
const instances = new Map<number, IInstance>()

export function requestNetworkIdle (callback: CallbackType, timeout: number, options: IOptions = {}) {
  const id = idPool++
  const timeoutId = window.setTimeout(callback, timeout)
  const observer = new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
    let entries = entryList.getEntries()
    if (options.filter) {
      entries = entries.filter(entry => !options.filter.includes(entry.name))
    }
    if (entries.length) {
      const instance = instances.get(id)
      if (instance) {
        clearTimeout(instance.timeoutId)
        instance.timeoutId = window.setTimeout(callback, timeout)
      }
    }
  })
  observer.observe({ entryTypes: ['resource'] })

  instances.set(id, {
    timeoutId,
    observer
  })
  return id
}

export function networkIdleCallback (callback: CallbackType, timeout: number, options: IOptions = {}) {
  const id = idPool++
  const timeoutId = window.setTimeout(() => {
    callback()
    clearNetworkIdle(id)
  }, timeout)
  const observer = new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
    let entries = entryList.getEntries()
    if (options.filter) {
      entries = entries.filter(entry => !options.filter.includes(entry.name))
    }

    if (entries.length) {
      const instance = instances.get(id)
      if (instance) {
        clearTimeout(instance.timeoutId)
        instance.timeoutId = window.setTimeout(() => {
          callback()
          clearNetworkIdle(id)
        }, timeout)
      }
    }
  })
  observer.observe({ entryTypes: ['resource'] })

  instances.set(id, {
    timeoutId,
    observer
  })
  return id
}

export function clearNetworkIdle (id: number) {
  const instance = instances.get(id)
  if (instance) {
    clearTimeout(instance.timeoutId)
    instance.observer.disconnect()
    instances.delete(id)
  }
}
