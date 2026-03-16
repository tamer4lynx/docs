# Getting Started

Quick start with Tamer4Lynx: init, dev server, and dev app.

## Prerequisites

- Node.js 20.19+ or Bun
- Android SDK (for Android builds)
- Xcode (for iOS, macOS only)

## 1. Install Tamer4Lynx

Install globally:

```bash
npm i -g tamer4lynx
```

Or from GitHub:

```bash
npm i -g tamer4lynx/tamer4lynx
```

## 2. Clone the repo

```bash
git clone https://github.com/tamer4lynx/tamer4lynx.git
```

Native modules are package dependencies and will be installed with `npm install`.

## 3. Initialize config

From the project root (where `tamer.config.json` will live):

```bash
t4l init
```

Or run `t4l` with no arguments for interactive setup. The script prompts for Android app name, package name, SDK path, iOS bundle ID, and Lynx project path.

## 4. Start the dev server

```bash
t4l start
```

The terminal prints a QR code. Scan it with the Lynx dev app to connect and load your bundle with hot reload.

## 5. Build the dev app

The dev app embeds **tamer-dev-client** and loads your Lynx bundle from the connected dev server. Build it with:

```bash
t4l build
t4l build --platform android --install
t4l build --platform ios --install
```

Use the dev app to connect to your local dev server (via URL or QR), then develop with HMR.

For embedding Lynx into an existing app (outputs bundle + code snippets to `embeddable/`):

```bash
t4l build --embeddable --release
```

## Next steps

- [tamer-dev-client](/packages/tamer-dev-client) — Dev launcher API and setup
- [tamer-router](/packages/tamer-router) — File-based routing and layouts

## Lynx ecosystem

- [Lynx](https://lynxjs.org/) — Cross-platform rendering engine
- [Rspeedy](https://lynxjs.org/rspeedy/) — Build tool for Lynx
- [ReactLynx](https://lynxjs.org/react/) — React on Lynx

## Framework agnostic

Tamer4Lynx is conceptually Lynx framework agnostic. Native modules and tooling should work with any Lynx framework binding, including [VueLynx](https://github.com/rahul-vashishtha/lynx-stack/tree/lynx-vue-implementation/packages/vue) (@lynx-js/vue) and [miso-lynx](https://github.com/haskell-miso/miso-lynx). Some packages like **tamer-router** are specifically designed for @lynx-js/react (Stack, Tabs, react-router integration).
