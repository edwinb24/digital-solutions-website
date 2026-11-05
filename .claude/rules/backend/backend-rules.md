---
paths:
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
  - "app/components/lib/**"
  - "app/**/graphql/**"
  - "app/**/actions/**"
  - "app/api/**"
  - "app/utils/privateConstants.ts"
  - "codegen.ts"
  - "next.config.ts"
---

# Backend Rules: Data Layer

These extend `.claude/rules/general-rules.md`. Read that file first.

## 1. What "backend" means here

This repository is the front end. The backend is a **headless WordPress CMS** that exposes its content through **WPGraphQL**, with ACF (Advanced Custom Fields) holding custom fields. It is not in this repository. In this repository, the backend layer is the server-side data layer of the Next.js app:

- The Apollo clients in `app/components/lib/`.
- GraphQL documents in `app/components/<feature>/graphql/` and Codegen (`codegen.ts`). See `api-rules.md`.
- Data loading in `page.tsx` and `layout.tsx`.
- Server actions in `app/components/<feature>/actions/` and route handlers in `app/api/`.
- Environment variables and secrets (`app/utils/privateConstants.ts`). See `security-rules.md`.
- `next.config.ts`.

Changes to the CMS itself (post types, ACF fields, plugins, the database) are specified by the database-specialist agent and applied by a person in WordPress. Never assume a CMS field exists. Check the schema (generated types or introspection) or ask.

## 2. Apollo client setup

- `app/components/lib/ApolloClient.ts` exports `{getClient, query, PreloadQuery}` from `registerApolloClient(...)` (from `@apollo/client-integration-nextjs`). It creates a new `ApolloClient` with `new InMemoryCache()` and `new HttpLink({uri: SERVER_URL})`. Server components use `getClient()`.
- `app/components/lib/ApolloWrapper.tsx` starts with `'use client'`, defines a `makeClient()` factory with the same cache and link, and exports `ApolloWrapper({children})`, which renders `ApolloNextAppProvider`. `layout.tsx` wraps the app in it.
- The endpoint URL is the `SERVER_URL` constant in `app/utils/constants.tsx`. Never repeat it anywhere else.
- Turn `devtools` on only outside production.

## 3. Loading data in pages and layouts

Prefer server-side fetching. Use client-side Apollo hooks (`useSuspenseQuery` or `useQuery` from `@apollo/client/react`, under `ApolloWrapper`) only when data has to change after a user interaction.

The standard page shell:

```tsx
import {getClient} from '@/app/components/lib/ApolloClient'
import {getServicesPageContent} from '@/app/components/services_content/graphql/useGetServicesPageContentQuery'
import ServicesContent from '@/app/components/services_content/ServicesContent'
import {SERVICES_PAGE_ID} from '@/app/utils/constants'

// Loads the services page content from the CMS and renders the page body
export default async function ServicesPage() {
    const {data, error} = await getClient().query({
        query: getServicesPageContent,
        variables: {id: SERVICES_PAGE_ID},
    })

    if (error) return <p>Error Loading this Element</p>
    if (!data || !data.post?.title || !data.services?.nodes) {
        return <p>Element Failed to Load</p>
    }

    return <ServicesContent servicesPageData={data} />
}
```

- **Name pages** `<RouteName>Page`: `ServicesPage`, `ContactUsPage`, `ServiceDetailPage`.
- **Fetch once.** Use one `getClient().query(...)` per operation, and fetch everything the page needs in one operation where you can.
- **Variables come from constants** (`*_PAGE_ID`) or route params. Await `params` and normalize them first: `const {serviceName} = await params`, then `const normalizedServiceName = serviceName.replaceAll('-', ' ')`.
- **Guard in order:**
  1. `error`.
  2. Missing `data` and every nested node the UI needs.
  3. Return the standard fallback paragraphs from general-rules section 10.
- **Flattening:**
  - When a page renders a single entity, flatten it in the page with a spread destructuring and `|| ''` / enum fallbacks.
  - When the page passes a list, pass the typed query result and let the Content component flatten each item.
- **Shared data in the layout.** Menus, footer links and social links load in `app/layout.tsx` and go to the header and footer as props.

## 4. Cache Components

`next.config.ts` turns on `cacheComponents` and `partialPrefetching`. Before writing any data-loading code, read the Next.js docs bundled with the installed version:

- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`

Rules:

- **Cached or wrapped.** Every CMS read is either cached (`'use cache'` with `cacheLife`, plus `cacheTag` for on-demand revalidation) or rendered inside `<Suspense>`. Content that changes rarely (pages, menus) is cached.
- **Cached loaders** go in the page or layout file, above the component, named `load<Thing>Data`, with their one-line comment.
- **Don't disable the flags.** Never turn off `cacheComponents` or `partialPrefetching`, or change other `next.config.ts` flags, without user approval.
- **Verify with `yarn build`.** Cache Components errors surface at build time.

## 5. Revalidation (CMS to site)

- **Webhook route.** Content updates reach the site through a WordPress webhook that calls a route handler, `app/api/revalidate/route.ts`.
- **Check the secret.** The handler verifies a shared secret header against a server-only environment variable, then revalidates the affected cache tags.
- **Tag names** are lowercase kebab-case and match the content type: `services`, `navigation-menu`.
- Use the revalidation API exactly as the bundled `09-revalidating.md` documents it for the installed Next.js version.

## 6. Route handlers and server actions

- **Route handlers:**
  - Location: `app/api/<kebab-name>/route.ts`, exporting named `GET` or `POST` functions, each with its one-line comment.
  - Validate every input (body, query, headers) before using it.
  - Respond with `Response.json(...)` and correct status codes: 400 for bad input, 401 for a bad secret, 500 for an unexpected failure.
  - Wrap the work in `try/catch`, log with `console.error(e)`, and never return stack traces or internal messages.
- **Server actions:**
  - Location: `app/components/<feature>/actions/<verb><Thing>.ts`, with `'use server'` on the first line (for example `submitContactForm.ts`).
  - Use them for form submissions or any request that needs a secret.
  - Return a typed result such as `{success: boolean, errorMessage: string}`. Do not throw to the client.
- **Third-party REST calls:**
  - Use `fetch` with explicit `method` and `headers` (`'Content-Type': 'application/json'`, `Accept: 'application/json'`).
  - Check `response.ok` and the service's own success flag.
  - Wrap the call in `try/catch`.

## 7. next.config.ts

- The backend-developer owns this file. Remote CMS images need either `images.remotePatterns` set for the CMS media host or an explicit decision about optimization. Ask the user before choosing.
- Keep the config minimal and typed (`import type {NextConfig} from 'next'`).
