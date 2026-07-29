# Family Fund — Design System

Brand: صندوق العائلة · Family Fund
Archetype: Caregiver + Guardian
Design philosophy: Functional over decorative. Speed over beauty. Transparent by default.

---

## Principles

1. **Speed over beauty** — The Treasurer toggles 48 payments per session. Every millisecond counts. Visual polish never impedes workflow velocity.
2. **RTL-native** — Arabic is the primary language. Layout, spacing, typography, and interactions assume right-to-left.
3. **Transparent by default** — Payment status is always visible. No hover-to-reveal, no ambiguous icons.
4. **Local-first** — Data lives on-device. The interface feels instant, never waits for a server.
5. **Functional over decorative** — Every pixel earns its place. No glassmorphism, no gradient text, no ambient decoration.

---

## Color

### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1a6bff` | Interactive elements, links, active states |
| `--color-primary-light` | `#4a8bff` | Hover states |
| `--color-primary-dark` | `#0050d6` | Active/pressed states |
| `--color-primary-subtle` | `#eef3ff` | Background tint for selected rows |
| `--color-success` | `#059669` | Paid status, confirmed actions |
| `--color-success-bg` | `oklch(0.94 0.04 155)` | Paid cell background |
| `--color-warning` | `oklch(0.65 0.14 75)` | Pending status |
| `--color-warning-bg` | `oklch(0.94 0.04 90)` | Pending cell background |
| `--color-danger` | `oklch(0.55 0.18 25)` | Unpaid status, destructive actions |
| `--color-danger-bg` | `oklch(0.93 0.05 30)` | Unpaid cell background |
| `--color-surface` | `oklch(0.97 0.008 255)` | Page background |
| `--color-surface-elevated` | `white` | Card, modal, dropdown background |
| `--color-foreground` | `oklch(0.13 0.01 255)` | Primary text |
| `--color-muted` | `oklch(0.52 0.015 255)` | Secondary text, labels |
| `--color-border` | `oklch(0.91 0.012 255)` | Dividers, card borders |

### Dark Theme

| Token | Value |
|-------|-------|
| `--color-primary` | `#4a8bff` |
| `--color-primary-light` | `#6ba5ff` |
| `--color-primary-dark` | `#1a6bff` |
| `--color-primary-subtle` | `oklch(0.2 0.04 265)` |
| `--color-success` | `#10b981` |
| `--color-success-bg` | `oklch(0.25 0.04 155)` |
| `--color-warning` | `#f59e0b` |
| `--color-warning-bg` | `oklch(0.28 0.06 75)` |
| `--color-danger` | `#f87171` |
| `--color-danger-bg` | `oklch(0.28 0.08 25)` |
| `--color-surface` | `oklch(0.15 0.01 265)` |
| `--color-surface-elevated` | `oklch(0.19 0.015 265)` |
| `--color-foreground` | `oklch(0.93 0.008 265)` |
| `--color-muted` | `oklch(0.6 0.01 265)` |
| `--color-border` | `oklch(0.25 0.015 265)` |

---

## Typography

Font stack: `'IBM Plex Sans Arabic', sans-serif`

| Scale | Size | Weight | Usage |
|-------|------|--------|-------|
| `xs` | 0.75rem (12px) | 400 | Table cell data, metadata |
| `sm` | 0.875rem (14px) | 400 | Body text, descriptions |
| `base` | 1rem (16px) | 400 | Default body |
| `lg` | 1.125rem (18px) | 500 | Section headers, card titles |
| `xl` | 1.25rem (20px) | 600 | Panel headers |
| `2xl` | 1.5rem (24px) | 600 | Page titles |
| `3xl` | 1.875rem (30px) | 700 | Hero headings (LandingPage only) |

Weights available: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

Tabular figures for monetary amounts: `font-variant-numeric: tabular-nums`

---

## Spacing

Base unit: 4px (`0.25rem`)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight icon gap |
| `space-2` | 0.5rem (8px) | Compact element gap |
| `space-3` | 0.75rem (12px) | Button padding, cell padding |
| `space-4` | 1rem (16px) | Card padding, form gap |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Page section spacing |
| `space-12` | 3rem (48px) | Major section separation |

---

## Shadows

Cards use border-based distinction, not elevation. Only one shadow level:

```
box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04),
            0 4px 12px -4px rgba(15, 23, 42, 0.06);
```

Applied via `.surface-elevated` class. Cards always have a `1px` border.

---

## Components

### Surface / Card

