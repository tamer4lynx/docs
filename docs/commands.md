# CLI Commands Reference

Granular reference for all Tamer4Lynx commands and flags.

---

## Global

| Command | Description |
|---------|-------------|
| `t4l` or `t4l init` | Interactive setup: creates `tamer.config.json` in the current directory |
| `t4l add [packages...]` | Add @tamer4lynx packages to the Lynx project |
| `t4l add-core` | Add core packages (app-shell, screen, router, insets, transports, text-input, system-ui, icons) |
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
| `packages...` | Package names (e.g. `tamer-auth`, `@tamer4lynx/tamer-auth`). Bare names get `@tamer4lynx/` prefix. |

**Future:** `t4l add` may track installed versions for compatibility (Expo-style).

**Examples:**

```bash
t4l add tamer-auth
t4l add @tamer4lynx/tamer-auth @tamer4lynx/tamer-secure-store
```

---

## `t4l add-core`

Add core packages in one command: tamer-app-shell, tamer-screen, tamer-router, tamer-insets, tamer-transports, tamer-text-input, tamer-system-ui, tamer-icons.

No flags. Run `t4l link` after adding.

---

## `t4l start`

Start the dev server with HMR and WebSocket support (Expo-like). Prints a QR code to scan with the Lynx dev app.

| Flag | Short | Description |
|------|-------|-------------|
| `--verbose` | `-v` | Show all logs (native + JS). Default shows JS only. |

---

## `t4l build`

Unified build command. Delegates to `android build` or `ios build` based on `--platform`. Default target is `dev-app` (dev launcher with QR scan, HMR).

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--platform <platform>` | `-p` | `all` | Which platform to build: `android`, `ios`, or `all` |
| `--target <target>` | `-t` | `dev-app` | Build target: `host` (production app) or `dev-app` (dev launcher with QR scan, HMR) |
| `--embeddable` | `-e` | — | Output to `embeddable/` for adding LynxView to an existing app. Produces: **Android** — pre-built AAR (`tamer-embeddable.aar`) + Gradle source; **iOS** — CocoaPod (podspec + Swift init + bundle). Use with `--release`. |
| `--debug` | `-d` | default | Build debug (development) configuration. |
| `--release` | `-r` | — | Build release (production) configuration. Smaller, optimized. |
| `--install` | `-i` | — | Install APK to connected device and launch app after building (Android only). |

**`--embeddable` output:** Writes to `embeddable/`:
- **Android**: Pre-built `tamer-embeddable.aar` (Lynx + native modules + bundle) + Gradle project source. Add via `implementation(files("embeddable/tamer-embeddable.aar"))`.
- **iOS**: CocoaPod (`TamerEmbeddable.podspec`) + Swift init + bundle. Add via `pod 'TamerEmbeddable', :path => 'embeddable/ios'` then `pod install`.

**Examples:**

```bash
t4l build                                    # dev-app, all platforms, debug
t4l build --platform android --install       # dev-app, Android, install to device
t4l build --platform ios --install           # dev-app, iOS, install to simulator
t4l build --platform android --target host   # production host app, Android
t4l build --platform android --target host --release --install
t4l build --embeddable --release             # AAR + CocoaPod for existing apps
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

Build the Lynx bundle and copy it to Android assets. Runs autolink before bundling.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--target <target>` | `-t` | `host` | Bundle target: `host` or `dev-app` |
| `--debug` | `-d` | default | Build debug (development) bundle |
| `--release` | `-r` | — | Build release (production) bundle |

---

## `t4l android build`

Build APK. Runs autolink, then bundle, then Gradle. Does not depend on `autolink` in `tamer.config.json`; link always runs.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--install` | `-i` | — | Install APK to connected device and launch app after building |
| `--target <target>` | `-t` | `host` | Build target: `host` or `dev-app` |
| `--embeddable` | `-e` | — | Build for embedding in existing app (host only). Outputs: **AAR** (`tamer-embeddable.aar`) for Android; **CocoaPod** (TamerEmbeddable.podspec) for iOS. Use with `--release`. |
| `--debug` | `-d` | default | Build debug (development) APK |
| `--release` | `-r` | — | Build release (production) APK |

---

## `t4l android sync`

Sync dev client files (TemplateProvider, MainActivity, DevClientManager) from `tamer.config.json` into the Android project.

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

Build the Lynx bundle and copy it to the iOS project. Runs autolink before bundling.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--target <target>` | `-t` | `host` | Bundle target: `host` or `dev-app` |
| `--debug` | `-d` | default | Build debug (development) bundle |
| `--release` | `-r` | — | Build release (production) bundle |

---

## `t4l ios build`

Build iOS app. Runs autolink, then bundle, then xcodebuild.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--target <target>` | `-t` | `host` | Build target: `host` or `dev-app` |
| `--embeddable` | `-e` | — | Output to `embeddable/`: **AAR** for Android; **CocoaPod** for iOS. Use with `--release`. |
| `--install` | `-i` | — | Install and launch on booted simulator after building |
| `--debug` | `-d` | default | Build debug (development) configuration |
| `--release` | `-r` | — | Build release (production) configuration |

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
