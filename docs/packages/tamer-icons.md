# tamer-icons

Icon component and font loading for Lynx. Requires native `<icon>` element support.

## Overview

- **Icon** — Renders an icon by name and set
- **Tfont** — Declarative font registration (returns null)
- **IconSet** — `'material' | 'fontawesome' | 'fa'`

Uses Material Icons and Font Awesome codepoints. Fonts must be loaded via `lynx.addFont` or `@font-face`; the package provides `MATERIAL_ICONS_URL` and `FONTAWESOME_SOLID_URL`.

## Installation

```bash
npm install @tamer4lynx/tamer-icons
```

## API

### Icon

```tsx
<Icon
  name={string}
  set?: 'material' | 'fontawesome' | 'fa'
  size?: number
  color?: string
  style?: ViewProps['style']
/>
```

Renders `<icon icon={name} set={set} size={size} iconColor={color} />`.

### Tfont

```tsx
<Tfont src={string} family={string} weight?: number style? />
```

Declarative font registration. Returns null.

### Exports

- `MATERIAL_ICONS_URL` — URL for Material Icons font
- `FONTAWESOME_SOLID_URL` — URL for Font Awesome Solid
- `MATERIAL_CODEPOINTS` — Codepoint map for Material Icons
