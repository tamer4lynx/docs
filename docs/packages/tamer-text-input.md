# tamer-text-input

Custom `<tamer-input>` element for Lynx that aims to combine `<input>` and `<textarea>` into a single component, similar to React Native’s `TextInput`. Requires native `TamerTextInput` custom element.

## Overview

Single-line and multiline text input via the `multiline` prop. Props mirror common input attributes. Events: `bindinput`, `bindfocus`, `bindblur`, `bindconfirm`, `bindcontentsizechange`, `bindselection`.

## Installation

```bash
npm install @tamer4lynx/tamer-text-input
```

## API

### tamer-input props

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | string | Placeholder text |
| `value` | string | Controlled value |
| `multiline` | boolean | Multiline mode |
| `maxlength` | number | Max length |
| `maxlines` | number | Max lines (multiline) |
| `readonly` | boolean | Read-only |
| `type` | string | Input type |
| `color` | string | Text color |
| `placeholder-color` | string | Placeholder color |
| `text-size` | number | Font size |
| `text-align` | 'left' \| 'center' \| 'right' \| 'end' \| 'start' | Text alignment |
| `confirm-type` | string | Confirm button type |

### Events

- `bindinput` — `(e: { detail?: { value?: string }; value?: string }) => void`
- `bindfocus` — `() => void`
- `bindblur` — `() => void`
- `bindconfirm` — `(e: { detail?: { value?: string }; value?: string }) => void`
- `bindcontentsizechange` — `(e: { detail?: { width?: number; height?: number } }) => void`
- `bindselection` — `(e: { detail?: { selectionStart?: number; selectionEnd?: number } }) => void`
