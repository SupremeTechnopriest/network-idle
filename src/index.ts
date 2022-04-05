interface IInstance {
  timeoutId: number
  observer: PerformanceObserver
}

type CallbackType = () => void

let idPool: number = 0
const instances = new Map<number, IInstance>()

export function requestNetworkIdle (callback: CallbackType, timeout: number) {
  const id = idPool++
  const timeoutId = window.setTimeout(callback, timeout)
  const observer = new PerformanceObserver((entries: PerformanceObserverEntryList) => {
    const length = entries.getEntries().length
    if (length) {
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

export function networkIdleCallback (callback: CallbackType, timeout: number) {
  const id = idPool++
  const timeoutId = window.setTimeout(() => {
    callback()
    clearNetworkIdle(id)
  }, timeout)
  const observer = new PerformanceObserver((entries: PerformanceObserverEntryList) => {
    const length = entries.getEntries().length
    if (length) {
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
