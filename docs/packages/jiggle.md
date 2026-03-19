# @tamer4lynx/jiggle

Vibration/haptic native module for Lynx. Exposes `vibrate(durationMs)` to the Lynx runtime.

## Installation

```bash
npm i @tamer4lynx/jiggle@prerelease
pnpm add @tamer4lynx/jiggle@prerelease
bun add @tamer4lynx/jiggle@prerelease
```

Add to your app's dependencies and run `t4l link`.

## API

| Method | Description |
|--------|-------------|
| `vibrate(durationMs)` | Vibrates the device for the provided duration in milliseconds |

**Parameters:** `durationMs` (number) — duration in milliseconds.

**Usage:**

```js
if (global.NativeModules?.Jiggle) {
  NativeModules.Jiggle.vibrate(200)
}
```

## Platform

Uses **lynx.ext.json**. Run `t4l link` after adding to your app.
