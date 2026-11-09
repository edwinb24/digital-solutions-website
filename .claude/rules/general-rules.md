# General Rules

These are the shared standards for all code in this project. They apply to the main agent and to every subagent. The domain rule folders (`frontend/`, `backend/`, `database/`, `testing/`) add rules for their own area. They never replace these.

## 1. Precedence

1. The user's explicit instructions in the current conversation.
2. This file, for anything shared: formatting, naming, structure, TypeScript, comments, error handling, libraries.
3. The domain rule files for your area.
4. If a rule is silent, follow the closest existing pattern in this repository and the examples in these rule files. Do not invent a new pattern.

If two rules contradict each other, stop and report the conflict instead of picking one.

Some existing files came from `create-next-app` and do not follow these standards yet (double quotes, semicolons, 2-space indentation). Any file you create must comply. If you modify an existing file, bring the whole file into compliance.

## 2. Tech stack

- Next.js (App Router), React 19 and TypeScript in `strict` mode.
- Content comes from a headless WordPress CMS through WPGraphQL. The client is Apollo Client.
- GraphQL Codegen generates types next to each query (near-operation-file).
- Styling uses plain CSS: CSS Modules plus a few global stylesheets.
- The package manager is Yarn (classic). Never use npm, pnpm or bun to install or remove packages; they create competing lockfiles. The only lockfile is `yarn.lock`.

Common commands:

| Task | Command |
|---|---|
| Dev server | `yarn dev` |
| Standalone production build (needs user approval) | `yarn build:standalone` |
| Run the standalone build | `yarn production:run` |
| Lint | `yarn lint` |
| Type check | `yarn tsc --noEmit` |
| Unit and component tests | `yarn jest` |
| End-to-end tests | `yarn playwright test` |
| Regenerate GraphQL types | `yarn codegen` (once Codegen is set up, see `backend/api-rules.md`) |

## 3. Approved libraries

Only these libraries may be used. Some are not installed yet.

| Library | Purpose | Notes |
|---|---|---|
| `next` | Framework | |
| `react`, `react-dom` | UI runtime | |
| `@apollo/client` | GraphQL client, `gql`, `TypedDocumentNode` | |
| `@apollo/client-integration-nextjs` | Apollo with the App Router (`registerApolloClient`, `ApolloNextAppProvider`) | |
| `graphql` | GraphQL runtime | Required by Apollo |
| `rxjs` | Apollo Client 4 peer dependency | Never import it directly |
| `html-react-parser` | Renders HTML from the CMS | See `backend/security-rules.md` |
| `@mui/icons-material` | Icons only | Never used for styling or layout |
| `@mui/material` | Only `@mui/material/SvgIcon`, to build custom icons | No other `@mui/material` component may be imported |
| `@emotion/react`, `@emotion/styled` | Peer dependencies of MUI icons | Never import them directly or use them for styling |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Types | |
| `eslint`, `eslint-config-next` | Linting (flat config in `eslint.config.mjs`) | |
| `@eslint/eslintrc` | Legacy ESLint compat layer | Only if a `FlatCompat` config is ever needed |
| `@graphql-codegen/cli`, `@graphql-codegen/client-preset`, `@graphql-codegen/near-operation-file-preset`, `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations` | Type generation from the WPGraphQL schema | |
| `jest` | Unit and component tests | Installed |
| `@testing-library/react` (and its peer `@testing-library/dom`) | React Testing Library, for component tests | |
| `@playwright/test` | End-to-end tests | |

