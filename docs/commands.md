# Commands

CLI reference for Tamer4Lynx. Run `t4l` or `bun index.ts` from the project root.

## Project setup

| Command | Description |
|---------|-------------|
| `init` | Initialize `tamer.config.json` interactively. Also runs when you execute `t4l` with no arguments. |
| `create` | Create a new Lynx extension project (RFC-compliant) |
| `codegen` | Generate code from `@lynxmodule` declarations |
| `autolink-toggle` | Toggle autolink on/off in `tamer.config.json` (controls postinstall linking) |

## Development

| Command | Description |
|---------|-------------|
| `start` | Start dev server with HMR and WebSocket support. Use `-v, --verbose` for all logs. |
| `link` | Link native modules. Options: `-i, --ios`, `-a, --android`, `-b, --both`, `-s, --silent` |

## Build (unified)

| Command | Description |
|---------|-------------|
| `build` | Build app for all platforms. Options: `-p, --platform <android|ios|all>`, `-t, --target <host|dev-app>`, `-e, --embeddable`, `-d, --debug`, `-r, --release`, `-i, --install` |

## Android

| Command | Description |
|---------|-------------|
| `android create` | Create Android project. `-t, --target <host|dev-app>` (default: host) |
| `android link` | Link native modules to the Android project |
| `android bundle` | Build Lynx bundle and copy to Android assets. `-t, --target`, `-d, --debug`, `-r, --release` |
| `android build` | Build APK (autolink + bundle + gradle). `-i, --install`, `-t, --target`, `-e, --embeddable`, `-d, --debug`, `-r, --release` |
| `android sync` | Sync dev client files (TemplateProvider, MainActivity, DevClientManager) |
| `android inject` | Inject tamer-host templates into existing project. `-f, --force` |

## iOS

| Command | Description |
|---------|-------------|
| `ios create` | Create iOS project |
| `ios link` | Link native modules to the iOS project |
| `ios bundle` | Build Lynx bundle and copy to iOS project. `-t, --target`, `-d, --debug`, `-r, --release` |
| `ios build` | Build iOS app (autolink + bundle + xcodebuild). `-t, --target`, `-e, --embeddable`, `-i, --install`, `-d, --debug`, `-r, --release` |
| `ios inject` | Inject tamer-host templates into existing project. `-f, --force` |

## Deprecated

| Command | Description |
|---------|-------------|
| `build-dev-app` | Use `t4l build --platform <platform> [--install]` instead |

## Quick links

- [Getting Started](/docs/getting-started) — Install, init, dev server, build dev app
- [Packages](/packages/) — tamer-router, tamer-dev-client, tamer-host, and more

## Lynx ecosystem

- [Lynx](https://lynxjs.org/) — Cross-platform rendering engine
- [Rspeedy](https://lynxjs.org/rspeedy/) — Build tool for Lynx
- [ReactLynx](https://lynxjs.org/react/) — React on Lynx
