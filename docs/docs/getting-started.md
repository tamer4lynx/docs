# Getting Started

Quick start with Tamer4Lynx: install the CLI, then use it in a Lynx project.

## Prerequisites

- Node.js 20.19+ or Bun
- Android SDK (for Android builds)
- Xcode (for iOS, macOS only)

---

## Install Tamer4Lynx (one-time)

All Tamer packages are under the `@tamer4lynx` scope on npm. Install the CLI globally:

```bash
npm i -g @tamer4lynx/tamer4lynx
```

With pnpm or Bun:

```bash
pnpm add -g @tamer4lynx/tamer4lynx
bun add -g @tamer4lynx/tamer4lynx
```

Or from GitHub (run `npm uninstall -g @tamer4lynx/tamer4lynx` first if switching):

```bash
npm i -g tamer4lynx/tamer4lynx
```

---

## Use in a project

### 1. Create a Lynx project (or use existing)

Create a new Lynx project with Rspeedy:

```bash
pnpm create rspeedy
```

**Using your own Lynx project?** Tamer4Lynx works with any Lynx binding — [miso-lynx](https://github.com/haskell-miso/miso-lynx), [VueLynx](https://github.com/rahul-vashishtha/lynx-stack/tree/lynx-vue-implementation/packages/vue) (@lynx-js/vue), or other Lynx bindings. Run `t4l init` from your project root.

### 2. Initialize config

From the project root (where `tamer.config.json` will live):

```bash
t4l init
```

Or run `t4l` with no arguments for interactive setup. The script prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path.

### 3. Start the dev server

```bash
t4l start
```

The terminal prints a QR code. Scan it with the Lynx dev app to connect and load your bundle with hot reload.

### 4. Build the dev app

The dev app embeds **tamer-dev-client** and loads your Lynx bundle from the connected dev server.

| Flag | Description |
|------|-------------|
| `--platform android` \| `ios` \| `all` | Build for one or both platforms. Default: `all`. |
| `--target dev-app` \| `host` | `dev-app` (default): dev launcher with QR scan, HMR. `host`: production app. |
| `--install` | Install APK to device or app to simulator after building. |
| `--release` | Production build (optimized). Omit for debug. |
| `--embeddable` | Output to `embeddable/`: **AAR** (Android) + **CocoaPod** (iOS) for adding LynxView to an existing app. Use with `--release`. |

```bash
t4l build
t4l build --platform android --install
t4l build --platform ios --install
t4l build --embeddable --release   # for embedding in existing apps
```

Use the dev app to connect to your local dev server (via URL or QR), then develop with HMR.

## Next steps

- [Configuration Reference](/docs/configuration) — tamer.config.json, tamer.config.ts, lynx.ext.json
- [tamer-dev-client](/packages/tamer-dev-client) — Dev launcher API and setup
- [tamer-router](/packages/tamer-router) — File-based routing and layouts

## Lynx ecosystem

- [Lynx](https://lynxjs.org/) — Cross-platform rendering engine
- [Rspeedy](https://lynxjs.org/rspeedy/) — Build tool for Lynx
- [ReactLynx](https://lynxjs.org/react/) — React on Lynx

## Framework agnostic

Tamer4Lynx is conceptually Lynx framework agnostic. Native modules and tooling should work with any Lynx framework binding, including [miso-lynx](https://github.com/haskell-miso/miso-lynx) and [VueLynx](https://github.com/rahul-vashishtha/lynx-stack/tree/lynx-vue-implementation/packages/vue) (@lynx-js/vue). Some packages like **tamer-router** are specifically designed for @lynx-js/react (Stack, Tabs, react-router integration).
