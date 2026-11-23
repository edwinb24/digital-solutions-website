---
paths:
  - "app/**/*.css"
  - "app/**/*.tsx"
---

# Frontend Rules: Styling

These extend `.claude/rules/general-rules.md`. The 4-space indentation and single quotes also apply to CSS.

## 1. Plain CSS only

- **Allowed:** plain CSS, CSS Modules for components, and the global stylesheets listed below.
- **Not allowed:** any front-end styling library or framework. That includes Material UI styling (`sx`, `styled`, `makeStyles`, theme providers), Bootstrap, Tailwind, Sass/SCSS, styled-components, Emotion and other CSS-in-JS. MUI is allowed **only** for icons (see `component-rules.md` section 7).
- **No inline styles:** no `style={{...}}` and no JavaScript style objects. The only exception is `app/global-error.tsx`, should it ever exist: it replaces the root layout, so `globals.css` isn't loaded there, and `yarn lint` allows inline `style` in that one file.

## 2. Stylesheet locations

| File | Purpose | Imported as |
|---|---|---|
| `app/globals.css` | `:root` custom properties (colors, and `--style-font-family` mapped from the `next/font` variable), base element colors | `import './globals.css'` in `layout.tsx` |
| `app/reset.css` | Reset rules and the body grid (`header` / `main` / `footer` areas) | `import './reset.css'` in `layout.tsx` |
| `app/sharedStyles.module.css` | Layout classes shared across pages (`pageNarrowWrapper`, `pageWideWrapper`, `mainTitle`) | `sharedClasses` |
| `app/globalFormStyles.module.css` | Form classes (`form`, `formField`, `formFieldErrorMessage`, `submitButton`) | `formClasses` |
| `<Component>.module.css` | Styles for one component (or one family of components), next to its `.tsx` | `classes` |

- Before writing a new class, check whether `sharedStyles.module.css` or `globalFormStyles.module.css` already has it.
- A pattern repeated across two or more components moves to the shared modules.

## 3. Naming

- **Class names:** camelCase, starting with the component or feature context, and descriptive: `.serviceEntry`, `.serviceEntryTitle`, `.serviceExpandButton`. State modifiers describe the state: `.navigationMenuOpen`, `.serviceAvailable`.
- **Custom properties:** kebab-case, defined only in `:root` in `globals.css`: `--main-color`, `--main-alternative-color`, `--secondary-color`, `--color-primary-lighter`, `--color-tertiary`, `--font-color`, `--style-font-family`.

## 4. Values

- **Colors and fonts** always come from custom properties: `color: var(--font-color)`. Do not write raw hex values in component modules. Add a variable to `globals.css` instead.
- **Color variants** are derived from base variables with relative color syntax or `color-mix()`:

  ```css
  --color-primary-lighter: hsl(from var(--main-color) h s calc(l + 8));
  background-color: color-mix(in srgb, var(--main-color) 98%, white 2%);
  ```

- **Units:** every non-zero length has a unit (`px`, `rem`, `em`, `%`, `vw`, `vh`). Unitless lengths such as `padding: 10;` are invalid CSS and are not allowed. Only `0` may be unitless.
- **Fluid sizing:** use `min()`, `max()` and `calc()`, for example `width: min(100vw, 1200px)` and `font-size: calc(14px + (18 - 14) * ((100vw - 600px) / (1600 - 600)))`.
- **No oversized "magic maximum" lengths.** Never write `border-radius: 999px` (or `9999px`, `100vmax` and the like) to get fully rounded corners. When the goal is simply "as much as possible", use a percentage, which says what it means: `border-radius: 100%` instead of `border-radius: 999px`. The two aren't identical, but both give fully rounded corners, and `100%` is far easier to read.
- **Spacing:** when the sides differ, write each side as a longhand property (`padding-top`, `padding-left`, `margin-left: auto`, `margin-right: auto`). Use a shorthand only when all sides are equal.
- **Hex colors** (only in `globals.css`) are lowercase.
- **Strings** in CSS use single quotes: `font-family: 'Display Font'`, `grid-template-areas: 'header' 'main' 'footer'`.

## 5. Layout

- Use Flexbox (`display: flex`, `flex-flow`, `gap`) and CSS Grid (`grid-template-areas` with named areas) for layout. Do not use `float`.
- Page content goes inside `sharedClasses.pageNarrowWrapper` (text pages) or `sharedClasses.pageWideWrapper` (wide layouts).
- Use `box-sizing: border-box` on sized wrappers.

