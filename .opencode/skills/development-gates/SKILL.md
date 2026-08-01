---
name: development-gates
description: Use when configuring or validating local and CI development gates for this Angular/Firebase landing page.
metadata:
  short-description: Local and CI quality gates
---

# Development Gates

## Scope

Use this skill when editing local hooks, package scripts, CI workflows, Lighthouse CI, lint/test/build gates, or repository hygiene for this project.

## Required Gate Order

Local precommit:

1. `npm run format:check:staged`
2. `npm run privacy:scan`
3. `npm run lint`
4. `npm run test:dryrun`
5. `npm run build`
6. `npm run lhci:collect`
7. `npm run lhci:assert`
8. `npm run lhci:upload`

CI before deploy:

`node-ci.yml` is a test-only parallel job with no build, LHCI, or deploy. The sequence below applies to `firebase-hosting-merge.yml` and `firebase-hosting-pull-request.yml`.

1. `node scripts/privacy-scan-staged.mjs --all`
2. `npm ci`
3. `npm test -- --browsers ChromeHeadlessNoSandbox --watch=false`
4. `npm run lint`
5. `npm run build`
6. `npm run lhci:collect`
7. `npm run lhci:assert`
8. `npm run lhci:upload`
9. Firebase deploy action

## Rules

- Never use `--no-verify` in this repository.
- Do not auto-fix during commit hooks; fail and require an explicit fix instead.
- Do not run dependency install before the all-files privacy scan in CI.
- Do not use external LHCI upload targets for this project; keep reports local/filesystem-only.
- Do not check the working tree when the claim is about staged content. Either read the staged blob or fail on partially staged files.

## Manual QA

For every gate change, run at least one real scenario:

- staged secret must fail `npm run privacy:scan`;
- partially staged file must fail `npm run format:check:staged`;
- `npm run lhci:collect && npm run lhci:assert && npm run lhci:upload` must produce local report output.
