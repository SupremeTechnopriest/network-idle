<p align="center">
  <img height='100' width='100' src="./logo.svg" />
</p>

<h1 align="center">Network Idle</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/network-idle">
    <img src="https://img.shields.io/npm/v/network-idle.svg?label=version&color=319795" alt="Version">
  </a>
  <a href="https://github.com/supremetechnopriest/network-idle/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/network-idle?color=319795" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/network-idle">
    <img src="https://img.shields.io/npm/dt/network-idle.svg?color=319795" alt="Downloads">
  </a>
  <a href="https://github.com/sponsors/supremetechnopriest?logo=github">
    <img src="https://img.shields.io/github/sponsors/supremetechnopriest?color=319795" alt="GitHub Sponsors">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/test_coverage">
    <img src="https://img.shields.io/github/workflow/status/SupremeTechnopriest/network-idle/tests?label=tests&color=319795" alt="Tests">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/test_coverage">
    <img src="https://img.shields.io/codeclimate/coverage/SupremeTechnopriest/network-idle?color=319795"alt="Test Coverage">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/maintainability">
    <img src="https://img.shields.io/codeclimate/maintainability/SupremeTechnopriest/network-idle?color=319795" alt="Maintainability">
  </a>
</p>

</br>

Detect when the browser has not made a network request within a specified amount of time.  This implementation does not depend on a Service Worker and instead depends on a [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) listening for resource entries. 

## Installation

```
npm i network-idle
```

## Types

### `CallbackType`

```ts
type CallbackType = () => void
```

### `IOptions`

```ts
interface IOptions {
  filter?: string[]
}
```

- **filter**: Sometimes you may want to perform a request in your idle callback. To prevent that request from triggering another callback, add its URL to the filter string array. Works on both `requestNetworkIdle` and `networkIdleCallback`.

```js
requestNetworkIdle(() => {
  fetch('https://foo.bar/baz/?qux=corge') // Won't trigger callback again
}, 1000, { 
  filter: [ 'https://foo.bar/baz/?qux=corge' ] 
})
```

## API

### `requestNetworkIdle`
Calls the `callback` when there has not been a network request in the last `timeout` milliseconds. The callback will be called every time the network has been idle for the specified amount of time.

#### Signature
```ts
requestNetworkIdle(callback: CallbackType, timeout: number, options: IOptions = {}): number
```

#### Arguments
- **callback** `() => void`: The function to call when the network is idle.
- **timeout** `number`: How long there should be no network requests for the browser to be considered idle.
- **options** `IOptions`: Additional configuration options.

#### Returns
- **id** `number`: Callback id

```js
import { requestNetworkIdle } from 'network-idle'

// No network requests in the last 500 milliseconds
requestNetworkIdle(() => {
  // Called every time the network is idle
  console.log('Network is idle!')
}, 500)
```

### `networkIdleCallback`
Calls the `callback` when there has not been a network request in the last `timeout` milliseconds.  Unlike `requestNetworkIdle`, this method will only be called the first time the idle condition is met.

#### Signature
```ts
networkIdleCallback(callback: CallbackType, timeout: number, options: IOptions = {}): number
```

#### Arguments
- **callback** `() => void`: The function to call when the network is idle.
- **timeout** `number`: How long there should be no network requests for the browser to be considered idle.
- **options** `IOptions`: Additional configuration options.

#### Returns
- **id** `number`: Callback id

```js
import { networkIdleCallback } from 'network-idle'

// No network requests in the last 500 milliseconds
networkIdleCallback(() => {
  // Called the first time the network is idle
  console.log('Network is idle!')
}, 500)
```

### `clearNetworkIdle`
Clears the network idle handler. This will clear both the `requestNetworkIdle` and `networkIdleCallback` events. 

#### Signature
```ts
clearNetworkIdle(id: number): void
```

#### Arguments
- **id** `number`: The callback id returned by `requestNetworkIdle` or `networkIdleCallback`

#### Returns
- `void`

```js
import { requestNetworkIdle, clearNetworkIdle } from 'network-idle'

const id = requestNetworkIdle(() => {
  console.log('Network is idle!')
}, 500)

clearNetworkIdle(id) // Observer disconnected and timeout cleared
```

```js
import { networkIdleCallback, clearNetworkIdle } from 'network-idle'

const id = networkIdleCallback(() => {
  console.log('Network is idle!')
}, 500)

clearNetworkIdle(id) // Observer disconnected and timeout cleared
```

</br>

<p align="center">
  <a href="https://github.com/standard/standard">
    <img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" alt="JavaScript Style Guide" />
  </a>
</p>