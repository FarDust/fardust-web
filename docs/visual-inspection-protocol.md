# Visual Inspection Protocol

## Source of Truth

- [`DESIGN.md`](/home/atelo/projects/fardust-web/DESIGN.md) is the only design authority in the repo.
- Google Stitch owns the approved design system through `Kernel Slate`.
- `https://fardust.web.app` is a regression reference for clarity, hierarchy, and breakage. It is not the design source of truth.

## Stitch References

- Design system: `Kernel Slate`
- Project: `projects/3048263380749146026`
- Asset: `assets/b03c8dd0fdd64d41812b95dc909c1513`
- Home reference screen: `projects/3048263380749146026/screens/65b985b82da64bfd9fd91e9ce883ee68`
  - `G.Faundez // ML-Ops Console v2.1`
- Home streamlined reference: `projects/3048263380749146026/screens/62b59d36003d4018a375b366059e41ae`
  - `G.Faundez // ML-Ops Console (Streamlined)`
- Button reference: `projects/3048263380749146026/screens/1e39f786974845618ade077b72e2a3da`
  - `Interaction & Button Specification`
- Pretext reference: `projects/3048263380749146026/screens/c6ff99a72e4f4209a7ee550c6353f45e`
  - `Pretext Lab: 24th-Century Ops Deck`

## How to Run

Generate the default audit set:

```bash
npm run audit:visual
```

Limit the audit to selected routes, sources, or viewports:

```bash
npm run audit:visual -- --routes=home,experience --sources=local,production-reference --viewports=desktop,mobile
```

The command writes artifacts under `output/visual-audit/<date>/` and a manifest to `output/visual-audit/<date>/manifest.json`.

When `local` is part of the audit set, the script runs against an isolated Angular dev server on `127.0.0.1:4201` and blocks service workers so the captures match the Playwright e2e environment instead of a reused browser shell.

## Viewport Matrix

- `desktop`: `1440x1080`
- `tablet`: `1024x1366`
- `mobile`: `390x844`

## Required Captures

Every audited route must include:

- viewport screenshot
- full-page screenshot when the route scrolls
- component closeups based on the selector registry in [`scripts/visual-audit.config.mjs`](/home/atelo/projects/fardust-web/scripts/visual-audit.config.mjs)

### Home

- navbar
- left rail
- hero panel
- hero CTA row
- pipeline panel
- project registry
- sidebar panel
- footer

### Experience

- navbar
- route rail
- viewer header
- action row
- toolbar
- PDF frame
- footer

### Pretext

- navbar
- route hero
- editorial engine
- shrinkwrap section
- validation section
- footer

### Ball

- navbar
- WebGL shell
- fallback card
- footer

### 404

- navbar
- error panel
- footer

## What a Closeup Means

- A closeup is a screenshot of the component root selector, not a cropped whole-page screenshot.
- The selector registry is the maintained contract for closeups.
- If a production reference does not expose a reliable equivalent selector, the audit should still capture the local component and record the missing production selector in the manifest.

## Review Checklist

For each capture, verify:

- no clipped text
- no icon and label overlap
- no broken button shells
- no horizontal overflow
- spacing feels breathable under `Kernel Slate`
- hierarchy is readable in one glance
- typography matches the `Space Grotesk` and `Inter` split defined in [`DESIGN.md`](/home/atelo/projects/fardust-web/DESIGN.md)
- borders, glows, chips, and surfaces align with `Kernel Slate`

## Severity Triage

- `critical`
  - clipped CTA labels
  - overlapping text
  - unreadable controls
  - viewport overflow
  - collapsed layout
- `major`
  - broken hierarchy
  - spacing collapse
  - shell inconsistency
  - component density that violates `Kernel Slate`
- `minor`
  - color drift
  - icon alignment
  - polish mismatch

## Audit Loop

1. Generate captures for `local`.
2. Generate captures for `production-reference`.
3. Compare local captures against:
   - `DESIGN.md`
   - Stitch screen references
   - production reference screenshots
4. Triage mismatches in the manifest.
5. Fix shared shells before route-specific components.
6. Re-run the audit after each visual change set.
