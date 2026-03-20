# CLI Commands Reference

Commands use the form **`t4l <command> [target] [flags]`**. Target is a platform (`ios`, `android`) or, for create, an extension type (`module`, `element`, `service`, `combo`). All flags support both short and long form (e.g. `-d` or `--debug`).

---

## Global

| Command | Description |
|---------|-------------|
| `t4l` or `t4l init` | Interactive setup: creates `tamer.config.json` in the current directory |
| `t4l add [packages...]` | Add @tamer4lynx packages to the Lynx project |
| `t4l add-core` | Add core packages (app-shell, screen, router, insets, transports, system-ui, icons) |
| `t4l --help` | Show help |
| `t4l --version` | Show version |

---

## `t4l init`

Initialize `tamer.config.json` interactively. Prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path.

No flags.

---

## `t4l create <target>`

Create a project or extension. **Target:** `ios` | `android` | `module` | `element` | `service` | `combo`.

| Target | Description |
|--------|-------------|
| `ios` | Create iOS project |
| `android` | Create Android project (host by default; use `-r` for dev-app) |
| `module` | Create Lynx extension with native module only |
| `element` | Create Lynx extension with custom element (JSX preserved) |
| `service` | Create Lynx extension with service only |
| `combo` | Create Lynx extension with module + element + service |

| Flag | Short | Description |
|------|-------|-------------|
| `--debug` | `-d` | For android: create host project (default) |
| `--release` | `-r` | For android: create dev-app project |

Cannot use `--debug` and `--release` together.

**Examples:**

```bash
t4l create ios
t4l create android              # host project
t4l create android -r           # dev-app project
t4l create android --release
t4l create module
t4l create element
t4l create combo
```

---

## `t4l build [platform]`

