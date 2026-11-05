---
paths:
  - "app/**/graphql/**"
  - "codegen.ts"
---

# Database Rules: Content-Model Migrations

These extend `.claude/rules/general-rules.md` and `database-rules.md`.

## 1. What counts as a migration

Any change to the CMS content model is a migration: adding, renaming or removing a post type, ACF field, select value or taxonomy, or changing a field's type or its GraphQL name. Each one can break the generated types and the live site.

## 2. Versioning

- **Version the content model.** Post types are registered in code, and ACF field groups are saved as ACF Local JSON (or registered in PHP) in the CMS's own repository. They are never only clicked together in the admin.
- **Data changes** (backfills, moving values between fields) are done with WP-CLI commands or scripts that can be repeated safely. Never run hand-edited SQL against production.
- **Rehearse on staging.** Every migration is rehearsed on a staging copy and preceded by a database backup.

## 3. Backward-compatible order (expand, then contract)

1. **Expand:** add the new type, field or value without removing anything.
2. **Front end:** the backend-developer updates queries and runs `yarn codegen` and `yarn tsc --noEmit`. The UI handles both the old and the new shape where needed.
3. **Migrate data:** backfill the new field and check the content.
4. **Contract:** remove the old field or value only after the front end no longer queries it.

- **Renaming a GraphQL field name or select value is a breaking change.** Do it with the steps above, never in place.
- **Enum changes** (status select values) update the matching enum in `app/utils/constants.tsx` in the same front-end change.
- **Deleting** a field, type or value that holds content needs explicit user approval.

## 4. Reporting

A migration spec states the order of steps, what the front end must change at each step, how to roll back, and how to verify the result (the WPGraphQL query to run and the expected shape).
