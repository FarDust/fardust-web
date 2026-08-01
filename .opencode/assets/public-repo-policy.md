# Public Repo Development Policy

This repository is public and may intentionally include public profile content. Treat deliberate landing-page copy as publishable PII, but block secrets and local artifacts before commit or deploy.

## Allowed Public Content

- Name, role, portfolio narrative, project names, public links, and public contact copy.
- Public screenshots or generated assets intended for the site.

## Blocked Content

- `.env*`, service account files, API tokens, OAuth tokens, private keys, bearer tokens, raw local audit output, agent transcripts, `.lighthouseci/`, `output/`, `.artifacts/`, `.codex`, `.firecrawl/`, and `.sisyphus/`.

## Required Checks

Local:

- `npm run precommit:verify`

CI before install:

- `node scripts/privacy-scan-staged.mjs --all`

Manual QA after gate changes:

- Prove fake staged secrets fail.
- Prove intentional public PII remains allowed.
- Prove Lighthouse reports stay local and ignored.
