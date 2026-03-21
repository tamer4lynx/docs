# tamer-webview

Embedded in-app WebView for Lynx: **iOS** `WKWebView`, **Android** `android.webkit.WebView`. Registers the native custom element **`webview`** with `uri`, `html`, and `baseUrl` props (no JSON blob on the JS side).

Behavior and API are informed by [react-native-webview](https://github.com/react-native-webview/react-native-webview) (see `reference/react-native-webview` in this repo). JS pages can post messages to the app using the same bridge name as RN: **`ReactNativeWebView`** (`window.ReactNativeWebView.postMessage(...)`).

## Installation

```bash
npm install @tamer4lynx/tamer-webview@prerelease
```

Add the dependency to your app and run **`t4l link`** so native projects pick up `lynx.ext.json`, CocoaPods, and Gradle.

## Requirements

- Native host must register the element (autolink does this for Tamer dev app and embeddable).
- **ATS (iOS)** / **cleartext (Android)**: loading non-HTTPS URLs may require app-side configuration (`NSAppTransportSecurity`, `usesCleartextTraffic`, etc.).

## Usage

```tsx
import { WebView } from '@tamer4lynx/tamer-webview'

<WebView
  uri="https://example.com"
  injectedJavaScript="window.__tamer = 1;"
  bindload={(e) => console.log(e.detail.url, e.detail.title)}
  binderror={(e) => console.log(e.detail)}
  bindmessage={(e) => console.log(e.detail.data)}
/>
```

Or use the native tag directly:

```tsx
<webview uri="https://example.com" />
```

```tsx
<webview html="<p>Hello</p>" baseUrl="https://example.org/" />
```

If **`uri`** is non-empty, it is loaded first. Otherwise **`html`** + optional **`baseUrl`** are used.

### Imperative APIs

Use Lynx [`invoke`](https://lynxjs.org/api/lynx-api/nodes-ref/nodes-ref-invoke.md) on a node ref, for example:

- `reload`
- `goBack`
- `goForward`
- `injectJavaScript` — params: `{ script: string }`
- `loadUrl` — params: `{ url: string }`
- `stopLoading`

## Events

| Native event | Bind attribute | Detail (typical) |
|--------------|----------------|------------------|
| `load` | `bindload` | `url`, `title`, `loading`, `canGoBack`, `canGoForward` |
| `error` | `binderror` | `description`, `code`, … |
| `message` | `bindmessage` | `data` (string from `postMessage`) |

## See also

- [Custom Element (Lynx)](https://lynxjs.org/guide/custom-native-component.md)
- [NodesRef `invoke`](https://lynxjs.org/api/lynx-api/nodes-ref/nodes-ref-invoke.md)
