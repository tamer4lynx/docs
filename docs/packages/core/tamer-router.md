# tamer-router

File-based routing for Lynx with React Router 6 + TamerNav native stack coordination. Covers file-based route generation, hardware back handling, and cross-spoke state synchronization.

## Overview

- **File-based routing:** Rsbuild plugin scans `pages/` → generates route tree. Conventions: `index` → index route, `[param]` → dynamic segment, `_layout.tsx` → layout wrapper.
- **Native stack:** `FileRouter` pushes spoke LynxViews via `TamerNav` from `@tamer4lynx/tamer-navigation`. Coordinator manages route stack.
- **Layout components:** `Stack` / `Tabs` with AppBar, TabBar, Content (via tamer-app-shell).
- **State bridging:** `providerConnector` prop syncs React Context / hooks across spoke boundaries. **Required if your app uses any React providers (Zustand, Redux, TanStack Query, i18n, theme, etc.)** — each spoke gets a fresh JS context and won't inherit the coordinator's provider state without this. See **Cross-spoke state** below.
- **Hardware back:** `BackHandlerProvider` + `useBackHandler` intercept Android back / iOS gesture.
- **Manual coordinator:** Don't need `FileRouter`? Use `TamerNav` directly from `@tamer4lynx/tamer-navigation` with `BackHandlerProvider` for back handling. The example app (`src/example_stack.tsx`) shows this pattern — a hand-rolled coordinator that calls `TamerNav.push` / `TamerNav.pop` without any file-based routing. `tamer-router` is a higher-level solution built on top of the same primitives.

:::tip Refactored recently
`tamer-router` has gone through a significant internal refactor. If you are one of the handful of people already using it — you know who you are — the public API is the same but the internals are cleaner. If it breaks, please file an issue.
:::

## Installation

```bash
t4l add tamer-router
```

Peers: **`react-router@^6`**. Run **`t4l link`** after install.

## Setup

### 1. Rsbuild config

Use **tamer-plugin** (applies default tamer-router config automatically):

```ts
import { defineConfig } from '@lynx-js/rspeedy'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTamer } from '@tamer4lynx/tamer-plugin'

export default defineConfig({
  plugins: [
    pluginTamer(),
    pluginReactLynx(),
  ],
})
```

Or configure **tamerRouterPlugin** directly:

```ts
import { tamerRouterPlugin } from '@tamer4lynx/tamer-router'

export default {
  plugins: [
    tamerRouterPlugin({
      root: './src/pages',
      srcAlias: '@/',
      layoutFilename: '_layout.tsx',
    }),
  ],
}
```

### 2. Entry point

```tsx
import { root } from '@lynx-js/react'
import { FileRouter } from '@tamer4lynx/tamer-router'

root.render(<FileRouter />)
```

Optional: pass `providerConnector` to bridge state across spokes (see **Cross-spoke state** below).

### 3. Layout (example)

`src/pages/_layout.tsx`:

```tsx
import { Stack } from '@tamer4lynx/tamer-router'
import { useSystemUI } from '@tamer4lynx/tamer-system-ui'

export default function Layout() {
  const { setStatusBar } = useSystemUI()

  useEffect(() => {
    setStatusBar({ color: '#fff', style: 'light' })
  }, [])

  return (
    <Stack>
      <Stack.Screen name="index" path="/" options={{ title: 'Home' }} />
      <Stack.Screen name="detail" path="/detail/:id" options={{ title: 'Detail' }} />
    </Stack>
  )
}
```

## API

### `<FileRouter>`

Auto-generates routes from `pages/` directory and manages coordinator/spoke pushing via TamerNav.

```tsx
<FileRouter
  children?: ReactNode
  lazyRoutes?: boolean
  providerConnector?: TamerProviderConnector[]
  basename?: string
  knownPaths?: string[]
  rootBackgroundColor?: string
  exitOnRootHardwareBack?: boolean
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `providerConnector` | `TamerStateSync[]` | State syncs to bridge across spokes (optional). See **Cross-spoke state**. |
| `exitOnRootHardwareBack` | `boolean` | Exit app if back pressed at root (default: false) |
| Other props | | React Router config (`basename`, etc.) |

### Cross-spoke state: `providerConnector`

Each spoke LynxView gets a fresh JS context. Module-level singletons (Zustand, Redux) re-evaluate per spoke. React Context set on the coordinator doesn't survive into spokes. **If your app uses any React provider — state management, theming, i18n, data fetching — you need `providerConnector` to carry that state across screen pushes.**

Pass `providerConnector` to bridge state explicitly:

```tsx
import { FileRouter, createZustandSync } from '@tamer4lynx/tamer-router'
import { myStore } from './store'

const mySync = createZustandSync('myStore', myStore)

<FileRouter providerConnector={[mySync]} />
```

On push, `FileRouter` serializes all syncs to JSON and hydrates spokes. On mutation, spokes re-serialize back via `TamerNav.update`. Coordinators listen to `tamer-nav:dispatch` events.

**Built-in connectors:** `createZustandSync`, `createReduxSync`, `createTanstackQuerySync`, `createApolloSync`, `createSwrSync`, `createJotaiSync`, `createI18nextSync`, `createThemeSync`, `createRecoilSync`. See package README for full API.

Custom sync via `createTamerStateSync(key, { getState, subscribe, hydrate, send? })`.

### `<Stack>`

Stack navigation with AppBar and Content.

```tsx
<Stack screenOptions={{ headerStyle?, headerShown? }}>
  <Stack.Screen name="index" path="/" options={{ title?, headerShown? }} />
  <Stack.Screen name="detail" path="/detail/:id" options={{ title? }} />
</Stack>
```

### `<Tabs>`

Tabs navigation with AppBar, Content, and TabBar.

```tsx
<Tabs screenOptions={{ headerStyle?, tabBarStyle?, contentStyle?, iconColor? }}>
  <Tabs.Screen name="index" path="/" options={{ title?, icon?, label? }} />
  <Tabs.Screen name="settings" path="/settings" options={{ title?, icon?, label? }} />
</Tabs>
```

### `useBackHandler` / `usePreventBack`

Intercept hardware back (Android) / pop gesture (iOS) **before** default handling.

```tsx
import { useBackHandler, usePreventBack } from '@tamer4lynx/tamer-router'

// Close modal instead of leaving screen
useBackHandler(() => {
  if (modalOpen) {
    setModalOpen(false)
    return true  // consumed
  }
  return false   // pass through
})

// Block back while unsaved
usePreventBack(isDirty)
```

Handlers are LIFO. When none return `true`, `FileRouter` pops the stack. In manual coordinator setups, you handle the fallback yourself.

### `useTamerRouter()`

```tsx
const { push, replace, back, canGoBack, navigate } = useTamerRouter()

push('/detail/42')
replace('/home')
back()
```

### Re-exports from React Router

`useLocation`, `useNavigate`, `useParams`, `useLocalSearchParams`, `Outlet` / `Slot`, `Link`
