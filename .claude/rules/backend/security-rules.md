---
paths:
  - "app/api/**"
  - "app/**/actions/**"
  - "app/utils/privateConstants.ts"
  - "app/components/lib/**"
  - "next.config.ts"
---

# Backend Rules: Security

These extend `.claude/rules/general-rules.md` and `backend-rules.md`. Every agent follows them. The code-reviewer checks them on every review.

## 1. Secrets and environment variables

- **Never hard-code** secrets (API keys, access keys, tokens, passwords, webhook secrets) in source files, constants or tests.
- **Server-only secrets** live in `.env.local` (git-ignored by `.env*`) and are read through `process.env`, in **one place**: `app/utils/privateConstants.ts`. That file exports them as UPPER_SNAKE_CASE constants (`export const FORMS_ACCESS_KEY = process.env.FORMS_ACCESS_KEY || ''`).
- **Server only.** `privateConstants.ts` may be imported only by server code: pages, layouts, server actions and route handlers. Never import it from a `'use client'` file.
- **Public values.** Only values that are safe to expose may use the `NEXT_PUBLIC_` prefix.
- **Document variable names.** List every required variable name (never its value) in the README's setup section.
- **Do not read or print** `.env*` files.

## 2. CMS content

- **Not a sanitizer.** `html-react-parser` turns HTML into React elements, but it does **not** sanitize. Use `parse(...)` only for HTML written by trusted CMS editors. Never use it for content submitted by site visitors or third parties. If untrusted HTML ever has to be rendered, propose a sanitizer under the package policy.
- **No `dangerouslySetInnerHTML`.**
- **Public data only.** The site queries only published, public content. Draft, private or preview content needs authenticated server-side requests and explicit user approval.

## 3. Requests and inputs

- **Server-side secrets.** Requests that carry a secret run on the server (server action or route handler). They never run from client components.
- **Validate everything.** Check all external input (form fields, route params, query strings, webhook bodies) for type, length and format on the server. Validation in the browser is only for user experience.
- **Webhooks and revalidation** check a shared secret header. When the check fails, they return 401 without explaining why.
- **Error responses** never include stack traces, internal messages or upstream response bodies.
- **External links** opened with `target='_blank'` include `rel='noopener noreferrer'`.

## 4. CMS-side expectations

These belong to the database-specialist and are listed here for awareness:

- WPGraphQL exposes only the post types and ACF fields the site needs ("Show in GraphQL" is off for everything else).
- Public introspection is turned off in production, and query depth and complexity limits are set.
- WordPress authentication (application passwords or JWT) is used only from the server, with a least-privilege user.

## 5. Dependencies

- **Follow the package policy** in general-rules section 4. Check every proposed package for known security advisories.
- **Never commit** `.env*` files, keys or credentials.
