# AGENTS.md

## Project

Digital Solutions website: the front end of a site whose content comes from a **headless WordPress CMS** through **WPGraphQL** (with ACF fields). It is built with **Next.js (App Router)**, **React 19** and **TypeScript** (strict). Data is fetched with **Apollo Client**, styling is **plain CSS Modules**, and tests use **Jest**, **React Testing Library** and **Playwright**. The package manager is **Yarn**. Never use npm, pnpm or bun to install packages.

**All generated code, from you or from any subagent, must follow the project conventions below.** The existing `create-next-app` boilerplate in `app/` does not follow them yet. Any file that is created must comply, and any file that is modified must be brought fully into compliance.

## Where the standards are

| Standard | Location |
|---|---|
| **Shared rules for all code** (formatting, naming, folder structure, where shared types, constants and utilities live, TypeScript, one-line comment per function, error handling, approved libraries, package policy, reporting format) | **`.claude/rules/general-rules.md`** |
| Frontend: architecture, server and client components, data flow, forms, accessibility | `.claude/rules/frontend/frontend-rules.md` |
| Frontend: component structure, props, lists, icons | `.claude/rules/frontend/component-rules.md` |
| Frontend: plain CSS, variables, single `850px` breakpoint | `.claude/rules/frontend/styling-rules.md` |
| Backend: Apollo setup, page data loading, Cache Components, route handlers, server actions | `.claude/rules/backend/backend-rules.md` |
| Backend: GraphQL query files, WPGraphQL best practices, Codegen | `.claude/rules/backend/api-rules.md` |
| Security (applies everywhere) | `.claude/rules/backend/security-rules.md` |
| CMS content model (WordPress, ACF, WPGraphQL, MySQL) | `.claude/rules/database/database-rules.md` |
| Content-model migrations | `.claude/rules/database/migration-rules.md` |
| Testing: tools, configuration, placement, style | `.claude/rules/testing/testing-rules.md` |
| Testing: required tests and coverage thresholds | `.claude/rules/testing/test-coverage-rules.md` |
| Subagent definitions | `.codex/agents/*.toml` |
| Permission guardrails (package installs, protected files) | `.claude/settings.json` |

Precedence: the user's instructions, then `general-rules.md`, then the domain rules. If two rules contradict each other, stop and ask; don't pick one.

## Subagents and when to delegate

| Subagent | Delegate when the task involves | Never for |
|---|---|---|
| `frontend-developer` | React components (`*Content`, `*Entry`, `Shared*`), client interactivity, forms UI, CSS Modules and global stylesheets, MUI icons or custom SVG icons, the JSX a page or layout renders | Queries, data loading, actions, route handlers, tests |
| `backend-developer` | New or changed CMS data: GraphQL documents, Codegen, Apollo setup, data loading in `page.tsx` and `layout.tsx`, Cache Components and revalidation, server actions, route handlers, environment variables, `next.config.ts` | Markup, CSS, tests |
| `database-specialist` (read-only) | Designing or changing the CMS content model (post types, ACF fields, status values, taxonomies), WPGraphQL exposure, CMS-side performance and security, migration plans. Returns a spec and edits nothing | Writing code in this repo |
| `qa-engineer` | Jest unit tests, Jest with React Testing Library component tests, Playwright end-to-end tests, test configs, regression tests, coverage checks | Changing application code to make tests pass |
| `code-reviewer` (read-only) | Reviewing any change against `general-rules.md` plus the matching domain rules and agent boundaries. Returns findings and a verdict | Fixing code |

### Delegation workflow

1. **Classify the task** by the areas it touches, using the table above. A task that touches several areas goes to several agents, in this order:
   1. `database-specialist`, when CMS content must change. Its spec goes to the user for CMS changes and to the backend.
   2. `backend-developer`, for queries, data loading and actions. Its data contract goes to the frontend.
   3. `frontend-developer`, for components and CSS.
   4. `qa-engineer`, for the tests the coverage rules require.
   5. `code-reviewer`, **always last, after any code change**.
2. **Pass context forward.** Give each agent the relevant output of the previous one: the spec, the data contract, the list of changed files.
3. **Review loop.** If `code-reviewer` returns **CHANGES REQUESTED**, send each finding to the owning agent named in the finding, then run `code-reviewer` again. Report the work as done only after an **APPROVED** verdict.
4. **Small edits.** For a trivial edit (a typo, a one-line change) you may work directly, but you must still follow every rule and still run `code-reviewer` on the change.
5. **Surface approvals.** Package proposals, CMS changes, `next.config.ts` flag changes and new `package.json` scripts all go to the user for approval. Never approve them on the user's behalf.

## Non-negotiables (details in `general-rules.md`)

