# @tamer4lynx/lynxwebsockets

Lightweight WebSocket native module and JS polyfill for LynxJS.

Provides a native WebSocket bridge (Android + iOS) and a JS polyfill that exposes a global `WebSocket` implementation which forwards calls to the native layer and receives events via the Lynx global event emitter.

## Installation

```bash
npm install @tamer4lynx/lynxwebsockets
```

Add to your app's dependencies and run `t4l link`.

## Usage

```js
const ws = new WebSocket('wss://echo.websocket.org')
ws.onopen = () => ws.send('hello')
ws.onmessage = (e) => console.log('message', e.data)
ws.onerror = (err) => console.error(err)
ws.onclose = (evt) => console.log('closed', evt.code, evt.reason)
```

## API

**global.WebSocket(url)**

- Methods: `send(message)`, `close(code?, reason?)`
- Event callbacks: `onopen`, `onmessage`, `onerror`, `onclose`

## Platform

Uses **lynx.ext.json**. Run `t4l link` after adding to your app.
