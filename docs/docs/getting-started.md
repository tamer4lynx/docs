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

## Greenfield: Rspeedy + iOS host (example flow)

1. **Create the Lynx app** (Rspeedy does not always run `install` for you—run it explicitly):

```bash
bun create rspeedy
cd my-app
bun install
```

2. **Install the CLI** (pick one package manager):

```bash
bun add -g @tamer4lynx/cli@prerelease
```

3. **Initialize Tamer** — writes `tamer.config.json` and patches TypeScript config (see below):

```bash
t4l init
```

4. **Create the native iOS project** (use `t4l`, not Rspeedy—there is no `r4l` command):

```bash
t4l create ios
```

5. **Add packages** — dev launcher stack, or core only:

```bash
t4l add-dev    # dev-app, dev-client, and their @tamer4lynx dependencies
# or, if you do not need the dev client / dev app:
t4l add-core   # app-shell, screen, router, insets, transports, system-ui, icons
```

6. **Link native modules** (required after adding packages unless [autolink](/docs/configuration) is enabled):

```bash
t4l link ios
```

7. **Debug build and install on the simulator**:

```bash
t4l build ios -d -i
```

For **signed, App Store–style device builds**, use **`t4l build ios -p`** after `t4l signing ios`. That is **not** a simulator build. See [Commands](/commands) and the build table below.

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

Or run `t4l` with no arguments for interactive setup. The wizard prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path (leave blank for single-folder layout).

**TypeScript / `tsconfig.json`:** On save, `t4l init` updates the Lynx app’s `tsconfig.json` when it exists (root, or under `lynxProject` if you set one): it may **flatten project references** to avoid TS6310 when building, and it **adds an `include` glob** for Tamer declaration files: `node_modules/@tamer4lynx/tamer-*/src/**/*.d.ts`. Stop after the first file it successfully updates.

### 4. Start the dev server

```bash
t4l start
```

The terminal prints a QR code. Scan it with the Lynx dev app to connect and load your bundle with hot reload.

### 5. Build your app

Add **@tamer4lynx/tamer-dev-client** (e.g. via `t4l add-dev`) to embed the dev launcher for QR scan and HMR. **Debug** (`-d`) embeds the dev client when that package is installed. **Release** (`-r`) omits the dev client and is **unsigned**. **Production** (`-p`) is **signed** and intended for store or signed device distribution—configure signing first (`t4l signing`). See [Commands](/commands) for details.

Commands use the form `t4l <command> [target] [flags]`. For build, pass the platform as the target (or omit for both).

| Flag | Short | Description |
|------|-------|-------------|
| `--debug` | `-d` | Debug build with dev client (default). Requires `tamer-dev-client` for QR/HMR. |
| `--release` | `-r` | Release build **without** dev client; **unsigned** (not the same as store signing). |
| `--production` | `-p` | **Signed** build for App Store / signed distribution. **Not** a simulator build on iOS (`iphoneos`). Requires `t4l signing` first. |
| `--install` | `-i` | After build: Android installs APK; iOS **debug** installs to **simulator**, **production** installs to a **connected device** (`devicectl`). |
| `--embeddable` | `-e` | Output embeddable artifacts for existing apps; implies a release-style embeddable build (see [Commands](/commands)). |

**iOS quick reference:** `-p` always targets **devices** (`iphoneos`). `-d -i` targets the **simulator** and installs there. `-d` without `-i` still builds for `iphoneos` but with signing disabled (local artifact, not for App Store).

```bash
t4l build                          # debug, all platforms (dev client if tamer-dev-client installed)
t4l build android --install        # debug Android, install to device
t4l build ios --install            # debug iOS, install to booted simulator
t4l build android --release        # release Android, no dev client, unsigned
t4l build ios -p                   # signed production (device); use after signing setup
t4l build --embeddable             # embeddable output (release-style)
```

Use the dev client (when built with `-d`) to connect to your local dev server via URL or QR, then develop with HMR.

Whenever you add or remove **`@tamer4lynx/*`** native packages, run **`t4l link`** (or **`t4l link ios`** / **`t4l link android`**) so autolinking updates native projects—unless **`autolink: true`** in `tamer.config.json` runs `t4l link` after installs (see `t4l autolink-toggle`). On iOS with **tamer-dev-client**, autolink also refreshes **`tamer-host-native-modules.json`** (used for dev-server compatibility checks).

## Next steps

- [Configuration Reference](/docs/configuration) — tamer.config.json, tamer.config.ts, lynx.ext.json
- [Commands](/commands) — full CLI reference
- [tamer-dev-client](/packages/tamer-dev-client) — Dev launcher API and setup
- [tamer-router](/packages/tamer-router) — File-based routing and layouts

## Lynx ecosystem

- [Lynx](https://lynxjs.org/) — Cross-platform rendering engine
- [Rspeedy](https://lynxjs.org/rspeedy/) — Build tool for Lynx
- [ReactLynx](https://lynxjs.org/react/) — React on Lynx

## Framework agnostic

Tamer4Lynx is conceptually Lynx framework agnostic. Native modules and tooling should work with any Lynx framework binding, including [miso-lynx](https://github.com/haskell-miso/miso-lynx) and [VueLynx](https://github.com/rahul-vashishtha/lynx-stack/tree/lynx-vue-implementation/packages/vue) (@lynx-js/vue). Some packages like **tamer-router** are specifically designed for @lynx-js/react (Stack, Tabs, react-router integration).
