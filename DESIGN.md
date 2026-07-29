# Design System: صندوق العائلة · Family Fund

**Stitch-optimized semantic design language**
Dashboard app · Cockpit-dense · RTL Arabic · Functional over decorative

---

## Configuration Dials

| Dial | Level | Rationale |
|------|-------|-----------|
| **Creativity** | `3` | Functional dashboard — clarity trumps expression. Predictable, task-focused layouts. |
| **Density** | `7` | 48 members × 12 months in a payment matrix. Every pixel serves a data purpose. |
| **Variance** | `3` | Symmetric grid-first layout. Predictable navigation. No artistic asymmetry — the Treasurer needs muscle memory. |
| **Motion Intent** | `3` | Subtle press feedback only. No decorative animations, no page transitions beyond fade. Speed over beauty. |

> **How to use:** These dials reflect a Treasurer's tool — cockpit-dense, fast, zero friction. Screens generated for this project must prioritize scanability, keyboard-like click throughput, and RTL correctness over visual novelty.

---

## 1. Visual Theme & Atmosphere

A cockpit-dense data dashboard built for speed. The atmosphere is clinical and trustworthy — like a bank vault's transaction log — softened by warm neutral surfaces and generous Arabic typography. Every pixel is functional: payment status must be read at a glance, toggles fire in 160ms, and the matrix grid dominates the viewport. No glassmorphism, no decorative gradients, no hover-to-reveal information. The design communicates reliability, not flair. The primary interface is RTL Arabic with IBM Plex Sans Arabic providing distinctive, highly legible character shapes across all weights.

---

## 2. Color Palette & Roles

### Light Theme

