---
name: public-repo-safety
description: Use when preparing a public repository that may intentionally contain public PII but must not expose secrets, credentials, local artifacts, or generated audit outputs.
metadata:
  short-description: Public repo privacy and secret safety
---

# Public Repo Safety

## Scope

Use this skill before committing, opening a PR, or adding automation to a public repository where public profile details, contact copy, or portfolio content may be intentional. Public PII is allowed when it is deliberate product content. Secrets, credentials, environment files, tokens, private keys, local agent artifacts, and generated audit outputs are never allowed.

## Required Workflow

1. Identify whether sensitive-looking content is intentional public copy or a secret. Do not remove deliberate public profile text just because it is personal.
2. Run the repository privacy scanner before any dependency install in CI-like flows:
   - `node scripts/privacy-scan-staged.mjs --all`
3. For local commit readiness, run staged gates:
   - `npm run privacy:scan`
   - `npm run format:check:staged`
4. Verify `.env*`, local output folders, LHCI output, and agent artifacts are ignored and blocked by the scanner.
5. If a finding is intentional public copy, narrow the scanner rule rather than adding a broad allowlist. High-confidence tokens and private keys must never be allowlisted.

## Public PII Policy

Allowed when intentional and reviewed:

- Name, role, public bio, portfolio project copy, public social links, public contact aliases.

Blocked always:

- API keys, bearer tokens, private keys, OAuth tokens, service account JSON, `.env*`, local databases, generated Lighthouse reports, agent transcripts, and private notes.

## Exit Criteria

- `npm run privacy:scan:ci` passes.
- A staged fake secret fails the scanner during manual QA.
- CI scans repository content before `npm ci` or any other dependency lifecycle scripts run.
