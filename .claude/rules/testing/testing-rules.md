---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "e2e/**"
  - "jest.config.*"
  - "jest.setup.*"
  - "playwright.config.*"
---

# Testing Rules

These extend `.claude/rules/general-rules.md`. Test code follows the same formatting, naming, import and one-line-comment rules as application code.

## 1. Tools

| Level | Tool | Runs with |
|---|---|---|
| Unit tests (utilities, pure logic) | **Jest** | `yarn jest` |
| Component tests | **Jest** with **React Testing Library** | `yarn jest` |
| End-to-end tests | **Playwright** | `yarn playwright test` |

- `jest` is installed.
- Before component and end-to-end tests can run, these packages need user approval and installation (general-rules section 4):
  - `@testing-library/react` and `@testing-library/dom`
  - `jest-environment-jsdom`
  - `@testing-library/jest-dom`
  - `@testing-library/user-event`
  - `@types/jest`
  - `ts-node` (for a TypeScript Jest config)
  - `@playwright/test`
- Do not use other test runners, assertion libraries or mocking libraries (Vitest, Mocha, Cypress, Enzyme, MSW) without approval.

## 2. Configuration

- **`jest.config.ts`** at the root uses `next/jest` (`nextJest({dir: './'})`). It sets:
  - `testEnvironment: 'jsdom'`
  - `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']`, where `jest.setup.ts` imports `@testing-library/jest-dom`
  - `moduleNameMapper: {'^@/(.*)$': '<rootDir>/$1'}` to match the `@/*` alias
  - `testPathIgnorePatterns` that exclude `/e2e/`, `/.next/` and `/node_modules/`
  - coverage settings from `test-coverage-rules.md`
- **`playwright.config.ts`** at the root sets:
  - `testDir: './e2e'`
  - a `webServer` that runs the app (`yarn build && yarn start`, or `yarn dev` locally)
  - `baseURL`
  - two projects: desktop, and a mobile viewport narrower than the 850px breakpoint (for example 390px wide)
- **`package.json` scripts** (`"test": "jest"`, `"test:e2e": "playwright test"`) are added only with user approval.

## 3. File placement and naming

- **Unit tests** sit next to the file under test: `app/utils/dateHandler.test.ts`.
- **Component tests** sit next to the component: `app/components/services_content/service_entry/ServiceEntry.test.tsx`.
- **End-to-end tests** go in `e2e/<flow-name>.spec.ts`, in kebab-case: `e2e/navigation-menu.spec.ts`, `e2e/contact-form.spec.ts`.
- **Fixtures:**
  - Typed fixtures live inside the test file, typed with generated `<Operation>Query` types or `Type*` shapes, so they stay in step with the schema.
  - Fixtures reused by several test files go in a snake_case `test_fixtures/` folder next to the tests (`test_fixtures/serviceEntryFixture.ts`).

## 4. Writing tests

- **Structure:** `describe('<ComponentOrFunctionName>', ...)`, with `it('<does something> when <condition>', ...)` sentences that describe behavior. Each test follows Arrange, Act, Assert, with one blank line between the steps.
- **Test behavior, not implementation.** Assert what the user sees or what a function returns. Do not assert on internal state, class names or call order unless that is the behavior.
- **Query priority (React Testing Library):**
  1. `getByRole`
  2. `getByLabelText`
  3. `getByPlaceholderText`
  4. `getByText`
  5. `getByTestId`, only as a last resort
- **Interactions** use `@testing-library/user-event` (`await userEvent.click(...)`) rather than `fireEvent`.
- **Server components and pages** are not rendered in Jest. Test the `*Content`, `*Entry` and `Shared*` components with typed fixture props, and cover pages with Playwright.
- **Mocks:**
  - Mock only at module boundaries (`jest.mock('next/navigation')`, global `fetch` for submissions).
  - Never mock the component under test or the utilities it relies on.
  - Reset mocks between tests.
- **Timers:** use `jest.useFakeTimers()` for intervals and timeouts (carousels, auto-advance), and restore real timers afterward.
- **CMS HTML props** in fixtures use small, realistic HTML strings.
- **No broad snapshot tests.** Assert specific output instead.
- **Helper functions** in test files get the one-line purpose comment like any other function.

## 5. End-to-end rules

- **Locators:** use `page.getByRole(...)` or `page.getByLabel(...)`. CSS-class selectors are not allowed.
- **No fixed waits** (`waitForTimeout`). Rely on Playwright's auto-waiting `expect` assertions.
- **No real third-party submissions.** Never submit real data to a third party or to the production CMS. Intercept those requests with `page.route(...)` and assert on the request payload.
- **Breakpoint coverage.** Run responsive behavior (for example the mobile navigation menu) under the mobile project at the 850px breakpoint.
- **Independent tests.** Each test can run on its own and in any order.

## 6. Reporting

Use the general-rules reporting format. Under "Verification", list each test command you ran with its pass and fail counts, and any skipped test with the reason.
