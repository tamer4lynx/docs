# tamer-dev-client

Native dev client module for Tamer4Lynx — QR scan, discovery, URL persistence, reload bridge, embedded dev launcher UI.

## Overview

The dev client provides:

- **Discovery** — Find dev servers on the local network (mDNS)
- **Connect** — Enter URL or scan QR code to connect
- **Recent** — List of recently used dev server URLs
- **Reload** — Reload the Lynx bundle from the dev server
- **Compatibility check** — Validates native modules between app and project; shows modal if incompatible

When you **build with debug** (`t4l build -d` or `t4l build`), the dev client UI is embedded and the Lynx bundle is loaded from the connected dev server. Build with **release** (`t4l build -r`) to produce an app without the dev client.

## Installation

```bash
npm install @tamer4lynx/tamer-dev-client
```

Add to your app's dependencies. Linking runs automatically on install when your project has a postinstall script; otherwise run `t4l link`.

## Dependencies

Requires: `tamer-app-shell`, `tamer-insets`, `tamer-system-ui`, `tamer-plugin`, `tamer-router`, `react-router`, `@lynx-js/react`.

## Setup

Wrap your app with `DevLauncherProvider`:

```tsx
import { root } from '@lynx-js/react'
import { FileRouter } from '@tamer4lynx/tamer-router'
import { DevLauncherProvider } from '@tamer4lynx/tamer-dev-client'
import routes from '@tamer4lynx/tamer-router/generated-routes'

root.render(
  <DevLauncherProvider>
    <FileRouter routes={routes} />
  </DevLauncherProvider>
)
```

## API

### DevLauncherProvider

Context provider for the dev launcher. Pass `children` (your app tree).

### useDevLauncher()

Returns the dev launcher context. Throws if used outside `DevLauncherProvider`.

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Current dev server URL |
| `setUrl` | `(u: string) => void` | Set URL |
| `navigateToConnectRef` | `MutableRefObject<(() => void) \| null>` | Ref for navigating to Connect tab (e.g. after QR scan) |
| `theme` | `DevLauncherTheme \| null` | Theme from native (or null) |
| `setTheme` | `(t: DevLauncherTheme \| null) => void` | Set theme |
| `recentUrls` | `string[]` | Recently used URLs |
| `discoveredServers` | `DiscoveredServer[]` | mDNS-discovered servers |
| `incompatibleModalVisible` | `boolean` | Whether compatibility modal is shown |
| `setIncompatibleModalVisible` | `(v: boolean) => void` | Show/hide modal |
| `incompatibleModules` | `RequiredModule[]` | Modules required by project but missing in app |
| `refreshRecent` | `() => void` | Refresh recent URLs from native |
| `connectToUrl` | `(parsed: string) => void` | Connect to a parsed URL, reload bundle |
| `openProject` | `(rawUrl: string) => void` | Parse URL and connect |
| `onSelectRecent` | `(u: string) => void` | Set URL when selecting from recent list |
| `onScanQR` | `() => void` | Trigger QR scan |
| `parseUrl` | `(input: string) => string` | Normalize URL (`tamer://` → `http://`, strip `/main.lynx.bundle`) |

### DevLauncherTheme

```ts
interface DevLauncherTheme {
  primary?: string
  primaryDark?: string
  background?: string
  surface?: string
  surfaceContainer?: string
  onSurface?: string
  onSurfaceVariant?: string
  isDark?: boolean
}
```

### resolveTheme(theme)

Merges partial theme with `FALLBACK_THEME`. Use when theme may be null.

### DiscoveredServer

```ts
type DiscoveredServer = { url: string; name: string }
```

### RequiredModule

```ts
type RequiredModule = { packageName: string; moduleClassName: string }
```

### devCall(method, data?, callback?)

Low-level native bridge. Methods:

| Method | Data | Callback | Description |
|--------|------|----------|-------------|
| `setDevServerUrl` | `{ url: string }` | — | Save dev server URL |
| `getDevServerUrl` | — | `(url: string) => void` | Get saved URL |
| `getRecentUrls` | — | `(urls: string[]) => void` | Get recent URLs |
| `getDiscoveredServers` | — | `(servers: DiscoveredServer[]) => void` | Get mDNS servers |
| `startDiscovery` | — | — | Start mDNS discovery |
| `stopDiscovery` | — | — | Stop discovery |
| `reloadWithProjectBundle` | — | — | Reload bundle from dev server |
| `checkServerCompatibility` | `{ url: string }` | `(compatible: boolean, requiredModules: unknown) => void` | Check if app has modules required by project |
| `scanQR` | — | — | Open QR scanner |

### toRequiredModules(raw)

Parses `checkServerCompatibility` callback result into `RequiredModule[]`.

## Built-in pages

The dev client ships with Connect, Recent, and Discover pages. The layout uses `Tabs` with `titleForPath` for dynamic titles. Events:

- `devclient:scanResult` — QR scan result (payload: `{ url }`)
- `devclient:discoveredServers` — mDNS servers (payload: `{ servers }`)

## Standard module pattern

`tamer-dev-client` is a standard tamer module. When installed, `t4l android sync` and `t4l ios sync` read host templates from the package (`android/templates/`, `ios/templates/`) and apply them to wire the dev client into your host app. The templates use `{{PACKAGE_NAME}}` and `{{APP_NAME}}` placeholders.

## Build behavior

- **Debug build** (`t4l build -d` or `t4l build`): If `@tamer4lynx/tamer-dev-client` is in your app's dependencies, the dev client is embedded. Your app becomes a dev app (QR scan, HMR).
- **Release build** (`t4l build -r`): The dev client is not included. Use for production or store builds.

## tamer-dev-app

**tamer-dev-app** is a standalone app (separate from your project) that also uses tamer-dev-client. It is the app-store version of the dev launcher. Most developers add **tamer-dev-client** to their own app and build with `-d` to get a dev app; tamer-dev-app is for users who install the generic dev launcher from the store.