- **Formatting:** 4 spaces, no semicolons, single quotes (JSX attributes too), `{noBracketSpacing}`, trailing commas, `x => ...`, 80 columns.
- **Names:** long, descriptive names, with no abbreviations and no word-plus-abbreviation mixes (`ctx` → `canvasDrawingContext`, `deltaMs` → `timeSincePreviousFrame`). Routes are kebab-case, component folders snake_case, components PascalCase, constants and enums UPPER_SNAKE_CASE.
- **Comments:** a one-line purpose comment above every named function, and no other comments. Any other comment an agent thinks is truly necessary goes to the main agent for a decision. The main agent lists every such request, with its location and decision, at the end of the reply (see `general-rules.md` section 9).
- **Shared locations:** types in `app/SharedTypes.ts`, constants in `app/utils/constants.tsx`, helpers in `app/utils/<domain>Handler.ts`, icons in `app/utils/icons/`. Imports use the `@/app/...` alias.
- **Styling:** plain CSS only. Custom icons are plain `<svg>` components, and MUI icons are used only inside client components. Fonts load only with `next/font` in `app/layout.tsx`. The only media query is `@media only screen and (max-width: 850px)`.
- **Packages:**
  - Any direct install needs user approval first.
  - Before proposing a package, evaluate adoption, maintenance, reliability, security and compatibility.
  - Only propose packages with 10,000+ weekly downloads. If none qualifies, ask the user for suggestions.
- **Protected files:** never hand-edit generated GraphQL files, `yarn.lock` or `.env*`.
- **Builds:** the application is built locally as a Next.js standalone output with `yarn build:standalone`. Never run it (or any other production build) without explicit user approval first. This applies to you and to every subagent. Use `yarn lint` and `yarn tsc --noEmit` for verification instead.

## Commands

`yarn dev` · `yarn build:standalone` (approval required) · `node .next/standalone/server.js` (run the standalone build) · `yarn lint` · `yarn tsc --noEmit` · `yarn jest` · `yarn playwright test` (once installed) · `yarn codegen` (once set up)

### Suggesting commands with values to replace

When you give the user a command to run that contains a value they must fill in (a name, path, ID, port or secret), you and every subagent must:

- Wrap each value to replace in angle brackets with a descriptive snake_case name, whenever the shell syntax allows it: `<application_name>`, not `application` or `app`.
- Directly underneath the command, name each placeholder and say what to replace it with.

Example:

```bash
docker rm -f <application_name> || true
```

Make sure to replace `<application_name>` with your application name.

## Production server

- **Access:** the app runs on a DigitalOcean droplet. Reach it with the SSH alias from the local SSH config: `ssh -o BatchMode=yes e4-claude "<command>"`. The server details (address, users, keys) are in the workspace `CLAUDE.md` one folder up. This repo is public: never write the server's IP address, user names or key paths in it.
- **SSH limits:** the server bans IPs that open too many SSH connections. Put all checks into one `ssh` call, and make no more than about 3 connections in 5 minutes.
- **Docker access:** the alias logs in as a read-only user that isn't in the `docker` or `sudo` groups. `sudo` allows only `docker ps`, `docker logs` and `docker images`, called as `sudo -n /usr/bin/docker ps|logs|images ...`. Everything else is denied, including `docker inspect`, which would print the `.env` secrets.
- **The developer's own account** on the server is in the `docker` group, so commands you give the user run `docker` without `sudo`.
- **Container:** one container named `digital-solutions-website`, from the image `ghcr.io/edwinb24/digital-solutions-website:<short_sha>`. It publishes `127.0.0.1:3000:3000` only, and Apache in front of it handles HTTPS for `e4digitalsolutions.com`. Never publish port 3000 without `127.0.0.1:`.
- **Secrets:** production environment variables are in `/opt/digital-solutions-website/.env` on the server. Never read or print that file.
- **Deploy key:** the GitHub Actions deploy key is only for CI. Never use it for interactive access.

### Rules for working on the server

- Read-only commands are fine to run when asked, for example:
  ```bash
  ssh -o BatchMode=yes e4-claude "sudo -n /usr/bin/docker ps; sudo -n /usr/bin/docker logs --tail 200 digital-solutions-website"
  ```
- Ask the user before any command that changes state: pulling or removing images, `docker rm`, `docker run`, restarts, editing files or installs. For these, give the user the command to run as their own account. Don't ask them to widen the read-only user's permissions.
- For deploys and rollbacks, follow the "Deploying" section of `README.md`. Normal deploys run from `.github/workflows/deploy.yml` on a push to `main` that changes `.next/standalone/**`, `Dockerfile`, `.dockerignore` or the workflow.
- To find out which version is live, look at the image tag in `docker ps --format '{{.Image}}'`. The tag is the short SHA of the deployed commit.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
