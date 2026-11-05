---
paths:
  - "app/**/*.tsx"
  - "app/**/*.css"
---

# Frontend Rules: Architecture

These extend `.claude/rules/general-rules.md`. Read that file first. These rules cover how the UI layer is organized. Component structure is in `component-rules.md` and CSS is in `styling-rules.md`.

## 1. Rendering model

- **Server components by default.** A component becomes a client component only when it needs `useState`, `useEffect`, browser APIs or event handlers.
- **`'use client'`** is the first line of the file, before any imports. Put it only on the components that need it, and keep client components as small leaf components. A server component may render a client component, but never the other way round.
- **Pages and layouts are async server components** that load data and pass it down as props. The data-loading part of `page.tsx` and `layout.tsx` belongs to the backend layer (`backend/backend-rules.md`). The UI layer owns the components those files render.

## 2. Data flow from page to UI

```
page.tsx (server)            → fetches with getClient().query(...), guards error and missing data,
                               flattens CMS nodes, applies '' and enum fallbacks
  └─ <FeatureName>Content    → receives typed props (a generated <Operation>Query type or a Type* shape)
       ├─ <Thing>Entry        → one item of a list, built with .map in the parent
       └─ Shared<Thing>       → reusable building block from shared_components/
```

- **One body component per page.** Each page renders a single `<FeatureName>Content` component, which contains the page's `<main>`.
- **Props types.** Content components are typed with the generated query type (for example `servicesPageData: GetServicesPageQuery`) when they receive the raw query result. When they receive flattened fields, they use a `Type*` shape from `app/SharedTypes.ts`.
- **CMS HTML** (`content`, `description`) is rendered with `parse(...)` from `html-react-parser`. Never use `dangerouslySetInnerHTML`.
- **No fetching in UI components.** They must not call `getClient()`, `fetch` the CMS or define GraphQL documents. They receive data as props. Ask the backend-developer for any data you are missing.

## 3. Root layout and shared chrome

- `app/layout.tsx` imports `globals.css` and `reset.css`, fetches shared data (menus, footer links) and renders `<html lang='en'><body><ApolloWrapper>{header}{children}{footer}</ApolloWrapper></body></html>`.
- The header and footer are feature components in `app/components/header/` and `app/components/footer/`, typed with the generated query types of the layout's queries.
- The page grid (header, main, footer) is defined in `reset.css` through `grid-template-areas`. Feature components put their content in a `<main>` element.

## 4. Navigation and media

- **Internal links** use `Link` from `next/link`.
- **External links** use `target='_blank'` with `rel='noopener noreferrer'`.
- **Route links** come from page link objects in `app/utils/constants.tsx` (`CONTACT_US_PAGE.link`, `CONTACT_US_PAGE.title`), never from hard-coded strings.
- **Images** use `Image` from `next/image`, always with `width`, `height` and a meaningful `alt`. Images above the fold get `preload` (or `loading='eager'`). Logos and fixed images come from image objects in `constants.tsx` (`LOGO_IMAGE.url`, `LOGO_IMAGE.alt`).
- **Back links** on interior pages use the same pattern as the other pages: `<Link href='/'>{'Return to Home >'}</Link>`.

## 5. State management

- **Local state only:** `useState` for UI state and `useEffect` for timers and subscriptions.
- **Effects** list complete dependency arrays and return a cleanup function (`clearInterval`, removing listeners).
- **Derive, don't store.** Compute values during render (filtered lists, class names, labels) instead of keeping them in state.
- **No server data in client state.** Server data stays in props, or in the Apollo cache when a client component queries.
- **No global state libraries.** If state must be shared across distant components, propose a plan before adding React Context.

## 6. Forms

- **Shared styles:** build forms with the classes in `app/globalFormStyles.module.css` (`formClasses`).
- **Field state** is a single `Record<string, {value: string, validationMessage: string, edited: boolean}>` held in one `useState`.
- **Handlers:**
  - `handleFieldChange(field, value)` updates the value and clears its message.
  - `validateField(field, value)` runs on blur and sets `edited: true` with a message.
  - `handleFormSubmission` validates every field first, then submits.
  - `clearFields` resets the form after success.
- **Messages:**
  - Each field's message renders in a `<p className={formClasses.formFieldErrorMessage}>` under the field.
  - A form-level error renders under the submit button.
  - A success message shows when a `show<Something>Message` boolean is set.
- **Submission:** the `onSubmit` handler calls `e.preventDefault()` and then the submission handler. Requests that need a secret go through a server action or route handler owned by the backend layer. Never call them from the client.

## 7. Accessibility and semantics

- Use semantic elements: `<header>`, `<main>`, `<footer>`, `<section>`, `<ul>`/`<li>` for lists, `<h1>` once per page.
- Every interactive element is a `<button>` (with `type`) or a `Link`. Never put a `Link` inside a `<button>` or a `<button>` inside a `Link`. Style the link instead.
- Do not put click handlers on non-interactive elements without keyboard support.
- Inputs have `name`, `autoComplete` and an accessible label or placeholder.
