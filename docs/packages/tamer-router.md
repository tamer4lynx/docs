# tamer-router

File-based routing for Lynx with React 17 and react-router 6.

## Overview

- Rsbuild plugin: scans a folder and generates a route tree
- Conventions: `index` → index route, `[param]` → dynamic segment, `_layout.tsx` → layout wrapper
- **Stack** and **Tabs** layouts with AppBar, TabBar, Content (via tamer-app-shell)
- `useTamerRouter()` / `useTamerNavigate()` for stack-aware navigation (`push`, `replace`, `back`, `canGoBack`)
- Android back button handled by the router (native module); listens to `tamer-router:back` event

## Installation

```bash
npm install tamer-router react-router@6 tamer-app-shell
```

Stack and Tabs layouts require **tamer-app-shell**. Add to your app and run `t4l link`.

## Setup

### 1. Lynx config (Rspeedy)

Use **tamer-plugin** so the default tamer.config from tamer-router is applied:

```ts
import { defineConfig } from '@lynx-js/rspeedy'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTamer } from 'tamer-plugin'

export default defineConfig({
  plugins: [
    pluginTamer(),
    pluginReactLynx(),
  ],
})
```

Or add **tamerRouterPlugin** directly:

```ts
import { tamerRouterPlugin } from 'tamer-router'

tamerRouterPlugin({
  root: './src/pages',
  output: './src/generated/_generated_routes.tsx',
  srcAlias: '@/',
  layoutFilename: '_layout.tsx',
})
```

### 2. Entry point

**Option A: Simple FileRouter**

```tsx
import { root } from '@lynx-js/react'
import { FileRouter } from 'tamer-router'
import routes from 'tamer-router/generated-routes'

root.render(<FileRouter routes={routes} />)
```

**Option B: Tabs layout (recommended)**

Use `Tabs` in `_layout.tsx` for AppBar + TabBar:

```tsx
import { Tabs } from 'tamer-router'
import { useSystemUI } from 'tamer-system-ui'

export default function Layout() {
  const { setStatusBar, setNavigationBar } = useSystemUI()

  useEffect(() => {
    setStatusBar({ color: '#fff', style: 'light' })
    setNavigationBar({ color: '#fff', style: 'light' })
  }, [])

  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: '#555' }, tabBarStyle: { backgroundColor: '#555' } }}>
      <Tabs.Screen name="index" path="/" options={{ title: 'Home', icon: 'home', label: 'Home' }} />
      <Tabs.Screen name="about" path="/about" options={{ title: 'About', icon: 'info', label: 'About' }} />
    </Tabs>
  )
}
```

## API

### FileRouter

```tsx
<FileRouter
  routes={RouteObject[]}
  basename="/"
  transitionConfig={{ enabled?: boolean; direction?: 'left' | 'right'; mode?: 'stack' | 'scroll' }}
/>
```

Renders routes from the generated route tree. Pass `routes` from `tamer-router/generated-routes` or your custom output. `transitionConfig` configures native transition animations.

### Stack

Stack layout with AppBar and Content. No TabBar.

```tsx
<Stack titleForPath={(pathname) => string} screenOptions={{ headerStyle?, headerShown? }}>
  <Stack.Screen name="index" path="/" options={{ title?, headerShown? }} />
  <Stack.Screen name="detail" path="/detail" options={{ title? }} />
</Stack>
```

### Tabs

Tabs layout with AppBar, Content, and TabBar.

```tsx
<Tabs titleForPath={(pathname) => string} screenOptions={{ headerStyle?, tabBarStyle?, contentStyle?, iconColor? }}>
  <Tabs.Screen name="index" path="/" options={{ title?, icon?, label?, set? }} />
</Tabs.Screen>
```

`TabsScreenOptions`: `title`, `headerShown`, `icon`, `label`, `set` (icon set).

### useScreenOptions(options)

Call inside a screen to set title/header. Options merged with `Stack.Screen` / `Tabs.Screen`.

### useTamerRouter() / useTamerNavigate()

Returns:

| Method | Signature | Description |
|--------|------------|-------------|
| `push` | `(route: string, options?: TransitionOptions) => void` | Push route |
| `replace` | `(route: string, options?: TransitionOptions) => void` | Replace current |
| `back` / `pop` | `(options?: TransitionOptions) => void` | Go back |
| `canGoBack` | `() => boolean` | Whether stack has previous entry |

`TransitionOptions`: `{ mode?: 'stack' \| 'scroll'; direction?: 'left' \| 'right' }`

For tab switching without stack push, use `replace(route, { tab: true })` via `AppShellRouterContext` (used by TabBar).

### Outlet / Slot

Re-exported from react-router. `Slot` is an alias for `Outlet`.

### tamerRouterPlugin

Rsbuild plugin options: `root`, `output`, `srcAlias?`, `layoutFilename?` (default `_layout.tsx`). Generates route file and watches for changes.
