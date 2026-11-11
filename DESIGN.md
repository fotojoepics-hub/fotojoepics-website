# FotoJoe design system

**Direction:** quiet-luxury photography studio — dark, warm, gallery-like. The photos are the colour; everything else is restraint. Positioned for high-end celebrations: *“Chicago’s photographer for life’s biggest celebrations.”*

## Brand

| Token | Value | Use |
|---|---|---|
| Ink | `#121110` | page background |
| Ink deep | `#0B0A09` | intro, footer, overlays |
| Paper | `#F4EFE7` | text |
| Mist | `#B7AFA2` | secondary text (8:1 on ink) |
| Brass | `#C2A059` | the one accent. Buttons use **dark text** on brass (7.6:1) |
| Brass light | `#D9C08A` | hover, highlights |
| Lines | `#2E2A25` / `#4A443B` | hairlines between sections — never boxes |
| Bokeh | blue `61,107,255` · orange `240,138,36` · brass · teal | soft drifting lights from Joe’s original business card |

- **Logo:** “Foto Joe” signature (Allison, converted to vector outlines in `src/brand/signature.ts`) + small brass camera. Tagline *J.L. ROBINSON IMAGING*. Regenerate with `scripts/logo/build_logo.py`.
- **Type:** Fraunces (display, variable optical size, italic for one accent word per title) + Manrope (body/UI). Self-hosted, Latin subsets only.
- **Gradients:** none decorative. Allowed: the dark scrim over photos, and the bokeh lights (Joe’s chosen brand signature).
- **Grain:** one still, 7% film-grain layer for a printed feel.

## Layout
- Left-aligned, one idea per section, generous space, hairline rules.
- Every section leads with a real photo. Captions say what the photo actually shows (“Pictured — a birthday party”); never a client’s name.
- One button style (`.btn`, gold pill with rolling label + dark dot) and one link style (`.link`, drawn underline).

## Motion (`src/lib/motion.ts`)
- Easing `expo.out` / `power3.out`; durations 0.3s UI, 0.9s reveals, 1.2s hero; stagger 0.08s.
- **Big moments, homepage:** ① signature intro → ② hero print expands to full bleed (pinned 1.1 screens) → ③ chapters stack like pages (sticky). Everything else is calm reveals.
- Patterns used: hero frame-expand (#1), mask reveals with counter-scale (#3), inner parallax (#4), chapter stack (#6), headline line reveals (#7), Flip gallery + lightbox (#8).
- Reactive: magnetic buttons, cursor-following “View” disc and hover previews (desktop), bokeh drifting toward the cursor, scroll-velocity marquee.
- First-screen entrances run in CSS (`[data-rise]`, `[data-print-in]`) so they start at first paint; they pause while the intro plays.
- Phones: no pinning, no cursor effects, fewer lights. Reduced motion: no intro, no Lenis, everything visible and still.

## Components from 21st.dev (restyled)
- Magnetic Button — Hirael (MIT) → `src/components/MagneticButton.tsx`
- Hover Image List — SmoothUI → `src/components/HoverImageList.tsx`
