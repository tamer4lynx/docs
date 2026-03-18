# CLI Commands Reference

Granular reference for all Tamer4Lynx commands and flags.

---

## Global

| Command | Description |
|---------|-------------|
| `t4l` or `t4l init` | Interactive setup: creates `tamer.config.json` in the current directory |
| `t4l add [packages...]` | Add @tamer4lynx packages to the Lynx project |
| `t4l add-core` | Add core packages (app-shell, screen, router, insets, transports, input, system-ui, icons) |
| `t4l --help` | Show help |
| `t4l --version` | Show version |

---

## `t4l init`

Initialize `tamer.config.json` interactively. Prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path.

No flags.

---

## `t4l add [packages...]`

Add `@tamer4lynx` packages to the Lynx project. Detects npm, pnpm, or bun from lockfiles and runs the appropriate install in the Lynx project directory.

| Argument | Description |
|----------|-------------|
| `packages...` | Package names (e.g. `tamer-auth`, `input`, `@tamer4lynx/tamer-auth`). Bare names get `@tamer4lynx/` prefix. `input` maps to tamer-text-input. |

**Future:** `t4l add` may track installed versions for compatibility (Expo-style).

**Examples:**

```bash
t4l add tamer-auth
t4l add @tamer4lynx/tamer-auth @tamer4lynx/tamer-secure-store
```

---

## `t4l add-core`

Add core packages in one command: tamer-app-shell, tamer-screen, tamer-router, tamer-insets, tamer-transports, tamer-text-input (alias: input), tamer-system-ui, tamer-icons.

No flags. Run `t4l link` after adding.

---

## `t4l start`

Start the dev server with HMR and WebSocket support (Expo-like). Prints a QR code to scan with the Lynx dev app.

| Flag | Short | Description |
|------|-------|-------------|
| `--verbose` | `-v` | Show all logs (native + JS). Default shows JS only. |

---

## `t4l build`

Unified build command. Builds your app. Delegates to `android build` or `ios build` based on `--platform`. With **debug** (`-d`), the dev client (QR scan, HMR) is embedded when `@tamer4lynx/tamer-dev-client` is installed; with **release** (`-r`), the build has no dev client.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--platform <platform>` | `-p` | `all` | Which platform to build: `android`, `ios`, or `all` |
| `--embeddable` | `-e` | — | Output to `embeddable/` for adding LynxView to an existing app. Produces: **Android** — pre-built AAR (`tamer-embeddable.aar`) + Gradle source; **iOS** — CocoaPod (podspec + Swift init + bundle). Use with `--release`. |
| `--debug` | `-d` | default | Debug build with dev client embedded (if tamer-dev-client is installed). |
| `--release` | `-r` | — | Release build without dev client. Smaller, optimized. |
| `--install` | `-i` | — | Install APK to connected device and launch app after building (Android only). |

**`--embeddable` output:** Writes to `embeddable/`:
- **Android**: Pre-built `tamer-embeddable.aar` (Lynx + native modules + bundle) + Gradle project source. Add via `implementation(files("embeddable/tamer-embeddable.aar"))`.
- **iOS**: CocoaPod (`TamerEmbeddable.podspec`) + Swift init + bundle. Add via `pod 'TamerEmbeddable', :path => 'embeddable/ios'` then `pod install`.

**Examples:**

```bash
t4l build                          # debug, all platforms (with dev client if tamer-dev-client installed)
t4l build -p android -d --install   # debug Android, install to device
t4l build -p ios -d --install      # debug iOS, install to simulator
t4l build -p android -r            # release Android, no dev client
t4l build -p android -r --install
t4l build --embeddable --release   # AAR + CocoaPod for existing apps
```

---

## `t4l android create`

Create a new Android project.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--target <target>` | `-t` | `host` | Create target: `host` (production app) or `dev-app` (dev launcher with QR scan, HMR) |

---

## `t4l android link`

Link native modules to the Android project. Updates Gradle settings and app dependencies. Build commands run this automatically.

