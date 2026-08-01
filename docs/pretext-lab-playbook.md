# Pretext Lab Playbook

## Authority

- [`DESIGN.md`](/home/atelo/projects/fardust-web/DESIGN.md) is the only design authority for `/pretext`.
- [`VALIDATION.md`](/home/atelo/projects/fardust-web/VALIDATION.md) is the behavior and validation oracle for the Pretext integration.
- This document covers implementation guardrails for the route. It does not define a separate visual system.

## Product Direction

- Keep Pretext in the product. Fix broken layouts by improving the implementation, not by deleting the Pretext path.
- Apply Pretext to route-owned visible text surfaces only. Do not force it onto third-party widgets, PDF content, icon fonts, or browser-native control text.
- Use the `/pretext` route as the dedicated lab for the library’s strongest capabilities, while the rest of the site adopts the shared renderer in a restrained way.

## Architecture Rules

- Keep the Pretext implementation modular: prefer focused subcomponents over one large showcase component.
- Follow clean architecture boundaries in the Angular code: shared renderer and helpers in reusable components/services, page copy in dedicated data modules, and route-specific behavior in route components.
- Stay DRY. Shared section chrome, labels, and metrics should be extracted when repeated.
- Preserve accessible DOM text. The sitewide rollout should keep text readable and selectable instead of shifting normal content to canvas or SVG.

## Responsive Rules

- Do not rely on grid-heavy layouts to solve responsiveness.
- On small devices, make actions and dense control surfaces stack or stretch instead of shrinking text into unreadable capsules.
- Fix responsive failures at the component level with explicit states for narrow viewports.
- Any new label or CTA added to the lab must be checked on mobile widths, not only desktop.

## Pretext Rules

- Use the shared Pretext service and renderer for route-owned text.
- Respect the guidance in [`VALIDATION.md`](/home/atelo/projects/fardust-web/VALIDATION.md) as the implementation and QA oracle.
- Keep locale-aware behavior, mixed-script validation, shrinkwrap support, and no-wrap usage honest. Do not hide bugs with silent truncation.
- Pretext demos may inspire interactions, but the final implementation must remain consistent with [`DESIGN.md`](/home/atelo/projects/fardust-web/DESIGN.md).

## Testing Rules

- Use TDD where practical for regressions: add or tighten a test before fixing the bug.
- Keep Angular component tests around data binding and component seams.
- Keep Playwright coverage for layout-critical flows, especially mobile behavior on `/pretext`.
- New responsive fixes should be protected by an e2e assertion when the failure is visual or viewport-specific.
