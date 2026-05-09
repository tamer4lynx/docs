# tamer-linking

Deep linking and URL handling for Lynx. Requires `LinkingModule`.

## Overview

- **createURL** — Create app URL with scheme, path, query params
- **openURL** — Open an external URL in the system handler (browser, Mail, App Store, custom-scheme apps)
- **getInitialURL** — URL that launched the app
- **addEventListener** / **removeEventListener** — Listen for `url` events (`tamer-linking:url`)

## Installation

```bash
t4l add tamer-linking
```

Run **`t4l link`** after installing.

## API

### createURL(path?, options?)

```ts
createURL(path = '', { scheme?, path?, queryParams? }): string
```

Default scheme: `tamerdevapp`. Uses `LinkingModule.createURL` when available.

### openURL(url)

```ts
openURL(url: string): Promise<boolean>
```

Hands the URL off to the system. Resolves `true` when the OS reports a successful open, `false` otherwise (no handler, malformed URL, native bridge unavailable). Works for `https://`, `mailto:`, `tel:`, `sms:`, App Store / Play Store URLs, and any registered custom scheme.

```ts
import { openURL } from '@tamer4lynx/tamer-linking'

await openURL('https://example.com')
await openURL('mailto:hello@example.com')
await openURL('tamerdevapp://about')
```

iOS uses `UIApplication.shared.open`; Android dispatches an `Intent.ACTION_VIEW` with `FLAG_ACTIVITY_NEW_TASK`. The simulator without Mail.app installed will resolve `false` for `mailto:` — that's expected.

### getInitialURL()

Returns `Promise<string | null>`.

### addEventListener(type: 'url', listener: URLListener)

Returns `{ remove: () => void }`. Listener receives `{ url: string }`.

### removeEventListener(type: 'url', listener)

Removes the subscription.
