<p align="center">
  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="4em" width="4em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-5.18 11.65c-.16.29-.26.61-.26.96 0 1.11.9 2.01 2.01 2.01.96 0 1.77-.68 1.96-1.59l.01-.03L16.4 5.5c0-.28-.22-.5-.5-.5zM1 9l2 2c2.88-2.88 6.79-4.08 10.53-3.62l1.19-2.68C9.89 3.84 4.74 5.27 1 9zm20 2l2-2a15.367 15.367 0 00-5.59-3.57l-.53 2.82c1.5.62 2.9 1.53 4.12 2.75zm-4 4l2-2c-.8-.8-1.7-1.42-2.66-1.89l-.55 2.92c.42.27.83.59 1.21.97zM5 13l2 2a7.1 7.1 0 014.03-2l1.28-2.88c-2.63-.08-5.3.87-7.31 2.88z"></path></svg>
</p>

<h1 align="center">Network Idle</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/network-idle">
    <img src="https://img.shields.io/npm/v/network-idle.svg?label=version&color=ff8127" alt="Version">
  </a>
  <a href="https://github.com/supremetechnopriest/network-idle/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/network-idle?color=ff7531" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/network-idle">
    <img src="https://img.shields.io/npm/dt/network-idle.svg?color=ff693b" alt="Downloads">
  </a>
  <a href="https://github.com/sponsors/supremetechnopriest?logo=github">
    <img src="https://img.shields.io/github/sponsors/supremetechnopriest?color=ff5c45" alt="GitHub Sponsors">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/test_coverage">
    <img src="https://img.shields.io/github/workflow/status/SupremeTechnopriest/network-idle/tests?label=tests&color=ff4f50" alt="Tests">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/test_coverage">
    <img src="https://img.shields.io/codeclimate/coverage/SupremeTechnopriest/network-idle?color=ff415b"alt="Test Coverage">
  </a>
  <a href="https://codeclimate.com/github/SupremeTechnopriest/network-idle/maintainability">
    <img src="https://img.shields.io/codeclimate/maintainability/SupremeTechnopriest/network-idle?color=ff3266" alt="Maintainability">
  </a>
</p>

</br>

Detect when the browser has not made a network request within a specified amount of time.  This implementation does not depend on a Service Worker and instead depends on a [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) listening for resource entries. 

## Installation

```
npm i network-idle
```

## API

### `requestNetworkIdle`
Calls the `callback` when there has not been a network request in the last `timeout` milliseconds. The callback will be called every time the network has been idle for the specified amount of time.

#### Signature
```ts
requestNetworkIdle(callback: CallbackType, timeout: number): number
```

#### Arguments
- **callback** `() => void`: The function to call when the network is idle.
- **timeout** `number`: How long there should be no network requests for the browser to be considered idle.

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
networkIdleCallback(callback: CallbackType, timeout: number): number
```

#### Arguments
- **callback** `() => void`: The function to call when the network is idle.
- **timeout** `number`: How long there should be no network requests for the browser to be considered idle.

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