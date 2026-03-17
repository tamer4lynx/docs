# tamer-transports

Fetch, WebSocket, and EventSource polyfills for Lynx. Required for HMR and WebSocket in native Lynx apps.

## Overview

Installs polyfills on import:

- **installFetchPolyfill()** — Replaces Lynx’s stock fetch with a polyfill that attempts to meet the browser-standard fetch API
- **installWebSocketPolyfill()** — WebSocket polyfill that attempts to meet the browser-standard WebSocket API
- **installEventSourcePolyfill()** — EventSource polyfill that attempts to meet the browser-standard EventSource API

Exports `fetch`, `WebSocket`, `EventSource` (native or polyfilled).

> **Note:** These polyfills are not fully tested. Report issues on GitHub.

## Installation

```bash
npm install @tamer4lynx/tamer-transports
```

Import early in your app entry (e.g. before any fetch/WebSocket usage):

```ts
import '@tamer4lynx/tamer-transports'
```

## API

The package has no public API beyond the polyfills. Importing it installs the polyfills globally. Use `globalThis.fetch`, `new WebSocket(...)`, and `EventSource` as usual.
