# Getting Started

Quick start with Tamer4Lynx: install the CLI, then use it in a Lynx project.

## Prerequisites

- Node.js 20.19+ or Bun
- Android SDK (for Android builds)
- Xcode (for iOS, macOS only)

---

## Install Tamer4Lynx (one-time)

All Tamer packages are under the `@tamer4lynx` scope on npm. Install the CLI globally (use `@prerelease` for latest):

```bash
npm i -g @tamer4lynx/cli@prerelease
pnpm add -g @tamer4lynx/cli@prerelease
bun add -g @tamer4lynx/cli@prerelease
```

Or from GitHub (run `npm uninstall -g @tamer4lynx/cli` first if switching):

```bash
npm i -g tamer4lynx/tamer4lynx
```

---

## Use in a project

### 1. Create a Lynx project (or use existing)

Create a new Lynx project with Rspeedy:

```bash
pnpm create rspeedy
cd my-app
```

Install dependencies:

```bash
npm install
# or
pnpm install
# or
bun install
```

**Using your own Lynx project?** Tamer4Lynx works with any Lynx binding — [miso-lynx](https://github.com/haskell-miso/miso-lynx), [VueLynx](https://github.com/rahul-vashishtha/lynx-stack/tree/lynx-vue-implementation/packages/vue) (@lynx-js/vue), or other Lynx bindings. Run `t4l init` from your project root.

### 2. Project layout: single folder vs monorepo

A Tamer4Lynx project can be **one folder** or a **monorepo**:

| Layout | Structure | When to use |
|--------|-----------|-------------|
| **Single folder** | `tamer.config.json`, Lynx app (`src/`, `lynx.config.ts`), `android/`, `ios/` all in the same directory | New projects, simple apps. Run `t4l init` and omit Lynx project path (or use `.`). |
| **Monorepo** | `tamer.config.json` at root; Lynx app in `packages/myapp`; `android/`, `ios/` at root | Multiple packages, shared tooling. Set `lynxProject: "packages/myapp"` in config. |

The example in this repo uses a monorepo layout. For a single-folder project, copy a Lynx app into a new directory, run `t4l init` there, and create native projects with `t4l create android` / `t4l create ios`. Everything lives in one place.

### 3. Initialize config

From the project root (where `tamer.config.json` will live):

```bash
t4l init
```

Or run `t4l` with no arguments for interactive setup. The script prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path (leave blank for single-folder layout).

### 4. Start the dev server

```bash
t4l start
```

The terminal prints a QR code. Scan it with the Lynx dev app to connect and load your bundle with hot reload.

### 5. Build your app

Add **@tamer4lynx/tamer-dev-client** to your app to get a dev build with QR scan and HMR. Build with **debug** (`-d`) to embed the dev client; build with **release** (`-r`) for a production build without it.

Commands use the form `t4l <command> [target] [flags]`. For build, pass the platform as the target (or omit for both).

| Flag | Short | Description |
|------|-------|-------------|
| `--debug` | `-d` | Debug build with dev client (default). Requires `tamer-dev-client` for QR/HMR. |
| `--release` | `-r` | Release build without dev client. |
| `--install` | `-i` | Install APK to device or app to simulator after building. |
| `--embeddable` | `-e` | Output to `embeddable/`: **AAR** (Android) + **CocoaPod** (iOS). Use with `--release`. |

```bash
t4l build                          # debug, all platforms (dev client if tamer-dev-client installed)
t4l build android --install        # debug Android, install to device
t4l build ios --install            # debug iOS, install to simulator
t4l build android --release        # release Android, no dev client
t4l build --embeddable --release   # for embedding in existing apps
```

Use the dev client (when built with `-d`) to connect to your local dev server via URL or QR, then develop with HMR.

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
