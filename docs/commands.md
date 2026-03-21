# CLI Commands Reference

Commands use the form **`t4l <command> [target] [flags]`**. Target is a platform (`ios`, `android`) or, for create, an extension type (`module`, `element`, `service`, `combo`). All flags support both short and long form (e.g. `-d` or `--debug`).

---

## Global

Environment: On startup, `t4l` loads **`.env`** then **`.env.local`** from the directory containing `tamer.config.json` (walking up from the current working directory). Values are applied only when the variable is **not** already set in the process environment (so CI or shell exports win). Use this for Android signing variables such as `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_PASSWORD` referenced in `tamer.config.json`.

| Command | Description |
|---------|-------------|
| `t4l` or `t4l init` | Interactive setup: creates `tamer.config.json` in the current directory |
| `t4l add …` | Add `@tamer4lynx/*` to the Lynx project — details below |
| `t4l add-core` | Install the core stack in one command — details below |
| `t4l add-dev` | Install dev-app, dev-client, and their dependencies — details below |
| `t4l signing [platform]` | Configure Android/iOS signing (interactive; Android can generate a keystore with `keytool`) |
| `t4l --help` | Show help |
| `t4l --version` | Show version |

---

## `t4l init`

Initialize `tamer.config.json` with an **Ink** interactive wizard: step-by-step prompts with validation (Android package / iOS bundle ID), optional `$ENV` resolution for the Android SDK path, and a confirmation when reusing Android values for iOS. Writes `tamer.config.json` and updates `tsconfig.json` `include` for tamer types when applicable.

No flags.

---

## `t4l signing [platform]`

Configure Android and iOS release signing in `tamer.config.json` (Ink interactive wizard).

| Argument | Description |
|----------|-------------|
| *(none)* | Choose Android, iOS, or both |
| `android` | Android only |
| `ios` | iOS only |

**Android:** Choose **Generate a new release keystore** (requires a JDK: `keytool` on `PATH` or `JAVA_HOME`) or **Use an existing keystore**. Generation runs `keytool -genkeypair` (RSA 2048, 10000-day validity) and writes the keystore under a path you choose (default `android/release.keystore`). Passwords are referenced by env var names in `tamer.config.json`; on **generate**, the wizard **appends** `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_PASSWORD` (or names you choose) to **`.env.local`** if it exists, else **`.env`** if that file exists, else it creates **`.env.local`**—each new line only; existing keys are not overwritten. The CLI loads **`.env`** then **`.env.local`** at startup (see Global). Gradle can still use a legacy `android/signing.properties` if you maintain it yourself; the wizard does not write it.

**iOS:** Prompts for Development Team ID and optional code-sign identity / provisioning profile specifier.

After setup, use `t4l build -p` for production signed builds.

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

Build your app. **Platform:** `ios` | `android` (optional; omit for both). With **debug** (`-d`), the dev client (QR scan, HMR) is embedded when `@tamer4lynx/tamer-dev-client` is installed; with **release** (`-r`), the build has no dev client (unsigned); with **production** (`-p`), the build is signed for app store.

**Production (`-p`):** Configure signing first (`t4l signing`, or `t4l signing android` / `t4l signing ios`). If signing is not set up for a platform you are building, the CLI exits with instructions. `t4l build -p` with no platform builds **both** Android and iOS and requires signing for **both**; use `t4l build android -p` or `t4l build ios -p` to build a single platform.

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--embeddable` | `-e` | — | Output to `embeddable/` for adding LynxView to an existing app. Use with `--release`. |
| `--debug` | `-d` | default | Debug build with dev client embedded (if tamer-dev-client is installed). |
| `--release` | `-r` | — | Release build without dev client (unsigned). |
| `--production` | `-p` | — | Production build for app store (signed). |
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

**User-provided native modules:** To ensure your custom native extensions are discovered and linked:
1. Install the package in your workspace root `package.json` (or ensure it's hoisted to the root `node_modules` in monorepos).
2. The package must include `lynx.ext.json` or `tamer.json` with `ios` and/or `android` configuration.
3. Run `t4l link` after adding dependencies to update Podfile/Gradle and native registration code.
4. For iOS, run `pod install` in the `ios/` directory after podspec changes.

**iOS `No podspec found` for a Tamer package:** Often the app depended on **`npm install …@latest`**, where **`latest`** points at an older tarball without `ios/`. Prefer **`t4l add tamer-insets`** (or the relevant package): it resolves the **highest published semver** from the registry, unlike `latest` when that tag lags. Then run **`t4l link ios`** again.

**Xcode reports unknown UUID in `project.pbxproj`:** This can occur after merge conflicts or if the project file was manually edited. Fix by reverting `ios/<AppName>.xcodeproj/project.pbxproj` from git and re-running `t4l bundle ios` or `t4l link ios` to regenerate resource references.

---

## `t4l bundle [platform]`

Build the Lynx bundle and copy it to the native project. **Platform:** `ios` | `android` (optional; omit for both). Runs **autolink** before bundling (iOS: includes `tamer-host-native-modules.json` when dev-client is present — see `t4l link`).

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--debug` | `-d` | default | Debug bundle with dev client embedded (if present) |
| `--release` | `-r` | — | Release bundle without dev client (unsigned) |
| `--production` | `-p` | — | Production bundle for app store (signed) |

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

Start the dev server with HMR and WebSocket support (Expo-like). Shows an **Ink** dashboard: URLs, build status, QR code for the Lynx dev app, optional log panel, and WebSocket connection count.

**Keyboard shortcuts** (while the dashboard is focused): **`r`** rebuild the Lynx bundle, **`l`** toggle the log panel, **`q`** quit (and shut down the server).

| Flag | Short | Description |
|------|-------|-------------|
| `--verbose` | `-v` | Show all logs (native + JS). Default shows JS only. |

---

## `t4l add [packages...]`

Add `@tamer4lynx` packages to the **Lynx project** (`lynxProject` in `tamer.config.json`). Detects npm, pnpm, or bun from lockfiles and runs the appropriate install there.

For **scoped `@tamer4lynx/*` packages without a version**, the CLI runs **`npm view <pkg> versions --json`**, picks the **highest semver** published on the registry, and installs `name@version`. That avoids relying on npm’s **`latest`** dist-tag or **`prerelease`** when they point at an older publish. If the registry query fails, it falls back to `@prerelease`. Requires **network access** to the npm registry.

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

Adds these packages in one command: **tamer-app-shell**, **tamer-screen**, **tamer-router**, **tamer-insets**, **tamer-transports**, **tamer-system-ui**, **tamer-icons**. Same **highest semver** resolution as `t4l add`. No flags.

---

## `t4l add-dev`

Adds **tamer-dev-app**, **tamer-dev-client**, and their dependencies (same semver resolution as `t4l add`). No flags.

---

**After `t4l add`, `t4l add-core`, or `t4l add-dev`:** run **`t4l link`** so native modules are wired into iOS/Android.

---

## `t4l codegen`

Generate code from `@lynxmodule` declarations in `.d.ts` files. Run from an extension package root.

No flags.

---

## `t4l autolink-toggle` / `t4l autolink`

Toggle `autolink` on/off in `tamer.config.json`. When enabled, `t4l link` runs after **installing dependencies** (e.g. `postinstall` after `npm install` / `pnpm install` / `bun install`). Does not affect build or bundle commands, which always run link.

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