These are not on the list but are expected to be requested later for testing: `jest-environment-jsdom`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@types/jest` and `ts-node`. Each still goes through the package policy in section 4.

**Not allowed:** UI component or styling libraries and frameworks (Material UI components, Bootstrap, Tailwind, Chakra, styled-components, Emotion as a styling tool, Sass, CSS-in-JS of any kind), global state libraries, and alternative data clients.

## 4. Package policy

- **Approval:** installing any package directly needs explicit approval from the user first. This includes packages on the approved list. The only exception is a package that arrives automatically as a dependency of another package.
- **Evaluate first:** before recommending or installing any new npm package, evaluate its adoption, maintenance (recent releases, open issues), reliability, security (known advisories) and compatibility (React 19, the installed Next.js version, TypeScript, server versus client components).
- **Downloads:** only suggest libraries with **10,000+ weekly downloads**. If no library meets these requirements, ask the user for suggestions instead of guessing.
- **Proposals:** give the package name, version, weekly downloads, last publish date, license, why it is needed and the alternatives you considered. Install only after approval, with `yarn add <package>` or `yarn add --dev <package>`.
- **Don't edit by hand:** never edit `package.json` dependency fields or `yarn.lock` directly.

## 5. Formatting

These match the following Prettier options. Prettier is not installed, so apply them by hand: `tabWidth: 4`, `semi: false`, `singleQuote: true`, `jsxSingleQuote: true`, `bracketSpacing: false`, `trailingComma: 'all'`, `arrowParens: 'avoid'`, `printWidth: 80`, `bracketSameLine: false`.

- **Indentation:** 4 spaces. Never tabs.
- **Semicolons:** none at the end of statements in `.ts`, `.tsx`, `.js` and `.mjs` files. CSS keeps its semicolons.
- **Quotes:** single quotes for strings and for JSX attributes (`lang='en'`, `type='submit'`). Use double quotes only when the string contains an apostrophe: `{"We'll reply soon."}`. Use template literals only for interpolation.
- **Braces:** no spaces inside object or import braces: `import {useState} from 'react'`, `{id: SERVICES_PAGE_ID}`, `const {data, error} = ...`.
- **Trailing commas** on every multi-line object, array, parameter list, argument list, import and type literal.
- **Arrow functions:** no parentheses around a single untyped parameter (`service => service.id`). Typed or multiple parameters need them: `(field: string, value: string) =>`.
- **Line length:** 80 characters. When a line is too long, put one argument, property or JSX attribute per line, with the closing bracket on its own line.
- **Ternaries:** break nested ternaries one condition per line, each level indented under the last.
- **`if` statements:**
  - A one-statement guard may skip braces when it fits on one line: `if (error) return <p>...</p>`.
  - Any body that spans lines uses braces. `else` and `else if` go on the same line as the closing brace: `} else if (...) {`.
- **Blank lines:**
  - One blank line after the imports.
  - One between top-level declarations.
  - One between logical groups inside a function (state hooks, handlers, derived values, return).
  - Never two in a row.
- **JSX:**
  - Wrap multi-line JSX in parentheses.
  - HTML elements with no children are written open-and-close: `<div className={classes.divider}></div>`.
  - React components with no children self-close: `<ServiceCard ... />`.
  - Text with special characters goes in an expression: `{'Back to Home >'}`.
- **End of file:** every file ends with exactly one newline.

## 6. Naming

Use long, descriptive, multi-word names that say what a value holds or what a function does. Do not abbreviate: write `index`, not `ind` or `i`; `service`, not `s` or `a`. Name callback parameters after the item (`services.map(service => ...)`). The only short names allowed are `e` for DOM event parameters and caught errors, and `_` for unused names.

**Unused names are just `_`.** A parameter or variable that is never used (one that would otherwise start with `_`) is named `_` alone, not `_time` or `_event`: write `test(_: number)`, not `test(_time: number)`.

**No abbreviations in names.** This applies to every kind of name in the table below: variables, functions, parameters, props, types, constants, enums, CSS classes, files and folders.

- **A name is never an abbreviation.** Do not write `ctx`, `dt`, `idx`, `btn`, `img`, `msg`, `el`, `res` or `cfg`.
- **A name never mixes a whole word with an abbreviation.** Do not write `deltaMs`, `navBtn`, `prevIndex`, `errorMsg` or `imgUrl`. Spell every part out.

| Instead of | Write |
|---|---|
| `ctx` | `canvasDrawingContext` |
| `dt` | `secondsSinceLastDrawnFrame` |
| `deltaMs` | `timeSincePreviousFrame` |

Two kinds of name are exempt:

- **Widely recognised acronyms** used as words: `URL`, `ID`, `CMS`, `API`, `HTML`, `CSS`, `SEO` (`SERVER_URL`, `SERVICES_PAGE_ID`).
- **Names fixed by a framework, library or the CMS schema**, which you cannot rename: `props`, `params`, `searchParams`, `href`, `src`, `alt`, `__typename`, ACF field names.

| Item | Convention | Example |
|---|---|---|
| Route folders | kebab-case | `app/contact-us/`, `app/our-services/` |
| Dynamic route segments | camelCase in brackets | `app/services/[serviceName]/` |
| Feature and component folders | snake_case | `app/components/services_content/`, `service_entry/` |
| Component files | PascalCase, matching the component name | `ServiceEntry.tsx` |
| Component CSS | Same name as the component plus `.module.css` | `ServiceEntry.module.css` |
| Shared stylesheets | camelCase plus `.module.css` | `sharedStyles.module.css`, `globalFormStyles.module.css` |
| Utility files | camelCase, named after the domain | `dateHandler.ts`, `stringHandler.ts` |
| Custom icon files | camelCase plus `Icon` | `utils/icons/tiktokIcon.tsx` |
| GraphQL query files | `useGet<Thing>Query.ts` | `useGetServiceListQuery.ts` |
| Components | PascalCase, with a role suffix or prefix (see `frontend/component-rules.md`) | `ServicesContent`, `ServiceEntry`, `SharedModal` |
| Variables and functions | camelCase, descriptive | `filteredServiceEntries`, `normalizedServiceName` |
| Event handlers | `handle<Action>` | `handleFormSubmission`, `handleFieldChange` |
| Toggles, validators, resets | `toggle<Thing>`, `validate<Thing>`, `clear<Thing>` | `toggleNavigationMenu`, `validateField`, `clearFields` |
| Boolean state | Describes the state | `navigationMenuOpen`, `showSuccessMessage`, `descriptionExpanded` |
| State setters | `set<StateName>` | `setNavigationMenuOpen` |
| Callback props | Verb phrase, or `on<Event>` | `closeModal`, `nextSlide`, `onSlideSelect` |
| Constants | UPPER_SNAKE_CASE with meaningful suffixes | `SERVER_URL`, `SERVICES_PAGE_ID`, `CONTACT_US_PAGE`, `LOGO_IMAGE`, `CARD_ICON_SIZE` |
| Enums | UPPER_SNAKE_CASE name; quoted lowercase string members | `enum SERVICE_STATUS {'published' = 'published'}` |
| Shared domain types | PascalCase with a `Type` prefix | `TypeServiceEntry`, `TypeServiceContent` |
| Component-local types | PascalCase, descriptive, no prefix | `ContactFormInput`, `SliderImage` |
| CSS classes | camelCase, starting with the component or feature context | `.serviceEntry`, `.serviceEntryTitle` |
| CSS custom properties | kebab-case | `--main-color`, `--color-primary-lighter` |

Spell names correctly. Fix a misspelled identifier when you touch its file.

## 7. Project structure and shared locations

The `@/*` alias points to the project root, so app code is imported as `@/app/...`.

```
app/
├── layout.tsx                      # Root layout: fetches shared data, ApolloWrapper, header, footer
├── page.tsx                        # Home route
├── <route-name>/page.tsx           # One folder per route (kebab-case)
├── globals.css                     # :root CSS variables, @font-face, base element styles
├── reset.css                       # CSS reset
├── sharedStyles.module.css         # Shared layout classes (page wrappers, titles)
├── globalFormStyles.module.css     # Shared form classes
├── SharedTypes.ts                  # Shared domain types (Type* prefix)
├── components/
│   ├── lib/                        # Apollo setup: ApolloClient.ts (server), ApolloWrapper.tsx (client)
│   ├── shared_components/          # Reusable building blocks: <thing_name>/Shared<Thing>.tsx
│   └── <feature_name>/             # One folder per feature or page section
│       ├── <FeatureName>.tsx
│       ├── <FeatureName>.module.css
│       ├── graphql/
│       │   ├── useGet<Thing>Query.ts
│       │   └── useGet<Thing>Query.generated.ts   # Generated, never edit
│       └── <sub_component_name>/<SubComponentName>.tsx (+ .module.css)
└── utils/
    ├── constants.tsx               # All constants, enums, CMS IDs, page link objects, icon maps
    ├── privateConstants.ts         # Server-only values read from process.env (never hard-coded)
    ├── <domain>Handler.ts          # Pure helpers (dateHandler.ts, ...)
    └── icons/<name>Icon.tsx        # Custom SVG icons not in @mui/icons-material
types/__generated__/graphql.ts      # Base schema types generated by Codegen
e2e/<flow-name>.spec.ts             # Playwright tests
```

- **Shared types** go in `app/SharedTypes.ts`. Types used by only one component are exported from that component's file. Types generated from GraphQL come from the `.generated.ts` file next to the query, never redeclared by hand.
- **Constants:** every constant goes in `app/utils/constants.tsx`. The file is `.tsx` because it holds icon maps. This includes CMS IDs, URLs, page link objects shaped `{id, link, title, __typename}`, image objects shaped `{alt, url}`, enums, icon maps (`new Map([[ENUM.value, <Icon key={...} />]])`) and numeric sizes. Never inline a magic value in a component.
- **Utility functions** go in `app/utils/<domain>Handler.ts`. They are pure functions exported as named arrow-function `const`s, with explicit parameter and return types.
- **Imports:**
  - Import from the same folder or a child folder with a relative path (`./ServiceEntry.module.css`, `./graphql/...`).
  - Everything else uses the `@/app/...` alias. Never use `../`.
  - Sort imports alphabetically by module path, ignoring case: `@/` aliases first, then packages, then `./` relative imports.
  - Sort the names inside braces alphabetically, ignoring case.
  - Use `import type {...}` for type-only imports.
  - CSS Modules are imported as `classes` (the component's own), `sharedClasses` (`sharedStyles.module.css`) and `formClasses` (`globalFormStyles.module.css`).
- **Exports:**
  - Components use `export default function`, one component per file.
  - Constants, utilities, query documents and types use named exports.
  - `ApolloWrapper` and `getClient` are named exports.

## 8. TypeScript

- Strict mode. No `any`; use `unknown` and narrow it.
- Write arrays as `Array<T>`, not `T[]`. Write object maps as `Record<string, T>`.
- Use `type` aliases by default. Use `interface` only for a type that another type extends (`interface TypeServiceEntry extends TypeServiceContent`).
- Model status-like values as string enums in `constants.tsx`. Compare against enum members, never raw strings. When CMS data is cast to an enum, give it a fallback: `(serviceStatus as SERVICE_STATUS) || SERVICE_STATUS.hidden`.
- Nullable CMS fields:
  - Use optional chaining with `|| ''` (or `|| []`) fallbacks before passing values as props.
  - Use non-null assertions (`!`) only right after a filter or guard that guarantees the value.
- Annotate utility functions' parameters and return types. Components and handlers rely on inference, except for event types.

## 9. Functions and comments

- **Every named function gets a one-line comment** directly above it saying what it is trying to achieve: its purpose, not its implementation. This covers components, handlers, toggles, utilities, hooks and test helpers. Anonymous inline callbacks (`.map(...)`, `onClick={() => ...}`) are exempt.

  ```tsx
  // Formats a CMS ISO date into a long, readable US date with time
  export const normalizeDate = (dateString: string): string => {
  ```

- **Comment style:** `// ` followed by a sentence-case phrase.
- **No other comments.** The one-line function comment is the only comment you may add on your own. This rule applies to the main agent and to every subagent. Do not add step labels inside functions, explanatory notes, `// NOTE - ...` or `// TODO - ...` tags, JSDoc blocks or commented-out code.
- **Exceptions need the main agent's decision.** If you believe another comment is truly necessary (for example, a non-obvious workaround that would otherwise be "fixed" back into a bug), do not add it yourself:
  - **Subagents:** list it under `## Comment requests` in your report (section 12), with the file and line, the exact comment text and why it is needed. The main agent makes the final decision and adds the approved comments.
  - **Main agent:** decide each request. Record every comment request, whether approved or rejected and whether it came from you or from a subagent, with its file and line. When the user's prompt has finished processing, include the full list in the final reply, under a **Comment exceptions** heading.
- **CSS:** global stylesheets use `/* Section Name */` headings. These are the only CSS comments allowed.

## 10. Error handling and logging

- Guard first and return early. Check `error` and missing data before using them.
- Server-rendered sections fail soft with a short fallback paragraph. They never throw for missing CMS content:
  - Request error: `if (error) return <p>Error Loading this Element</p>`
  - Missing data: `return <p>Element Failed to Load</p>`
- Wrap every `fetch` or other async call that can reject in `try/catch`. Narrow the caught value (`typeof e === 'string'`, `e instanceof Error`), show the user a message through state, and log it with `console.error(e)`.
- **No `finally` blocks when avoidable.** Put the code that would go in `finally` directly after the `try/catch`. Use `finally` only when the `try` or `catch` returns or rethrows, so code placed after the block would not run.

  ```tsx
  try {
      await submitContactForm(formValues)
      setShowSuccessMessage(true)
  } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message)
      console.error(e)
  }
  setFormSubmitting(false)
  ```
- `console.error` is the only console method allowed in committed code. No `console.log`.
- No logging or error-tracking libraries without approval.

## 11. Generated and protected files

- Never hand-edit `*.generated.ts` or anything under `types/__generated__/`. Change the query, then regenerate with `yarn codegen`.
- Never edit `yarn.lock`, `.env*` files or anything in `node_modules/`.

## 12. Reporting format (all implementation agents)

End every task with this report:

```
## Summary
One or two sentences on what was done.

## Files changed
- `path/to/File.tsx`: created / modified (one-line purpose)

## Standards applied
- Rule files followed; any deviation and the reason for it.

## Verification
- `yarn lint`: pass / fail (with output on failure)
- `yarn tsc --noEmit`: pass / fail
- Tests run, if any, and their results.

## Follow-ups
- Work for other agents (for example "backend-developer: add `shortDescription` to GetServiceList").
- Approvals needed (packages, CMS changes).

## Comment requests
- `path/to/File.tsx:42`: `// Exact comment text`: why it is necessary (or "None").
```

Never report a check as passing unless you ran it.
