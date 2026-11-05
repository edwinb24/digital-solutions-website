---
paths:
  - "app/**/graphql/**"
  - "app/api/**"
  - "app/**/actions/**"
  - "codegen.ts"
---

# Backend Rules: GraphQL API and Codegen

These extend `.claude/rules/general-rules.md` and `backend-rules.md`.

## 1. Query files

- **Location:** `app/components/<feature_name>/graphql/useGet<Thing>Query.ts`. Even though it holds a document and not a hook, the file keeps the `use...Query` name so that Codegen produces `useGet<Thing>Query.generated.ts` next to it.
- **One operation per file.** Mutations use `use<Verb><Thing>Mutation.ts`.
- **Naming:**

  | Item | Pattern | Example |
  |---|---|---|
  | Operation name | PascalCase, starting with `Get` | `GetServicesPageContent`, `GetAllServices`, `GetNavigationMenuList`, `GetSingleService` |
  | Exported document | Operation name with a lowercase first letter | `getServicesPageContent` |
  | Generated types | `<Operation>Query`, `<Operation>QueryVariables` | `GetAllServicesQuery`, `GetAllServicesQueryVariables` |

- **Template:**

  ```ts
  import {gql, TypedDocumentNode} from '@apollo/client'
  import {
      GetAllServicesQuery,
      GetAllServicesQueryVariables,
  } from './useGetAllServicesQuery.generated'

  export const getAllServices: TypedDocumentNode<
      GetAllServicesQuery,
      GetAllServicesQueryVariables
  > = gql`
      query GetAllServices($first: Int!) {
          services(first: $first) {
              nodes {
                  id
                  title
                  uri
                  serviceFields {
                      shortDescription
                      serviceStatus
                      featuredImage {
                          node {
                              sourceUrl
                              altText
                          }
                      }
                  }
              }
          }
      }
  `
  ```

- **Typing:** documents are always typed as `TypedDocumentNode<Query, Variables>` with the generated types, so `getClient().query(...)` returns typed `data`.
- **Indentation:** GraphQL inside the template literal is indented 4 spaces per level.

## 2. WPGraphQL best practices

- **Variables, never interpolation.** Pass values through typed variables (`$id: ID!`, `$first: Int!`). Never interpolate values into the `gql` template.
- **Request only what the UI uses.** Every node includes `id`, which Apollo needs for cache normalization. `__typename` is added automatically.
- **Paginate connections.** Always set `first:`. WPGraphQL returns 10 items by default and caps at 100. For more than 100, use cursor pagination (`pageInfo {hasNextPage endCursor}` with `after:`).
- **Look up single nodes** by global ID (constants `*_PAGE_ID`) or by slug or URI with `idType` (`service(id: $slug, idType: SLUG)`). Dynamic routes use the slug.
- **ACF fields** are read through their GraphQL field-group name (`serviceFields { ... }`). Use the exact field names from the schema. Never guess.
- **Images:** request `sourceUrl` and `altText`, plus `mediaDetails {width height}` when the layout needs the real dimensions.
- **CMS HTML fields** (`content`, `description`) arrive as rendered HTML strings. The UI renders them with `parse(...)`.
- **One request per page.** Combine what a page needs into a single operation (for example the page post plus the list it shows) so you avoid waterfalls.
- **Mutations** need WordPress authentication. Run them only on the server (server action or route handler), with credentials from server-only environment variables.

## 3. Codegen

Codegen is not set up yet. Setting it up needs approval for the `@graphql-codegen/*` packages (general-rules section 4). When it is set up:

- `codegen.ts` lives at the project root and follows these conventions (check option names against the current Codegen docs):

  ```ts
  import {CodegenConfig} from '@graphql-codegen/cli'

  const config: CodegenConfig = {
      overwrite: true,
      schema: '<WPGraphQL endpoint, same value as SERVER_URL>',
      documents: ['app/**/*.{ts,tsx}'],
      ignoreNoDocuments: true,
      generates: {
          './types/__generated__/graphql.ts': {
              plugins: ['typescript'],
          },
          './': {
              preset: 'near-operation-file',
              presetConfig: {
                  baseTypesPath: 'types/__generated__/graphql.ts',
              },
              plugins: ['typescript-operations'],
              config: {
                  avoidOptionals: {field: true, inputValue: false},
                  defaultScalarType: 'unknown',
                  nonOptionalTypename: true,
                  skipTypeNameForRoot: true,
              },
          },
      },
  }

  export default config
  ```

- **Script:** `package.json` gets `"codegen": "graphql-codegen --config codegen.ts"`.
- **Regenerate after every query change.** Run `yarn codegen` and then `yarn tsc --noEmit`. Generated files are committed and never edited by hand.
- **Nullable fields.** Generated types use `null` for nullable fields (`avoidOptionals.field`), so consumers must handle `null` with `?.` and `|| ''` fallbacks.

## 4. Responses to the UI

- The UI layer receives either the typed query result or flattened `Type*` props. Never pass untyped `any` or partial objects.
- **Contract changes.** When a query's shape changes, list the affected components in your report so the frontend-developer can update them.
