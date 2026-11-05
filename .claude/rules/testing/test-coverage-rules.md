---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "e2e/**"
  - "jest.config.*"
---

# Testing Rules: Coverage

These extend `.claude/rules/general-rules.md` and `testing-rules.md`.

## 1. What must be tested

| Code | Required tests |
|---|---|
| Every function in `app/utils/*Handler.ts` | Unit tests for every branch, including invalid and empty input (for example an invalid date string) |
| Every component in `app/components/shared_components/` | Component tests for rendering, every prop variation, and every interaction (click, swipe, keyboard) |
| Every client component with state or interaction | Component tests for each state change the user can trigger |
| Every `*Content` and `*Entry` component | Component tests for the data-driven branches: empty list message, hidden, draft and published statuses, missing optional fields, rendered CMS HTML |
| Every form | Component tests for field validation (required, format), the error message after a failed submit, the success message and field clearing after a successful submit, and the error path when the request fails |
| Every route | A Playwright smoke test: the page loads, the main `<h1>` is visible, and there is no error fallback paragraph |
| Main user flows | Playwright tests for navigation (desktop menu and the mobile menu at 850px or narrower) and each form submission (with the request intercepted) |
| Every bug fix | A regression test that fails before the fix and passes after |

## 2. Coverage thresholds (Jest)

Set these in `jest.config.ts` with `coverageThreshold`:

| Scope | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| Global | 80% | 80% | 80% | 80% |
| `./app/utils/` | 95% | 95% | 100% | 95% |

- **Collect coverage from** `app/**/*.{ts,tsx}`, excluding:
  - `*.generated.ts`
  - `types/__generated__/`
  - `app/components/lib/`
  - `page.tsx` and `layout.tsx` files (Playwright covers them)
  - `*.test.*` files
- **Don't lower thresholds.** Never lower a threshold or widen the exclusions to make a run pass. Report the gap instead.
- **Output:** coverage goes to `/coverage`, which is git-ignored.

## 3. Quality over percentage

- Coverage counts only when the assertions are meaningful. A test that renders without asserting anything does not count toward the requirements in section 1.
- The code-reviewer checks that new or changed code comes with the tests this table requires.
