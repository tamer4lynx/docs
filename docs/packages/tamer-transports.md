# tamer-transports

Fetch, WebSocket, and EventSource polyfills for Lynx. Required for HMR and WebSocket in native Lynx apps.

## Overview

Installs polyfills on import:

- **installFetchPolyfill()** — Ensures `fetch` works in Lynx
- **installWebSocketPolyfill()** — WebSocket with base64 ArrayBuffer handling for Lynx
- **installEventSourcePolyfill()** — EventSource via fetch streaming

Exports `fetch`, `WebSocket`, `EventSource` (native or polyfilled).

## Installation

```bash
npm install tamer-transports
```

Import early in your app entry (e.g. before any fetch/WebSocket usage):

```ts
import 'tamer-transports'
```

## API

The package has no public API beyond the polyfills. Importing it installs the polyfills globally. Use `globalThis.fetch`, `new WebSocket(...)`, and `EventSource` as usual.
