# Example App Anatomy

The `packages/example` app demonstrates a full Tamer4Lynx setup: file-based routing, tabs, native modules, and platform APIs. This page walks through its structure.

---

## Directory structure

```
packages/example/
├── lynx.config.ts          # Rspeedy config: plugins, aliases, env
├── package.json
├── tsconfig.json
├── .env.example            # OAuth vars for native/auth
├── intrinsic-element.d.ts # input, textarea, svg typings
├── src/
│   ├── index.tsx           # Entry: FileRouter + generated routes
│   ├── App.tsx             # Legacy standalone (not used with router)
│   ├── App.css
│   ├── rspeedy-env.d.ts    # JSX typings for app-bar, icon
│   ├── oauth-config.ts     # OAuth config (native/auth)
│   ├── tamer-icons-fonts.generated.ts  # Font manifest for tamer-icons
│   ├── assets/
│   │   ├── tamer-logo.png
│   │   ├── lynx-logo.png
│   │   └── react-logo.png
│   ├── fonts/              # Material Icons, Font Awesome
│   │   ├── MaterialIcons-Regular.ttf
│   │   ├── fa-solid-900.ttf
│   │   ├── fa-regular-400.ttf
│   │   └── fa-brands-400.ttf
│   └── pages/
│       ├── _layout.tsx     # Root layout: Tabs + useSystemUI
│       ├── index.tsx       # Home tab
│       ├── about.tsx
│       ├── insets.tsx      # tamer-insets, textarea
│       ├── screen.tsx      # tamer-screen
│       ├── secure.tsx      # tamer-secure-store, tamer-biometric
│       └── native/
│           ├── _layout.tsx  # Stack layout for native tests
│           ├── index.tsx
│           ├── auth.tsx    # tamer-auth (OAuth)
│           ├── linking.tsx  # tamer-linking
│           ├── browser.tsx  # tamer-display-browser
│           └── storage.tsx # tamer-secure-store (async key-value)
```

---

## Entry point

`src/index.tsx` bootstraps the app with [tamer-router](/packages/tamer-router) and generated routes:

```tsx
import '@lynx-js/react/debug'
import '@tamer4lynx/tamer-transports/lynx'
import { root } from '@lynx-js/react'
import { FileRouter } from '@tamer4lynx/tamer-router'
import routes from '@tamer4lynx/tamer-router/generated-routes'

root.render(<FileRouter routes={routes} />)
```

- **tamer-transports/lynx** — Polyfills for fetch, WebSocket, EventSource (needed for HMR and native networking).
- **FileRouter** — Renders the file-based route tree from `generated-routes`.
- **generated-routes** — Produced by tamer-router plugin from `src/pages/`.

---

## lynx.config.ts

Configures Rspeedy with Tamer plugins and workspace aliases:

| Section | Purpose |
|--------|---------|
| `source.alias` | Points `@tamer4lynx/*` to local workspace packages for development |
| `source.define` | Injects OAuth env vars (`OAUTH_CLIENT_ID`, etc.) from `.env` |
| `plugins` | `pluginTamer`, `pluginQRCode`, `pluginReactLynx`, `pluginTypeCheck` |

`pluginTamer()` discovers `tamer.config` from workspace packages (tamer-router provides defaults) and applies the file-based routing plugin.

---

## Routing

### Root layout (`pages/_layout.tsx`)

Uses **Tabs** from tamer-router and **useSystemUI** for status/nav bar:

```tsx
import { Tabs } from '@tamer4lynx/tamer-router'
import { useSystemUI } from '@tamer4lynx/tamer-system-ui'

export default function Layout() {
  const { setStatusBar, setNavigationBar } = useSystemUI()
  useEffect(() => {
    setStatusBar({ color: '#fff', style: 'light' })
    setNavigationBar({ color: '#fff', style: 'light' })
  }, [])

  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: '#555' }, tabBarStyle: { backgroundColor: '#555' } }}>
      <Tabs.Screen name="index" path="/" options={{ title: 'Tamer4Lynx', icon: 'home', label: 'Home' }} />
      <Tabs.Screen name="about" path="/about" options={{ title: 'About', icon: 'info', label: 'About' }} />
      <Tabs.Screen name="insets" path="/insets" options={{ title: 'Insets', icon: 'fit_screen', label: 'Insets' }} />
      <Tabs.Screen name="screen" path="/screen" options={{ title: 'Screen', icon: 'list', label: 'Screen' }} />
      <Tabs.Screen name="secure" path="/secure" options={{ title: 'Secure Number', icon: 'lock', label: 'Secure' }} />
    </Tabs>
  )
}
```

### Nested Stack (`pages/native/_layout.tsx`)

The `/native` route group uses a **Stack** for OAuth, linking, and browser screens:

```tsx
<Stack screenOptions={{ headerStyle: { backgroundColor: '#555' } }}>
  <Stack.Screen name="index" path="/native" options={{ title: 'Native Tests' }} />
  <Stack.Screen name="auth" path="/native/auth" options={{ title: 'OAuth' }} />
  <Stack.Screen name="linking" path="/native/linking" options={{ title: 'tamer-linking' }} />
  <Stack.Screen name="browser" path="/native/browser" options={{ title: 'tamer-display-browser' }} />
  <Stack.Screen name="storage" path="/native/storage" options={{ title: 'tamer-secure-store' }} />
</Stack>
```

---

## Pages and packages

| Page | Packages used | Purpose |
|------|----------------|---------|
| `index.tsx` | tamer-router, tamer-icons, jiggle | Home: logo tap, navigation buttons, Icon demo |
| `insets.tsx` | tamer-insets | Safe area, keyboard insets, `<textarea>` |
| `screen.tsx` | tamer-screen | Screen, SafeArea, AvoidKeyboard |
| `secure.tsx` | tamer-secure-store, tamer-biometric | Secure storage + biometric auth |
| `native/auth.tsx` | tamer-auth | OAuth 2.0 / PKCE flow |
| `native/linking.tsx` | tamer-linking | Deep linking |
| `native/browser.tsx` | tamer-display-browser | In-app browser for OAuth |
| `native/storage.tsx` | tamer-secure-store | Encrypted async storage demo (`getItemAsync` / `setItemAsync`) |

---

## Assets and fonts

- **Images** — `?inline` import for base64 embedding: `import tamerLogo from '../assets/tamer-logo.png?inline'`
- **Fonts** — `tamer-icons-fonts.generated.ts` maps font URLs to local TTF paths for [tamer-icons](/packages/tamer-icons) (Material Icons, Font Awesome).

---

## TypeScript

- **intrinsic-element.d.ts** — Extends Lynx types for `<input>`, `<textarea>`, and `<svg content="..." />`.
- **rspeedy-env.d.ts** — Declares `app-bar`, `icon` for JSX.

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `rspeedy dev` | Dev server with HMR |
| `build` | `rspeedy build` | Production bundle |
| `preview` | `rspeedy preview` | Web preview |
| `test` | `vitest run` | Unit tests |

From the monorepo root, use `t4l start` and `t4l build` to run the dev server and build the native app.

---

## Next steps

- [Getting Started](/docs/getting-started/) — Set up a new project
- [Configuration](/docs/configuration) — tamer.config.json, lynx.config.ts
- [tamer-router](/packages/tamer-router) — File-based routing details