## 6. Responsive design: one breakpoint

- **The only media query allowed** is:

  ```css
  @media only screen and (max-width: 850px) {
  }
  ```

- **Desktop first.** Base rules describe desktop, and the media block overrides them for screens 850px wide and smaller.
- **One block per file,** placed at the end of the file, after all base rules.
- **No other breakpoints:** no `min-width` queries, other widths or container queries. Make layouts fluid between sizes with `min()`, `calc()`, `flex-wrap` and `gap`.

## 7. Formatting

```css
/* Section Name */
.serviceEntry {
    display: grid;
    grid-template-areas:
        'serviceTitle serviceImage'
        'serviceDetails serviceImage';
    gap: 20px;
    color: var(--font-color);
}

.serviceEntryItem,
.serviceEntryLink:hover {
    color: var(--secondary-color);
}

@media only screen and (max-width: 850px) {
    .serviceEntry {
        grid-template-areas:
            'serviceTitle'
            'serviceImage'
            'serviceDetails';
    }
}
```

- 4-space indentation, one declaration per line, a space after `:` and a semicolon after every declaration.
- One blank line between rule blocks. When a rule has several selectors, put each on its own line.
- Multi-value properties (`grid-template-areas`, multi-source `src`) put each value on its own indented line.
- No ID selectors, no `!important` and no native CSS nesting.
- Global stylesheets group their rules under `/* Section Name */` headings.

### Selectors: one class per element, no combinators

- **Strongly avoid the child (`>`) and adjacent-sibling (`+`) combinators.** Give each element you style its own class instead, with a compound name built from its parent's class: `.siteFooterLinks` → `.siteFooterLinksItem`. Each rule then reads on its own, survives markup changes, and keeps every selector at the same specificity.
- **Positional styles become a class the component sets.** Where a selector would pick elements by position (`li + li`, `:first-child`), add a class in the JSX when rendering the list (for example from the `map` index) and style that class.
- Before writing `>` or `+`, try a class. Use one only when no class can do the job, and say why in the reply.
- **Exception: list items.** `>` may select the items of a list (`ul > li`, `ol > li`), with the class on the list: `.siteFooterLinks > li`. The `+` combinator has no exception.
- **Exception: the page grid.** In the global reset stylesheet (`app/reset.css`), `>` may select the `header`, `main` and `footer` elements directly under `body` to place them in the body grid: `body > main { grid-area: main; }`.

Instead of:

```css
.siteFooterLinks > li + li {
    margin-left: 12px;
}
```

Write:

```css
.siteFooterLinksItemSeparated {
    margin-left: 12px;
}
```

### Content belongs in the markup

- **Put text, icons, arrows and separators in the JSX, not in the CSS `content` property.** Content in the page is read by screen readers, search engines, translation tools and copy-and-paste, and lives next to the rest of the component's text. Hide a purely decorative character from screen readers with `aria-hidden='true'`.
- Before writing `content`, try the markup. Use it only when markup can't do the job, say why in the reply, and give a decorative value empty alternative text: `content: '→' / '';`.

Instead of:

```css
.serviceEntryLink::after {
    content: ' →';
}
```

Write:

```tsx
<Link className={classes.serviceEntryLink} href={serviceLink}>
    {'Learn more '}
    <span aria-hidden='true'>{'→'}</span>
</Link>
```

## 8. Fonts

- Fonts load **only** with `next/font` in `app/layout.tsx`, which self-hosts the files and avoids layout shift.
- Each font sets `display: 'swap'` and a CSS variable, for example `variable: '--manrope-font'`. Put the font's `variable` class on `<html>`.
- `globals.css` maps that variable to the font custom property: `--style-font-family: var(--manrope-font), sans-serif;`. Components use `var(--style-font-family)`, never the font variable directly.
- Never use a hand-written `@font-face`, a Google Fonts `<link>` or a CSS `@import` for fonts. A font that isn't on Google Fonts loads with `next/font/local` from a file in the repo, never from a remote URL.
- Every font sets `subsets: ['latin']`. A variable font omits `weight`; a static font lists each weight it needs.
- Load each font once, in `layout.tsx`. Add another font only when the design needs it, because each one is another download.
- Source: Next.js docs, Font Optimization (`https://nextjs.org/docs/app/getting-started/fonts`) and Font Module (`https://nextjs.org/docs/app/api-reference/components/font`).