No flags.

---

## `t4l android bundle`

Build the Lynx bundle and copy it to Android assets. Runs autolink before bundling. Debug (`-d`) embeds the dev client when `@tamer4lynx/tamer-dev-client` is installed; release (`-r`) omits it.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--debug` | `-d` | default | Debug bundle with dev client embedded (if present) |
| `--release` | `-r` | — | Release bundle without dev client |

---

## `t4l android build`

Build APK. Runs autolink, then bundle, then Gradle. Does not depend on `autolink` in `tamer.config.json`; link always runs. Debug (`-d`) includes the dev client when `@tamer4lynx/tamer-dev-client` is installed; release (`-r`) builds without it.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--install` | `-i` | — | Install APK to connected device and launch app after building |
| `--embeddable` | `-e` | — | Build for embedding in existing app. Outputs: **AAR** (`tamer-embeddable.aar`). Use with `--release`. |
| `--debug` | `-d` | default | Debug APK with dev client embedded (if tamer-dev-client installed) |
| `--release` | `-r` | — | Release APK without dev client |

---

## `t4l android sync`

Sync dev client files (TemplateProvider, MainActivity, DevClientManager) into the Android project. When `@tamer4lynx/tamer-dev-client` is installed, sync adds the dev client; otherwise it removes or leaves them out.

No flags.

---

## `t4l android inject`

Inject tamer-host templates into an existing Android project.

| Flag | Short | Description |
|------|-------|-------------|
| `--force` | `-f` | Overwrite existing files. Without this, existing files are skipped. |

---

## `t4l ios create`

Create a new iOS project.

No flags.

---

## `t4l ios link`

Link native modules to the iOS project. Updates Podfile and runs `pod install`. Build commands run this automatically.

No flags.

---

## `t4l ios bundle`

Build the Lynx bundle and copy it to the iOS project. Runs autolink before bundling. Debug (`-d`) embeds the dev client when `@tamer4lynx/tamer-dev-client` is installed; release (`-r`) omits it.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--debug` | `-d` | default | Debug bundle with dev client embedded (if present) |
| `--release` | `-r` | — | Release bundle without dev client |

---

## `t4l ios build`

Build iOS app. Runs autolink, then bundle, then xcodebuild. Debug (`-d`) includes the dev client when `@tamer4lynx/tamer-dev-client` is installed; release (`-r`) builds without it.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--embeddable` | `-e` | — | Output to `embeddable/`: CocoaPod for iOS. Use with `--release`. |
| `--install` | `-i` | — | Install and launch on booted simulator after building |
| `--debug` | `-d` | default | Debug build with dev client embedded (if tamer-dev-client installed) |
| `--release` | `-r` | — | Release build without dev client |

---

## `t4l ios inject`

Inject tamer-host templates into an existing iOS project.

| Flag | Short | Description |
|------|-------|-------------|
| `--force` | `-f` | Overwrite existing files. Without this, existing files are skipped. |

---

## `t4l link`

Link native modules to the project. Runs both Android and iOS link unless `--ios` or `--android` is specified.

| Flag | Short | Description |
|------|-------|-------------|
| `--ios` | `-i` | Link only iOS native modules |
| `--android` | `-a` | Link only Android native modules |
| `--both` | `-b` | Link both platforms (default when no platform flag) |
| `--silent` | `-s` | Run without output. Useful for CI or postinstall scripts. |

---

## `t4l create`

Create a new Lynx extension project (RFC-compliant). Scaffolds `lynx.ext.json`, Android/iOS native code, and optional Element/Service support.

No flags.

---

## `t4l codegen`

Generate code from `@lynxmodule` declarations in `.d.ts` files. Run from an extension package root.

No flags.

---

## `t4l autolink-toggle` / `t4l autolink`

Toggle `autolink` on/off in `tamer.config.json`. When enabled, `t4l link` runs after `npm install` (if `postinstall` is configured). Does not affect build or bundle commands, which always run link.

No flags.