Bordered container with subtle shadow. White background in light mode, elevated color in dark mode.

```
class: surface-elevated
border: 1px solid var(--color-border)
border-radius: 1rem (16px)
padding: 1rem (16px)
```

### Payment Matrix Cell

The core interaction. Three states toggled by click:

- **Paid:** `background: var(--color-success-bg); color: var(--color-success);`
- **Pending:** `background: var(--color-warning-bg); color: var(--color-warning);`
- **Unpaid:** `background: var(--color-danger-bg); color: var(--color-danger);`

Press feedback: `transform: scale(0.96)` via CSS, 160ms cubic-bezier.

Cells always display a short text label (مدفوع/معلق/غير مدفوع) in addition to color — never rely on color alone.

### Buttons

- **Primary:** Filled `--color-primary` background, white text, `border-radius: 0.5rem`
- **Secondary:** White background, `--color-border` border, `--color-foreground` text
- **Ghost:** No background or border, shows on hover
- **Danger:** Inherits `--color-danger` for destructive confirmations

All buttons: `padding: 0.5rem 1rem`, `font-weight: 500`, `cursor: pointer`, `transition: background-color 0.15s, transform 0.1s`

### Navigation

- **Desktop:** Fixed left sidebar (RTL: right side), 240px wide, icon + label per item
- **Mobile:** Bottom tab bar, 5 items max, active item uses `--color-primary`

### Modal

Native `<dialog>` element. Centered overlay with backdrop blur/shimmer.

```
max-width: 480px
width: calc(100% - 2rem)
border-radius: 1rem
padding: 1.5rem
```

### Toast (UndoToast)

Appears at bottom-center. Fixed position, `z-index: 50`.

```
background: var(--color-foreground)
color: var(--color-surface)
border-radius: 0.75rem
padding: 0.75rem 1rem
```

### Status Badge

Inline pill for transaction lists and member cards.

```
padding: 0.125rem 0.5rem
border-radius: 9999px
font-size: 0.75rem
font-weight: 500
```

---

## Animation & Motion

### Principles
1. **Duration:** Subtle micro-interactions at 150-200ms. Page transitions at 300ms.
2. **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)` — snappy, not bouncy.
3. **Reduced motion:** `prefers-reduced-motion: reduce` sets all animations to 0.01ms.
4. **GSAP only for LandingPage** — ScrollTrigger entrance animations. The app itself uses CSS transitions only.
5. **No decorative animations** — No spinning loaders, no confetti, no pulse effects. If it moves, it communicates state.

### Specifics

| Element | Animation | Timing |
|---------|-----------|--------|
| Payment toggle press | Scale 0.96 | 160ms |
| Modal open | Fade + slight scale | 200ms |
| Toast appear | Slide up + fade | 250ms |
| Page transition | Crossfade | 200ms |
| LandingPage hero | GSAP stagger | Per ScrollTrigger |

---

## Dark Mode

Enabled via CSS class on `<html>`: `.dark`

Implementation using Tailwind v4 `@custom-variant`:

```css
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-primary: var(--color-primary-light);
}

[data-theme="dark"] {
  --color-primary: #4a8bff;
}
```

All color tokens use CSS custom properties that swap under `.dark`. No hardcoded colors in components.

---

## Anti-Patterns

These are explicitly forbidden by the design system:

- ❌ Glassmorphism (frosted glass, backdrop blur overlays)
- ❌ Gradient text or gradient backgrounds
- ❌ 3D elements (card flips, perspective transforms)
- ❌ Decorative animations (sparkles, confetti, particles)
- ❌ Crypto/neon aesthetic (dark purple, cyan, glowing elements)
- ❌ SaaS-cream beige backgrounds
- ❌ Over-whitespace "designer" layouts that hide data
- ❌ Icon-only status indicators without text labels
- ❌ Hover-dependent information (mobile-first means touch)
- ❌ Lucide icons (use Material Symbols — already established)

---

## File Structure

Design tokens live in `src/index.css` via `@theme`. Component-specific styles use Tailwind utilities directly. No additional CSS modules or styled-components.

```
src/index.css          → Theme tokens, typography, utilities, dark mode
src/components/        → Tailwind-utility classes only, no scoped CSS
```

---

## Future Considerations (Convex Migration)

When migrating to Convex:
- Optimistic updates for payment toggles should match the same 160ms press feedback
- Loading states: use skeleton shimmer (CSS only, no animation library)
- Error states: inline red text near the action, not toast-only
