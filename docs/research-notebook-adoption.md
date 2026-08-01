# Research Notebook Adoption Brief

## Source of Truth

- Repo design authority: [`DESIGN.md`](/home/atelo/projects/fardust-web/DESIGN.md)
- Stitch project: `Personal Web Page` (`3048263380749146026`)
- Primary notebook concept: screen `10997e9f91974aaa94bf3c83561e265e` — `G.Faundez // Research Notebook`
- Mobile companion: screen `211452b982874462800c2ed0a851e4d6` — `Research Notebook Portfolio`
- Supporting references:
  - `cbf9894ebd7547919ad53a6a58ae408c` — ops dashboard
  - `2bf56d19b5d841548060ff4833bde2ca` — terminal session

## Verdict

The desktop notebook is the best next direction for the landing route.

Why it fits:

- It keeps the Kernel Slate mission-control language.
- It gives the page one dominant narrative surface instead of several equally loud boxes.
- It translates current portfolio data into evidence-heavy project cards and a clearer activity rail.
- It is less grid-dependent than the ops-dashboard concept and less stylistically narrow than the tmux-only concept.

## What To Bring Into Code

### 1. Promote one dominant hero into a lab entry

Adopt from Stitch:

- `LATEST_LAB_ENTRY` as the primary landing narrative
- one large hypothesis/result block
- inline telemetry numbers in monospace
- a stronger left accent rail instead of another boxed card

Map to current code:

- Replace the current top half of [`console-hero-panel.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-hero-panel.component.html)
- Rework styling in [`console-hero-panel.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-hero-panel.component.sass)

Implementation note:

- Keep the GitHub profile badge, but demote it to identity support.
- The main story should be the current experiment/work statement, not the badge.
- The current quote block should become the hypothesis/result area.

### 2. Turn the registry into pinned experiments

Adopt from Stitch:

- project cards with one clear code name / title
- a visual preview area
- 3-metric bands
- small tag row per project

Map to current code:

- Extend [`console-project-registry.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-project-registry.component.html)
- Restyle [`console-project-registry.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-project-registry.component.sass)
- Enrich the card data source in the home data model that feeds `registryCards`

Implementation note:

- Keep route/app links and live-site references.
- Do not copy the exact Stitch imagery; use repo-owned previews or gradient/image placeholders.
- The current “More references on GitHub” placeholder should be demoted or removed on desktop.

### 3. Convert the sidebar log into a full-width stdout strip

Adopt from Stitch:

- a bottom `SYSTEM_METRICS_STDOUT` strip
- short terminal-like log lines
- a compact CPU / VRAM telemetry pair

Map to current code:

- The current log content in [`console-sidebar-panel.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-sidebar-panel.component.html) should move out of the sidebar role
- The visual treatment in [`console-sidebar-panel.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-sidebar-panel.component.sass) should be split
- Either:
  - create a new `console-stdout-panel` subcomponent, or
  - repurpose [`console-pipeline-panel.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-pipeline-panel.component.html) into the stdout strip

Recommendation:

- Create a new `console-stdout-panel` and stop overloading the sidebar.

### 4. Recast the left rail as an actual research log

Adopt from Stitch:

- timeline-like “recent activity” rail
- clearer section labels
- active item glow

Map to current code:

- Keep [`console-left-rail.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-left-rail.component.html)
- Update copy, grouping, and active-state presentation in [`console-left-rail.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-left-rail.component.sass)

Implementation note:

- The rail should feel like a notebook/navigation spine, not just a shell accessory.
- Avoid adding more dense cards to the rail; keep it navigational and chronological.

### 5. Reduce equal-weight paneling

Current problem:

- The home route still gives similar visual weight to hero, pipeline, registry, and sidebar.

Adoption rule:

- One dominant notebook hero
- One secondary project area
- One tertiary stdout strip
- One utility rail

Map to current code:

- Simplify layout orchestration in [`info.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/info.component.html)
- Rebalance spacing in [`info.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/info.component.sass)

## What Not To Import Literally

- Do not copy the fixed top nav from the Stitch HTML. The repo already has shared navbar/footer chrome.
- Do not import the explicit grid background texture verbatim.
- Do not keep the Stitch `border` usage where it conflicts with Kernel Slate’s “background shift first” rule.
- Do not ship placeholder imagery from Stitch.
- Do not turn the whole landing route into a pure terminal. The notebook concept is the primary direction.

## Kernel Slate Compliance Notes

- Prefer tonal separation over visible hard borders.
- Keep cyan as the main signal color.
- Use amber sparingly for warnings and in-progress states.
- Keep `Space Grotesk` for labels/headlines and `JetBrains Mono` for metrics/logs.
- Preserve intentional asymmetry and breathing room between major modules.

## Recommended Implementation Order

1. Rebuild `console-hero-panel` into the notebook hero.
2. Upgrade `console-project-registry` into pinned experiments with metrics and tags.
3. Introduce a dedicated stdout panel and remove log overload from the sidebar.
4. Reframe the left rail copy as research-log navigation.
5. Rebalance the page shell so the hero clearly dominates on desktop and collapses cleanly on mobile.

## Suggested Data Additions

- Add a `latestLabEntry` model:
  - `date`
  - `hypothesis`
  - `result`
  - `status`
  - `metrics[]`
- Extend project cards with:
  - `code`
  - `previewImage`
  - `metrics[]`
  - `tags[]`
- Add stdout items with:
  - `time`
  - `message`
  - `tone`

## Immediate Next Coding Tranche

If we implement this now, the first files to touch should be:

- [`info.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/info.component.html)
- [`info.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/info.component.sass)
- [`console-hero-panel.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-hero-panel.component.html)
- [`console-hero-panel.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-hero-panel.component.sass)
- [`console-project-registry.component.html`](/home/atelo/projects/fardust-web/src/app/home/info/console-project-registry.component.html)
- [`console-project-registry.component.sass`](/home/atelo/projects/fardust-web/src/app/home/info/console-project-registry.component.sass)
- new `console-stdout-panel` component under `src/app/home/info/`
