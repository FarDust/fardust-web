---
name: live-preview
description: Use when the user asks for a live preview, preview link, Firebase preview, deployed branch preview, or to see the current branch running online.
metadata:
  short-description: Live preview PR deployment workflow
---

# Live Preview

## Scope

Use this skill whenever the user asks for a live preview, preview URL, Firebase preview, deployed branch preview, or says they want to see the current branch running online.

## User Approval Semantics

A request for a live preview is explicit approval to prepare and deploy the current branch preview. Do not ask for a second confirmation before doing the required branch, PR, or preview-deploy steps, unless credentials or irreversible external actions are blocked.

## Required Workflow

1. Inspect the current branch, worktree, staged changes, upstream, recent commits, and existing PRs.
2. Run the relevant repository gates before publishing a preview. Prefer `npm run precommit:verify`; at minimum run formatting, privacy scan, lint, tests, and build gates appropriate to the changed files.
3. Commit all pending intended changes needed for the preview using conventional commits and normal hooks.
4. Push the branch if it is not already up to date on the remote.
5. Create a PR if one is not already open for the branch. Reuse the existing PR if present.
6. Wait for the PR-triggered Firebase Hosting preview workflow to run.
7. Report the preview URL only when it is present in workflow output, PR comments, or check details.

## Rules

- Never use `--no-verify`.
- Never create duplicate PRs for the same branch.
- Never fabricate or infer a Firebase URL; cite only a URL observed from GitHub or Firebase output.
- Never include generated local artifacts such as `output/`, `.lighthouseci/`, `dist/`, screenshots, traces, coverage, or agent transcripts in the preview commit.
- If authentication blocks push or PR creation, stop and report the exact blocked credential path.

## Exit Criteria

- The branch is pushed.
- A PR exists for the branch.
- Required checks have started or completed.
- The final response includes the real preview URL, or a clear blocker if the workflow did not produce one.
