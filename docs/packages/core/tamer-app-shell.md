# tamer-app-shell

App chrome (AppBar / TabBar / Screen / SafeArea) + a set of Material 3 components (Button, Card, FAB, NavigationDrawer, NavigationRail, …) for Lynx. Used by tamer-router `Stack` / `Tab` layouts and standalone in any Lynx page.

## Overview

### App chrome

- **AppBar** — Title bar with back button, actions
- **TabBar** — Bottom tab bar with icons and labels
- **Content** — Scrollable content area
- **Screen** — Full-screen flex container (re-exported from tamer-screen)
- **SafeArea** — Padding for safe area insets (re-exported from tamer-screen)
- **AppShellProvider** / **`useAppShellContext()`** — Toggle showAppBar / showTabBar
- **AppShellRouterContext** / **`useAppShellRouter()`** — back / canGoBack / replace (provided by FileRouter; usable directly with manual coordinators)

### Material 3 components

- **Button** — `<Button variant size shape onTap>` — `filled` / `outlined` / `text` / `elevated` / `tonal` × `xs` / `sm` / `md` / `lg` / `xl` × `round` / `square`
- **ButtonGroup** — Connected button row (`ButtonGroupProps` / `ButtonGroupItem`)
- **Card** — `<Card variant>` with `elevated` / `filled` / `outlined`
- **Fab / ExtendedFab / FabMenu** — Floating action buttons; `FabSize` `'small' | 'regular' | 'large'`
- **FloatingFabContainer** + **`useFloatingFabOffsets()`** — Anchors a FAB at the screen edge, accounting for tab bar + insets
- **ScreenScopedOverlay** — Overlay layer scoped to the current screen (drawer / dialog / floating elements). Z-levels exposed as `SCREEN_OVERLAY_LEVEL_FLOATING` (10) and `SCREEN_OVERLAY_LEVEL_DRAWER` (20)
- **NavigationDrawer** — Side drawer with `DrawerSection` / `DrawerItem`
- **NavigationRail** — Vertical navigation rail with `NavRailItem`

### M3 theme tokens

- **`useM3ThemeTokens()`** — Returns the full M3 token set (`primary`, `onPrimary`, `surface`, `surfaceContainer*`, …) derived from the active palette in [tamer-system-ui](/packages/ui/tamer-system-ui). Use this in your own components to stay aligned with the rest of the shell.
- **`px(...values)`** — Helper for converting a list of numbers to a px string.

## Installation

```bash
t4l add-core
# or: t4l add tamer-app-shell tamer-icons tamer-insets tamer-screen
```

Run **`t4l link`** after installing.

## API

### AppBar

```tsx
<AppBar
  title?: string
  barHeight?: number
  leftAction?: AppBarAction | false
  rightActions?: AppBarAction[]
  foregroundColor?: string
  actionColor?: string
  style?: ViewProps['style']
/>
```

`AppBarAction`: `{ icon: string; set?: IconSet; onTap: () => void }`. If `leftAction` is undefined and `canGoBack()`, shows default back button.

### TabBar

```tsx
<TabBar
  tabs={TabItem[]}
  iconColor?: { active?: string; inactive?: string }
  style?: ViewProps['style']
/>
```

`TabItem`: `{ icon: string; set?: IconSet; label?: string; path?: string; onTap?: () => void }`. Uses `AppShellRouterContext.replace(path, { tab: true })` when path is set.

### Content

Scrollable view. Pass `children` and optional `style`.

### Screen

Full-screen flex column. Pass `children` and optional `style`.

### SafeArea

Re-exported from tamer-screen. Pass `edges?: ('top'|'right'|'bottom'|'left')[]` and `children`.

### AppShellProvider

```tsx
<AppShellProvider showAppBar showTabBar barHeight?>{children}</AppShellProvider>
```

### useAppShellContext()

Returns `{ showAppBar, showTabBar, barHeight }`.

### useAppShellRouter()

Returns `AppShellRouterContextValue | null`: `back`, `canGoBack`, `replace(route, options?)`.

## Material 3 components

Each M3 component is a self-contained export — import directly from the package and drop in:

```tsx
import {
  Button,
  ButtonGroup,
  Card,
  Fab,
  ExtendedFab,
  FabMenu,
  FloatingFabContainer,
  NavigationDrawer,
  NavigationRail,
  ScreenScopedOverlay,
  useM3ThemeTokens,
} from '@tamer4lynx/tamer-app-shell'
```

### Button

```tsx
<Button
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'round' | 'square'
  icon?: string
  iconSet?: IconSet
  onTap?: () => void
  disabled?: boolean
>
  Label
</Button>
```

### ButtonGroup

```tsx
<ButtonGroup
  items={[
    { id: 'left',  label: 'Left'  },
    { id: 'mid',   label: 'Middle' },
    { id: 'right', label: 'Right' },
  ]}
  selectedId={selected}
  onSelect={setSelected}
/>
```

### Card

```tsx
<Card variant="elevated">
  ...children...
</Card>
```

### Fab / ExtendedFab / FabMenu

```tsx
<Fab icon="add" size="regular" onTap={...} />

<ExtendedFab icon="edit" onTap={...}>Compose</ExtendedFab>

<FabMenu
  items={[
    { id: 'a', icon: 'image', label: 'Photo', onTap: () => {} },
    { id: 'b', icon: 'mic',   label: 'Voice', onTap: () => {} },
  ]}
/>
```

For an edge-anchored FAB that respects the tab bar + safe area, wrap in `FloatingFabContainer`:

```tsx
<FloatingFabContainer>
  <Fab icon="add" onTap={...} />
</FloatingFabContainer>
```

`useFloatingFabOffsets()` returns `{ bottom, right, … }` in px if you need the same math without the wrapper.

### NavigationDrawer

```tsx
<NavigationDrawer
  open={open}
  onDismiss={() => setOpen(false)}
  sections={[
    {
      header: 'Mail',
      items: [
        { id: 'inbox',  icon: 'inbox',  label: 'Inbox' },
        { id: 'sent',   icon: 'send',   label: 'Sent'  },
      ],
    },
  ]}
  selectedId={selected}
  onSelect={setSelected}
/>
```

### NavigationRail

```tsx
<NavigationRail
  items={[
    { id: 'home',  icon: 'home'   },
    { id: 'fav',   icon: 'star'   },
    { id: 'about', icon: 'info'   },
  ]}
  selectedId={selected}
  onSelect={setSelected}
/>
```

### ScreenScopedOverlay

Mounts an overlay (sheet, drawer, dialog) above the current screen — sits below pushed routes. Use `level={SCREEN_OVERLAY_LEVEL_FLOATING}` for menus / FABs and `level={SCREEN_OVERLAY_LEVEL_DRAWER}` for drawers.

```tsx
<ScreenScopedOverlay level={SCREEN_OVERLAY_LEVEL_DRAWER} visible={open}>
  <NavigationDrawer ... />
</ScreenScopedOverlay>
```

### useM3ThemeTokens()

```tsx
const t = useM3ThemeTokens()

<view style={{ backgroundColor: t.surface, borderColor: t.outlineVariant }}>
  <text style={{ color: t.onSurface }}>...</text>
</view>
```

The token set tracks the active light/dark palette from [tamer-system-ui](/packages/ui/tamer-system-ui), so theme switches propagate without per-component plumbing.

## See also

The `packages/example` app at `pages/m3/` exercises every component above — see [Example Anatomy](/guide/example-anatomy) for the routing setup.