- **Surface Canvas** (oklch(0.97 0.008 255)) — Page background. Warm-neutral, never clinical blue-white.
- **Pure White** (#FFFFFF) — Elevated containers, cards, modals, dropdowns. Used with border-based separation.
- **Ink Black** (oklch(0.13 0.01 255)) — Primary text. Near-black — never pure #000.
- **Steel Muted** (oklch(0.52 0.015 255)) — Secondary text, labels, metadata, descriptions.
- **Ash Border** (oklch(0.91 0.012 255)) — Dividers, card borders, structural 1px lines.
- **Blue Signal** (#1A6BFF) — Single accent for buttons, links, active states, focus rings. Saturation ~70%.
- **Blue Signal Light** (#4A8BFF) — Hover states on interactive elements.
- **Blue Signal Dark** (#0050D6) — Pressed/active states.
- **Blue Whisper** (#EEF3FF) — Selected row background, subtle tinted highlight.
- **Emerald Paid** (#059669) — Paid/payment-received status. Confirmed actions.
- **Emerald Paid BG** (oklch(0.94 0.04 155)) — Paid cell background in matrix grid.
- **Amber Pending** (oklch(0.65 0.14 75)) — Pending/unconfirmed status.
- **Amber Pending BG** (oklch(0.94 0.04 90)) — Pending cell background.
- **Rose Danger** (oklch(0.55 0.18 25)) — Unpaid status, destructive actions, errors.
- **Rose Danger BG** (oklch(0.93 0.05 30)) — Unpaid cell background.

### Dark Theme

| Role | Value |
|------|-------|
| Surface | oklch(0.15 0.01 265) |
| Elevated surface | oklch(0.19 0.015 265) |
| Text | oklch(0.93 0.008 265) |
| Muted text | oklch(0.6 0.01 265) |
| Border | oklch(0.25 0.015 265) |
| Blue accent | #4A8BFF (brightened for dark bg) |
| Emerald | #10B981 |
| Amber | #F59E0B |
| Rose | #F87171 |

### Banned Colors
- Purple/violet neon gradients — the "AI Purple" aesthetic
- Pure black (#000000) — always use Ink Black
- Oversaturated accents above 80% saturation
- Mixed warm/cool gray systems — all neutral hues are consistent

---

## 3. Typography Rules

### Display & Body
- **Primary:** `IBM Plex Sans Arabic` — Purpose-chosen Arabic typeface with distinctive character. Not Inter, not a generic system stack. Supports 300/400/500/600/700 weights.
- **Scale:** XS (0.75rem) → 3XL (1.875rem). Tight, controlled. Hierarchy through weight and color, not massive size jumps.
- **Tabular figures:** `font-variant-numeric: tabular-nums` on all monetary amounts — numbers must align in columns for the payment matrix.

### Scale Table

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| xs | 0.75rem | 400 | Table cell data, timestamps, metadata |
| sm | 0.875rem | 400 | Body text, descriptions |
| base | 1rem | 400 | Default body |
| lg | 1.125rem | 500 | Section headers, card titles |
| xl | 1.25rem | 600 | Panel headers |
| 2xl | 1.5rem | 600 | Page titles |
| 3xl | 1.875rem | 700 | Landing page hero only |

### Banned Fonts
- `Inter` — irrelevant here (Arabic interface, Plex is the only font)
- Generic system fonts for any text role — IBM Plex Sans Arabic is the sole typeface
- Serif fonts of any kind — banned in dashboards and data UIs
- Font stacks that fall back to Latin-only faces before Arabic

### RTL-Specific
- `dir="rtl"` on root element. All `margin`/`padding` directions are logical (`margin-inline-end` over `margin-right`)
- Phone numbers and monetary amounts use explicit `dir="ltr"` within RTL flow
- Line height: 1.5× body, 1.15–1.25× headings. IBM Plex Sans Arabic needs generous leading for Arabic diacritics.

---

## 4. Component Stylings

### Payment Matrix Cell
The heart of the app. Each cell represents one member-month payment. Three-state toggle by click: Paid / Pending / Unpaid.

- **Shape:** Square-ish aspect, generous tap target (≥44px). Rounded corners (0.5rem).
- **States:** Color-coded background + short Arabic label inside cell. Never color-only — labels read "مدفوع" / "معلق" / "غير مدفوع".
- **Press feedback:** `scale(0.96)` via CSS transform, 160ms cubic-bezier(0.23, 1, 0.32, 1). Tactile, instant.
- **Hover:** Subtle brightness shift or border emphasis.
- **Transition:** 160ms press, 200ms color swap. No delays.

### Buttons
- **Primary:** Blue Signal (#1A6BFF) fill, white text, 0.5rem radius. For "تسجيل دفعة جديدة", confirm actions.
- **Secondary:** White fill, Ash Border, Ink Black text. For cancel, dismiss.
- **Ghost:** No background or border. Background appears on hover. For inline actions, settings triggers.
- **Danger:** Rose Danger color. For destructive confirmations.
- All buttons: padding 0.5rem 1rem, weight 500, `cursor: pointer`, no outer glow, no neon.

### Surface / Cards
- **Bordered containers** — distinction via 1px Ash Border, not elevation.
- **Elevation:** Subtle `box-shadow` only on modals and toasts:
  ```
  0 1px 2px rgba(15, 23, 42, 0.04),
  0 4px 12px -4px rgba(15, 23, 42, 0.06)
  ```
- **Border radius:** Generous 1rem on cards, 0.75rem on toasts, 0.5rem on buttons, 9999px on badges.
- In the payment matrix, cells are not cards — they're grid items. Cards are reserved for member cards, summary KPIs, and modals.

### Navigation
- **Desktop:** Fixed sidebar (RTL: right side), 240px wide. Icon + Arabic label per item. Active item highlighted with Blue Signal.
- **Mobile:** Bottom tab bar, 5 items max. Active tab uses Blue Signal.
- No hamburger on desktop. Clean vertical list with generous spacing.
- Icons: Material Symbols (filled variant for active state).

### Modal (Native `<dialog>`)
- Centered overlay, max-width 480px, width calc(100% - 2rem).
- Backdrop: semi-transparent dark overlay with subtle blur.
- Border radius: 1rem. Padding: 1.5rem.
- Enter animation: fade + slight scale, 200ms.
- Close on backdrop click or Escape key.

### Toast (UndoToast)
- Fixed bottom-center, z-index 50.
- Ink background, white text. 0.75rem radius.
- Slide-up + fade entrance, 250ms.
- Contains undo action button for payment toggle reversals.

### Status Badge
- Inline pill for transaction lists and member cards.
- Padding 0.125rem 0.5rem. Border-radius 9999px. Font-size 0.75rem, weight 500.
- Color-coded by status (Emerald/Amber/Rose).

### Inputs & Forms
- Label positioned above input. Error text below in Rose Danger.
- Focus ring: 2px Blue Signal. No floating labels.
- Label-input-error gap: 0.5rem.
- Standard input border: 1px Ash Border. On focus: Blue Signal.

### Loaders
- Skeletal shimmer matching exact layout dimensions. Background pulse animation.
- No circular spinners, no bouncing dots.

### Empty States
- Short Arabic message + primary action button to populate data. No illustration needed for this data-dense app.

---

## 5. Layout Principles

- **Grid-first:** Payment matrix is a 13-column CSS grid (member name + 12 months). Horizontal scroll on narrower viewports.
- **Standard page layout:** Fixed sidebar + scrollable content area. Max content width ~1400px for the matrix, centered.
- **No overlapping:** Every element in its own spatial zone. No absolute-positioned stacking. Clean separation.
- **Desktop sidebar:** 240px fixed, RTL-flipped. Content fills remaining width with 1.5rem padding.
- **Mobile:** Bottom nav, full-width content, single-column layout below 768px.
- **Full-height:** Use `min-height: 100dvh` — never `h-screen` (iOS Safari address bar jump).
- **Dashboard KPIs row:** 3–4 compact stat cards, horizontal row, each showing a metric + delta. Not the generic 3-equal-card layout — KPIs are data-driven stat blocks.
- **Payment matrix:** The matrix IS the page. Full-width scroll container, sticky header row and column. Cells are compact grid items.
- **Section headings:** Arabic labels using semantic `<h2>`/`<h3>` elements with adequate spacing (1.5rem below).

---

## 6. Responsive Rules

### Mobile-first collapse (< 768px)
- All multi-column layouts collapse to single column. Matrix grid becomes a per-member expandable card list.
- Bottom tab bar replaces sidebar.
- Sidebar becomes a slide-in overlay on mobile.
- Payment matrix cells: 44px minimum tap target on touch devices.

### Typography scaling
- Body text minimum 1rem (16px) — never below 14px.
- Headlines scale via `clamp()` on the LandingPage only. Dashboard headings stay fixed at the scale table values.
- Arabic text at small sizes — IBM Plex Sans Arabic remains readable at 0.75rem.

### Touch targets
- All interactive elements minimum 44px. Generous spacing between clickable items in the matrix.
- Matrix cells must be comfortably tappable on a 375px screen.

### Navigation
- Desktop sidebar collapses to bottom tab bar on mobile.
- Active tab highlighted with Blue Signal. Icons + labels always visible.

### No horizontal scroll on page level
- Only the matrix grid container scrolls horizontally on narrow screens.
- Page chrome (sidebar, header, nav) never overflows.

---

## 7. Motion & Interaction

### Principles
1. **Duration:** Micro-interactions at 150–200ms. Page transitions at 200–300ms.
2. **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)` — snappy, not bouncy. No linear easing.
3. **Reduced motion:** `prefers-reduced-motion: reduce` sets all animations to 0.01ms — honored via CSS.
4. **LandingPage only:** GSAP ScrollTrigger for staggered hero entrances. The app itself uses CSS transitions exclusively — no JavaScript animation library for dashboard interactions.

### Specific implementations

| Element | Animation | Timing |
|---------|-----------|--------|
| Payment toggle press | scale(0.96) | 160ms |
| Modal open | Fade + slight scale | 200ms |
| Toast appear | Slide up + fade | 250ms |
| Button hover | Background shift | 150ms |
| Status transition | Color + background swap | 200ms |
| Page transition | Crossfade | 200ms |
| LandingPage hero | GSAP stagger | Per ScrollTrigger |

### Performance
- Animate ONLY `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- GSAP wrapped in `gsap.context()` with `ctx.revert()` cleanup.
- Every animation communicates state — never decorative.

---

## 8. Responsive Behavior for Stitch

When generating screens for different devices:

- **Desktop (1440px):** Full sidebar + matrix grid, 13 columns visible. KPIs row at top.
- **Tablet (768px):** Collapsed sidebar (icons only or slide-out), matrix grid scrolls horizontally.
- **Mobile (375px):** Bottom nav. Matrix replaced by member list → expand to see monthly status per member. KPIs stack vertically.

---

## 9. Anti-Patterns (Banned)

- ❌ Glassmorphism (frosted glass, backdrop blur overlays)
- ❌ Gradient text or gradient backgrounds
- ❌ 3D elements (card flips, perspective transforms)
- ❌ Decorative animations (sparkles, confetti, particles, pulse effects)
- ❌ Crypto/neon aesthetic (dark purple, cyan, glowing elements)
- ❌ SaaS-cream beige backgrounds
- ❌ Over-whitespace layouts that hide data — this is a cockpit, not a gallery
- ❌ Icon-only status without text labels — payment status must always show Arabic text
- ❌ Hover-dependent information — mobile-first means all info visible at rest
- ❌ Lucide icons — use Material Symbols (already established)
- ❌ Emojis anywhere in the UI
- ❌ `Inter`, system-ui, or `-apple-system` as primary font — IBM Plex Sans Arabic only
- ❌ Pure black (#000000) — use Ink Black
- ❌ Neon outer glows or `box-shadow` glows
- ❌ Custom mouse cursors
- ❌ Overlapping elements — clean spatial separation always
- ❌ 3-column equal card layouts for features
- ❌ "Welcome to" / "Unlock the power of" / "Your all-in-one solution" generic hero copy
- ❌ Balloon/unicorn icons, emoji-as-design-element patterns
- ❌ Colored left-border accent on cards (`border-left: 3px solid accent`)
- ❌ Generic placeholder names (John Doe, Acme) — member data is real Arabic names
- ❌ AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- ❌ Filler UI text ("Scroll to explore", bouncing chevrons, scroll arrows)
- ❌ `h-screen` — always use `min-h-[100dvh]`
- ❌ Circular spinners — skeletal shimmer only
