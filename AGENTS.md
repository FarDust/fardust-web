# Repository Rules

- Never use `git commit --no-verify` or any `--no-verify` git option in this repository. Fix the failing hook, or stop and report the blocker instead.
- Use conventional commits for git commits in this repository with `-m "<type>[optional scope]: <description>" -m "<extra-detail>"` as described at https://www.conventionalcommits.org/en/v1.0.0/.
- When the user asks to wait for a pull request or workflow to finish, wait until the full PR status set is complete before reporting back, including non-GitHub Actions statuses such as `CodeRabbit`, unless the user explicitly scopes the request more narrowly.

## Stitch Design Tool

- **HARD RULE — Single project only:** ALL Stitch work MUST use project "Personal Web Page" (ID: `3048263380749146026`). NEVER create new Stitch projects. Read `.stitch` for the project ID, base screen ID, and design system IDs.
- **Base screen:** Always use the base screen defined in `.stitch` as the source for new generations. Download its screenshot and HTML via `curl -L` before generating to understand the existing style.
- **Experiment tracking:** When generating screens in Stitch, log each experiment in `.stitch-experiments.md` with: screen ID, project ID, prompt used, design system applied (if any), date, and a short note on the concept/intent.
- **Polling for results:** Stitch `generate_screen_from_text` often exceeds the MCP timeout. After a timeout, poll with `list_screens` at 30-second intervals (up to 5 attempts) to check if the generation completed server-side.
- **Design system:** Always use "Kernel Slate" (`b03c8dd0fdd64d41812b95dc909c1513`) as the primary design system. Read `.stitch` for the asset ID. Do not create new design systems.
- **Hidden content:** Ignore 100% any screen or screen instance marked as `hidden` in the project. Hidden screens are superseded or discarded — do not reference, rank, or recommend them.
- **Context in prompts:** Stitch has NO access to the codebase, git history, or Linear tasks. Before generating, read the current Angular components to extract real section names, project titles, profile text, route structure, and copy so the generated design matches the live site content. Every prompt must include enough context for Stitch to produce designs that talk to the actual landing page.
