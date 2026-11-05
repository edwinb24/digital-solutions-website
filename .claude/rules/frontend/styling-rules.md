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
- **No inline styles:** no `style={{...}}` and no JavaScript style objects.

## 2. Stylesheet locations

| File | Purpose | Imported as |
|---|---|---|
| `app/globals.css` | `:root` custom properties (colors, fonts), `@font-face`, base element colors | `import './globals.css'` in `layout.tsx` |
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

.serviceEntry > li,
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
- Use child (`>`) and descendant selectors on module classes. No ID selectors, no `!important` and no native CSS nesting.
- Global stylesheets group their rules under `/* Section Name */` headings.
