# DESIGN.md

## Canonical Design Authority

- Stitch project: `Personal Web Page` (`3048263380749146026`)
- Primary design system: `Kernel Slate`
- Asset ID: `b03c8dd0fdd64d41812b95dc909c1513`
- Project screen stub: `asset-stub-assets-b03c8dd0fdd64d41812b95dc909c1513-1773947855397`

## Stitch Instructions

Get the images and code for the following Stitch project's screens:

### Project

Title: `Personal Web Page`
ID: `3048263380749146026`

### Screens

1. `Sovereign Console: Design Specification`
   ID: `80262ca0a72a4bcd851e704978035836`

Use a utility like `curl -L` to download the hosted URLs.

## Local Retrieved Artifact

- Downloaded hosted export for screen `80262ca0a72a4bcd851e704978035836` to:
  - [`output/stitch/80262ca0a72a4bcd851e704978035836.html`](/home/atelo/projects/fardust-web/output/stitch/80262ca0a72a4bcd851e704978035836.html)
- The Stitch API exposed hosted code for this screen. It did not expose a screenshot URL for this specific screen in the current tool response.

## Operational Rules

- This repo must treat `Kernel Slate` as the only primary design system.
- Do not use `Nebula Core` as the repo design authority.
- Do not create new Stitch projects for this repo.
- Do not create new design systems for this repo.
- When a hosted Stitch export URL is available, refresh this file from the source with `curl -L` instead of paraphrasing it from memory.
- The `Sovereign Console: Design Specification` screen is part of the repo design authority and must be consulted alongside the design-system asset.

## Repo-Level Consequences

- All visual review, implementation, and comparison work must resolve against `Kernel Slate` plus the `Sovereign Console: Design Specification` screen.
- Stitch experiment notes must record the project ID, screen ID, prompt, and the design system actually used.
- Local design docs under `docs/` may explain implementation choices, but they must not override this source record.

## Downloaded Source Content

# Design Specification: Sovereign Console (ML-Ops v2.1)

This document details the visual language and UI components for the **G.Faundez // ML-Ops Console**. The goal is a "high-utility production" aesthetic that feels robust, technical, and professional.

## 1. Core Visual Principles

- **Aesthetic:** "Sovereign Console" – Professional, high-density, and utility-first.
- **Color Palette:**
  - **Primary Background:** `#0b1326` (Deep Navy)
  - **Surface Layer 1:** `#131b2e` (Elevated Panel)
  - **Accent Blue:** `#adc6ff` (Actionable elements/Headers)
  - **Success Green:** `#53e16f` (Live status/Terminal OK)
  - **Alert Red:** `#ff4d4d` (Critical system errors - rare)

## 2. Geometry & Corner Treatment

- **Global Rounding:** `rounded-sm` (4px). We avoid large curves to maintain a rigid, technical feel.
- **Inner Component Rounding:** `rounded-[2px]` for buttons and small tags inside cards.
- **Border Treatment:** `1px` solid `#2d3449`. Borders are used sparingly for separation; tonal shifts are preferred for depth.

## 3. Shadows & Elevation

- **Elevation Strategy:** Flat UI with tonal layering. We do not use standard "drop shadows."
- **Panel Depth:** Panels use a subtle inner glow or a 1px lighter top border to simulate a "beveled" or "inset" look common in rack-mount hardware interfaces.
- **Fade Effects:**
  - **Terminal Fades:** A vertical linear gradient from `transparent` to `#0b1326` is used at the bottom of scrollable log areas to indicate "more content."
  - **Backdrop Blur:** Side navigation and top bars use a `backdrop-blur-xl` (24px) combined with an 80% opaque background to create a "glass-console" effect.

## 4. Typography Hierarchy

- **Primary Header:** `Inter Tight`, `-0.02em` tracking, Uppercase. High weight for impact.
- **System Labels:** `Space Grotesk`, All-caps, `0.05em` letter spacing. Used for section titles.
- **Data/Logs:** `Monospace` (SF Mono/JetBrains Mono). Used for paths, hashes, and terminal output.

## 5. Component Specifics

- **Model Cards:**
  - Padding: `24px` (`p-6`).
  - Hover State: A subtle shift from `#131b2e` to `#1a243d`. No scaling or elevation change; the transition is purely tonal.
- **Status Indicators:**
  - Glowing dot: `box-shadow: 0 0 10px #53e16f;` only for "LIVE" status.
- **Navigation Links:**
  - Active State: Underline with `2px` offset and the Accent Blue color.
