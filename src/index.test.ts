import { EventEmitter } from 'events'
import { requestNetworkIdle, networkIdleCallback, clearNetworkIdle } from '.'

type MockCallback = (entries: any, self?: MockObserver) => void

const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

const emitter = new EventEmitter()

class MockObserver {
  static readonly supportedEntryTypes = ['resource', 'navigation']
  private fn: MockCallback

  constructor (fn: MockCallback) {
    this.fn = fn
    this.entriesEvent = this.entriesEvent.bind(this)
  }

  entriesEvent (entries: any[]) {
    this.fn({ getEntries: () => entries }, this)
  } 

  observe () {
    emitter.on('event', this.entriesEvent)
  }

  disconnect () {
    emitter.off('event', this.entriesEvent)
  }

  takeRecords () { return [] }
}

window.PerformanceObserver = MockObserver

describe('network-idle', () => {
  describe('.requestNetworkIdle', () => {
    test('Fires callback when no network requests for interval', async () => {
      const callback = jest.fn()
      requestNetworkIdle(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Wakes up on new network requests', async () => {
      const callback = jest.fn()
      requestNetworkIdle(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(1)
      emitter.emit('event', ['foo', 'bar'])
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(2)
    })

    test('Filters specified urls', async () => {
      const callback = jest.fn()
      requestNetworkIdle(callback, 200, { filter: ['https://foo.bar', 'https://baz.qux'] })
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(1)
      emitter.emit('event', [{ name: 'https://foo.bar' }])
      emitter.emit('event', [{ name: 'https://baz.qux' }])
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(1)
      emitter.emit('event', [{ name: 'https://quux.corge' }])
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('.networkIdleCallback', () => {
    test('Fires callback when no network requests for interval', async () => {
      const callback = jest.fn()
      networkIdleCallback(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Resets if callback has not been emitted', async () => {
      const callback = jest.fn()
      networkIdleCallback(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      emitter.emit('event', ['foo', 'bar'])
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Does not wake up on new network requests', async () => {
      const callback = jest.fn()
      networkIdleCallback(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(1)
      emitter.emit('event', ['foo', 'bar'])
      await sleep(200)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Filters specified urls', async () => {
      const callback = jest.fn()
      networkIdleCallback(callback, 200, { filter: ['https://foo.bar', 'https://baz.qux'] })
      await sleep(100)
      emitter.emit('event', [{ name: 'https://quux.corge' }])
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      emitter.emit('event', [{ name: 'https://foo.bar' }])
      emitter.emit('event', [{ name: 'https://baz.qux' }])
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('.clearNetworkIdle', () => {
    test('Clears request', async () => {
      const callback = jest.fn()
      const id = requestNetworkIdle(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      clearNetworkIdle(id)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
    })

    test('Clears callback', async () => {
      const callback = jest.fn()
      const id = networkIdleCallback(callback, 200)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
      clearNetworkIdle(id)
      await sleep(100)
      expect(callback).toHaveBeenCalledTimes(0)
    })
  })
})
