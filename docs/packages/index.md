# Packages

All Tamer packages are under the `@tamer4lynx` scope on npm. Use `@prerelease` for latest. Install and run `t4l link` after adding.

**Install:** `npm i @tamer4lynx/<pkg>@prerelease` | `pnpm add @tamer4lynx/<pkg>@prerelease` | `bun add @tamer4lynx/<pkg>@prerelease`

See [Example Anatomy](/docs/example-anatomy) for a walkthrough of `packages/example` and how these packages fit together. 

**add-core** 📦 = included in `t4l add-core` (app-shell, screen, router, insets, transports, input, system-ui, icons).

## Core

| Package | add-core | Install | Description |
|---------|:--------:|---------|-------------|
| [@tamer4lynx/tamer-dev-client](/packages/tamer-dev-client) | | `npm i @tamer4lynx/tamer-dev-client@prerelease` | Dev launcher — QR scan, discovery, URL persistence, reload |
| [@tamer4lynx/tamer-host](/packages/tamer-host) | | `npm i @tamer4lynx/tamer-host@prerelease` | Production Lynx host templates for injecting into existing apps |
| [@tamer4lynx/tamer-router](/packages/tamer-router) | 📦 | `npm i @tamer4lynx/tamer-router@prerelease` | File-based routing, Stack and Tabs layouts |
| [@tamer4lynx/tamer-plugin](/packages/tamer-plugin) | | `npm i @tamer4lynx/tamer-plugin@prerelease` | Rsbuild plugin for tamer config |
| [@tamer4lynx/tamer-app-shell](/packages/tamer-app-shell) | 📦 | `npm i @tamer4lynx/tamer-app-shell@prerelease` | AppBar, TabBar, Content components |

## UI

| Package | add-core | Install | Description |
|---------|:--------:|---------|-------------|
| [@tamer4lynx/tamer-screen](/packages/tamer-screen) | 📦 | `npm i @tamer4lynx/tamer-screen@prerelease` | Screen, SafeArea, AvoidKeyboard |
| [@tamer4lynx/tamer-insets](/packages/tamer-insets) | 📦 | `npm i @tamer4lynx/tamer-insets@prerelease` | Safe area and keyboard insets |
| [@tamer4lynx/tamer-system-ui](/packages/tamer-system-ui) | 📦 | `npm i @tamer4lynx/tamer-system-ui@prerelease` | Status bar, nav bar, theme colors |
| [@tamer4lynx/tamer-icons](/packages/tamer-icons) | 📦 | `npm i @tamer4lynx/tamer-icons@prerelease` | Icon component, Material/FontAwesome |
| [@tamer4lynx/tamer-text-input](/packages/tamer-text-input) | 📦 | `npm i @tamer4lynx/tamer-text-input@prerelease` | Custom `<tamer-input>` element (combines input/textarea like React Native TextInput) |

## Platform

| Package | add-core | Install | Description |
|---------|:--------:|---------|-------------|
| [@tamer4lynx/tamer-transports](/packages/tamer-transports) | 📦 | `npm i @tamer4lynx/tamer-transports@prerelease` | Fetch, WebSocket, EventSource polyfills |
| [@tamer4lynx/lynxwebsockets](/packages/lynxwebsockets) | | `npm i @tamer4lynx/lynxwebsockets@prerelease` | Native WebSocket module and polyfill |
| [@tamer4lynx/jiggle](/packages/jiggle) | | `npm i @tamer4lynx/jiggle@prerelease` | Vibration/haptic native module |
| [@tamer4lynx/tamer-auth](/packages/tamer-auth) | | `npm i @tamer4lynx/tamer-auth@prerelease` | OAuth 2.0 / PKCE |
| [@tamer4lynx/tamer-secure-store](/packages/tamer-secure-store) | | `npm i @tamer4lynx/tamer-secure-store@prerelease` | Secure key-value storage |
| [@tamer4lynx/tamer-biometric](/packages/tamer-biometric) | | `npm i @tamer4lynx/tamer-biometric@prerelease` | Biometric authentication |
| [@tamer4lynx/tamer-linking](/packages/tamer-linking) | | `npm i @tamer4lynx/tamer-linking@prerelease` | Deep linking |
| [@tamer4lynx/tamer-display-browser](/packages/tamer-display-browser) | | `npm i @tamer4lynx/tamer-display-browser@prerelease` | In-app browser for OAuth |
