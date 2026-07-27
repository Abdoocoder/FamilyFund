# Product

## Register

product

## Users

Two audiences sharing one interface:
- **Treasurer (المحاسب)**: The primary operator. Manages 48 family members' monthly subscriptions, records payments, archives/restores members, exports payment data. Works weekly during collection periods. Needs speed — toggling 48 payments in a session must be fast and error-proof.
- **Family Members**: View their own payment history, outstanding balance, and fund health. Read-only dashboard. Check status periodically, not daily.

## Product Purpose

Replace manual spreadsheets for tracking صندوق الجمعية (family fund subscriptions). The Treasurer gets a 1-click payment matrix grid; family members get a transparent, read-only view of their standing. Success = zero data loss, zero ambiguity about who paid what, and the Treasurer can complete a monthly collection in under 5 minutes.

## Brand Personality

Trustworthy, clear, organized. The app handles family money — it must feel reliable and unambiguous, not playful or decorative. Visual warmth comes from the family context, not from the interface itself.

## Anti-references

- SaaS-cream dashboard templates (warm beige bg, generic KPI cards, gradient accents)
- Consumer fintech apps (flashy animations, gradient cards, crypto aesthetics)
- Government/corporate portals (dense tables, no visual hierarchy, walls of text)
- Overly minimal "designer" dashboards that sacrifice scanability for whitespace

## Design Principles

1. **Speed over beauty**: The Treasurer's primary workflow is toggling payments for 48 members. Every interaction must be fast, clear, and impossible to mis-tap.
2. **RTL-native**: Arabic is not an afterthought. Every layout decision assumes right-to-left first. Typography, alignment, and spacing follow Arabic reading patterns.
3. **Transparent by default**: Family members should never wonder about their standing. Payment status is always visible, always current.
4. **Local-first reliability**: Data lives in localStorage today, Convex tomorrow. The interface must feel instant regardless of backend.
5. **Functional over decorative**: No glassmorphism, no gradient text, no ambient mesh gradients serving no purpose. Every visual element earns its place.

## Accessibility & Inclusion

- WCAG AA target (4.5:1 contrast for body text, 3:1 for large text)
- RTL layout support with proper `dir="rtl"` on root
- Touch targets ≥44x44px for mobile payment toggling
- Reduced motion support for GSAP animations
- High contrast between paid/unpaid states (not just color — include text labels)