Build your app. **Platform:** `ios` | `android` (optional; omit for both). With **debug** (`-d`), the dev client (QR scan, HMR) is embedded when `@tamer4lynx/tamer-dev-client` is installed; with **release** (`-r`), the build has no dev client.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--embeddable` | `-e` | — | Output to `embeddable/` for adding LynxView to an existing app. Use with `--release`. |
| `--debug` | `-d` | default | Debug build with dev client embedded (if tamer-dev-client is installed). |
| `--release` | `-r` | — | Release build without dev client. |
| `--install` | `-i` | — | Install APK to device or app to simulator after building. |

**Examples:**

```bash
t4l build
t4l build android
t4l build android -i
t4l build ios -r
t4l build android --release --install
t4l build --embeddable --release
```

**Node 22+ and `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` (dev-client):** Older `@tamer4lynx/tamer-dev-client` releases (e.g. **0.0.10**) only published `lynx.config.ts`. Rspeedy picks `.ts` before `.mjs`, and Node 22 will not strip types for files under `node_modules`. Use **≥ 0.0.12** (`lynx.config.mjs` + `rspeedy build --config lynx.config.mjs`), or temporarily use Node 20 for the install/build.

---

## `t4l link [platform]`

Link native modules to the project and sync native dependencies. **Platform:** `ios` | `android` | `both` (optional; default `both`).

- **iOS:** Updates Podfile and `LynxInitProcessor.swift` (imports, module registrations, `DevClientModule.attachSupportedModuleClassNames`), then runs **`pod install`** in the `ios` directory. If `@tamer4lynx/tamer-dev-client` is installed, also writes **`tamer-host-native-modules.json`** into `ios/<AppName>/` (lists JVM-style `moduleClassName` values matching dev server `meta.json`) and registers it in the Xcode project’s **Copy Bundle Resources**.
- **Android:** Updates settings.gradle.kts, app/build.gradle.kts, and generated code, then runs **Gradle sync** (`./gradlew projects`) in the `android` directory.

| Flag | Short | Description |
|------|-------|-------------|
| `--silent` | `-s` | Run without output. Useful for CI or postinstall scripts. |

**Examples:**

```bash
t4l link
t4l link android
t4l link --silent
```

**Host apps (`tamer-dev-app`, projects created with `t4l ios create`):** `LynxInitProcessor.swift` from **tamer-dev-client** templates only contains `GENERATED IMPORTS` / `GENERATED AUTOLINK` placeholders. Run `t4l link` from the app root (where `tamer.config.json` lives) so those sections are filled from your `node_modules` `@tamer4lynx/*` packages. In the monorepo, `packages/tamer-dev-app` provides `npm run link:native` after building the CLI (`npm run build` at repo root).

**iOS `No podspec found` for a Tamer package:** Often the app depended on **`npm install …@latest`**, where **`latest`** points at an older tarball without `ios/`. Reinstall the **newest published semver** (e.g. `bun add @tamer4lynx/tamer-insets@0.0.3`) or use **`t4l add`**, which resolves the **highest version** from the registry, then `t4l link ios` again.

---

## `t4l bundle [platform]`

Build the Lynx bundle and copy it to the native project. **Platform:** `ios` | `android` (optional; omit for both). Runs **autolink** before bundling (iOS: includes `tamer-host-native-modules.json` when dev-client is present — see `t4l link`).

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--debug` | `-d` | default | Debug bundle with dev client embedded (if present) |
| `--release` | `-r` | — | Release bundle without dev client |

---

## `t4l inject <platform>`

Inject tamer-host templates into an existing project. **Platform:** `ios` | `android` (required).

| Flag | Short | Description |
|------|-------|-------------|
| `--force` | `-f` | Overwrite existing files. Without this, existing files are skipped. |

**Examples:**

```bash
t4l inject android
t4l inject ios -f
```

---

## `t4l sync [platform]`

Sync dev client files (TemplateProvider, MainActivity, DevClientManager) from tamer.config.json. **Platform:** `android` only (default).

**Examples:**

```bash
t4l sync
t4l sync android
```

---

## `t4l start`

Start the dev server with HMR and WebSocket support (Expo-like). Prints a QR code to scan with the Lynx dev app.

| Flag | Short | Description |
|------|-------|-------------|
| `--verbose` | `-v` | Show all logs (native + JS). Default shows JS only. |

---

## `t4l add [packages...]`

Add `@tamer4lynx` packages to the Lynx project. Detects npm, pnpm, or bun from lockfiles and runs the appropriate install in the Lynx project directory.

For **scoped `@tamer4lynx/*` packages without a version**, the CLI runs **`npm view <pkg> versions --json`**, picks the **highest semver** published on the registry, and installs `name@version`. That avoids relying on npm’s **`latest`** dist-tag or a single tag like **`prerelease`** when they point at an older publish. If the registry query fails, it falls back to `@prerelease`. Requires **network access** to the npm registry.

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

Add core packages in one command: tamer-app-shell, tamer-screen, tamer-router, tamer-insets, tamer-transports, tamer-system-ui, tamer-icons. Resolves the **highest published semver** per package (same as `t4l add`). Run `t4l link` after adding.

No flags. Run `t4l link` after adding.

---

## `t4l codegen`

Generate code from `@lynxmodule` declarations in `.d.ts` files. Run from an extension package root.

No flags.

---

## `t4l autolink-toggle` / `t4l autolink`

Toggle `autolink` on/off in `tamer.config.json`. When enabled, `t4l link` runs after `npm install` (if `postinstall` is configured). Does not affect build or bundle commands, which always run link.

No flags.

---

## Legacy (platform-first) commands

The following form still works: **`t4l <platform> <subcommand> [flags]`**.

| Command | Description |
|---------|-------------|
| `t4l android create` | Same as `t4l create android`. Use `-r` or `--release` for dev-app. |
| `t4l android link` | Same as `t4l link android` |
| `t4l android bundle` | Same as `t4l bundle android`. Flags: `-d`, `-r`. |
| `t4l android build` | Same as `t4l build android`. Flags: `-d`, `-r`, `-i`, `-e`. |
| `t4l android sync` | Same as `t4l sync android` |
| `t4l android inject` | Same as `t4l inject android`. Flag: `-f`. |
| `t4l ios create` | Same as `t4l create ios` |
| `t4l ios link` | Same as `t4l link ios` |
| `t4l ios bundle` | Same as `t4l bundle ios`. Flags: `-d`, `-r`. |
| `t4l ios build` | Same as `t4l build ios`. Flags: `-d`, `-r`, `-i`, `-e`. |
| `t4l ios inject` | Same as `t4l inject ios`. Flag: `-f`. |

**Note:** `t4l link` previously used `--ios` / `--android`; the new form is `t4l link ios` or `t4l link android`. The legacy flags are no longer used; use the platform argument instead.
