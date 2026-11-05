---
paths:
  - "app/**/graphql/**"
  - "app/SharedTypes.ts"
  - "codegen.ts"
---

# Database Rules: CMS Content Model

These extend `.claude/rules/general-rules.md`, whose naming and enum rules apply to every name that reaches the front end.

## 1. Where the data lives

- **Storage.** Content is stored in the MySQL database of a **headless WordPress** install. It is modeled with custom post types and **ACF** field groups and exposed only through **WPGraphQL**.
- **No direct database access from this repository.** No SQL, no database drivers and no ORMs. Everything goes through the WPGraphQL endpoint (see `backend/api-rules.md`).
- **Changes are specified, not coded.** The database-specialist writes a content-model specification. A person applies it in WordPress (or in the CMS's own code repository). The backend-developer then updates queries and runs Codegen.

## 2. Content modeling

- **Custom post types** for each kind of content the site lists or routes to (services, case studies, testimonials). Registered in code with `show_in_graphql: true`, a camelCase `graphql_single_name` (`service`) and `graphql_plural_name` (`services`).
- **Pages and posts** hold one-off page content (intro title and body). The front end reads them by global ID constants (`*_PAGE_ID`).
- **ACF field groups:**
  - One group per post type, named `<Thing> Fields` and exposed to GraphQL as `<thing>Fields` (`serviceFields`), with "Show in GraphQL" turned on.
  - Field GraphQL names are camelCase, descriptive and identical to the prop names the front end uses (`shortDescription`, `linkToBooking`, `featuredImage`). This lets the front end flatten nodes with a spread.
- **Status fields:** every listable type has a select field `<thing>Status` with lowercase values (`published`, `draft`, `hidden`). Each one is mirrored by a string enum in `app/utils/constants.tsx` (`SERVICE_STATUS`). New values must be added in both places.
- **Repeaters** are for ordered child lists (for example sessions or features), with camelCase sub-field names prefixed by the parent context (`sessionStartTime`, `sessionNotes`).
- **Image fields** return the media node. Alt text is required in the CMS for every image used by the site.
- **Menus and global settings** (navigation flags such as `addToMainMenu`, social links) are modeled as fields or a dedicated post type so editors can change them without a deploy.
- **Dates** are stored as ISO 8601 strings in UTC. The front end formats them with a handler in `app/utils/`.

## 3. Performance

- **Filter with taxonomies.** Use them instead of filtering on meta fields (`meta_query` is slow at scale).
- **Bound every list query** with `first:`. Use cursor pagination beyond 100 items.
- **Caching:** recommend persistent object caching (for example Redis) and WPGraphQL caching or invalidation at the CMS level. Front-end revalidation is driven by webhooks (see `backend/backend-rules.md` section 5).

## 4. Security and operations

- WPGraphQL exposes only the types and fields the site needs. Public introspection is off in production, and depth and complexity limits are set.
- The database user has least privilege, database admin tools are not publicly reachable, and automated backups exist before any change.

## 5. Specification format

Every content-model proposal includes:

1. Purpose: what the front end needs and why.
2. Post types: slug, GraphQL single and plural names.
3. Fields table: label, GraphQL name, ACF type, required, allowed values or format.
4. Matching front-end additions: enum values for `constants.tsx`, `Type*` shapes for `SharedTypes.ts`.
5. An example WPGraphQL query in the `api-rules.md` format.
6. Migration impact (see `migration-rules.md`).
