# tamer-navigation

Native stack transport for Tamer. Provides `TamerNav` — the push/pop/dispatch bridge between the JS coordinator and native LynxView stack — plus global event hooks for stack lifecycle.

This is the layer `tamer-router` is built on. You can use it directly if you want full control over coordinator logic without file-based routing.

:::info Coming to npm
`@tamer4lynx/tamer-navigation` will be published to npm shortly. For now it ships as a native submodule wired by `t4l link`. The API is stable.
:::

## Overview

- **`TamerNav.push(options)`** — Push a new spoke LynxView onto the native stack
- **`TamerNav.pop(options?)`** — Pop the top spoke, passing optional result payload back to the coordinator
- **`TamerNav.popAll()`** — Clear the entire stack
- **`TamerNav.dispatch(action)`** — Send an event to the coordinator (`tamer-nav:dispatch`)
- **`TamerNav.update(options)`** — Broadcast updated state JSON to all open spokes
- **Global events** — `tamer-nav:dispatch`, `tamer-nav:popped`, `tamer-nav:transition-end`

## When to use directly

Use `tamer-router` for most apps. Use `TamerNav` directly when:

- You need a custom coordinator that manages stack state outside of React Router (e.g. a multi-bundle app where each stack entry is a different Lynx bundle)
- You want full control over push/pop timing and result payloads
- You're building something that doesn't fit a file-based page model

The example app's `src/example_stack.tsx` shows this pattern in full — a hand-rolled coordinator that calls `TamerNav.push`, `TamerNav.pop`, and listens to `tamer-nav:popped` to keep its own route stack in sync, with no `FileRouter` involved.

## API

### `TamerNav.push(options)`

```ts
TamerNav.push({
  src: string          // bundle source (e.g. 'main.lynx.bundle')
  screenId?: string    // unique ID for this screen instance
  initData?: object    // passed to useInitData() in the spoke
  stateJson?: string   // initial serialized state for providerConnector hydration
})
```

### `TamerNav.pop(options?)`

```ts
TamerNav.pop({
  screenId?: string    // which screen to pop (defaults to top)
  source?: string      // e.g. 'system-back'
  payloadJson?: string // result payload passed to coordinator via tamer-nav:popped
})
```

### `TamerNav.popAll()`

Clears the entire native stack.

### `TamerNav.dispatch(action)`

Fires `tamer-nav:dispatch` on the coordinator's global event bus. `action` is JSON-serialized and delivered as `{ action: string }`.

```ts
TamerNav.dispatch({ type: 'push-route', route: 'settings' })
```

### `TamerNav.update(options)`

Broadcasts updated state to all open spokes via `globalProps`. Used by `tamer-router` to sync `providerConnector` state after mutations.

```ts
TamerNav.update({ stateJson: JSON.stringify(myState) })
```

### Global events

Listen with `useLynxGlobalEventListener`:

| Event | Payload | Description |
|-------|---------|-------------|
| `tamer-nav:dispatch` | `{ action: string }` | Action dispatched from a spoke |
| `tamer-nav:popped` | `{ screenId?: string; result?: string }` | Spoke was popped; result is `payloadJson` from spoke |
| `tamer-nav:transition-end` | — | Push/pop animation completed |

### `readHydratedStateJson()` / `subscribeHydratedStateJson()`

Utilities for spokes to read and subscribe to state hydration from the coordinator:

```ts
import { readHydratedStateJson, subscribeHydratedStateJson } from '@tamer4lynx/tamer-navigation'

// Read current state on mount
const stateJson = readHydratedStateJson(defaultJson)

// Subscribe to updates
useEffect(() => {
  return subscribeHydratedStateJson((stateJson) => {
    store.hydrate(parseSharedState(stateJson))
  })
}, [])
```

## LynxGroup requirements

`TamerNav` requires the native `LynxGroup` / `LynxViewGroup` API — Android and iOS host must use `TamerNavHost` (wired by `t4l link`). The push/pop calls are no-ops without it.

## Related

- [tamer-router](/packages/core/tamer-router) — Higher-level file-based routing built on top of `TamerNav`
- [tamer-host](/packages/core/tamer-host) — Host templates that wire `TamerNavHost` into your native app
