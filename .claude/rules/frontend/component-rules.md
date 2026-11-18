---
paths:
  - "app/**/*.tsx"
---

# Frontend Rules: Components

These extend `.claude/rules/general-rules.md` (formatting, naming, comments) and `frontend-rules.md` (architecture).

## 1. Component roles and placement

| Role | Name pattern | Location |
|---|---|---|
| Page body | `<FeatureName>Content` or `<FeatureName>PageContent` | `app/components/<feature_name>/` |
| List item | `<Thing>Entry` | `app/components/<feature_name>/<thing>_entry/` |
| Feature-specific child | Descriptive PascalCase (`NavigationMenu`, `HamburgerMenu`) | A snake_case subfolder of the feature |
| Reusable building block | `Shared<Thing>` (`SharedModal`, `SharedCarouselSlider`) | `app/components/shared_components/<thing_name>/` |
| Custom icon | `<Name>Icon` | `app/utils/icons/<name>Icon.tsx` |

- A component used by two or more features moves to `shared_components/` and gets the `Shared` prefix.
- A component made of several parts keeps its parts together in one folder with a shared stylesheet (for example `SharedCarouselSlider`, `SharedCarouselControls` and `SharedCarouselDots` with `SharedCarousel.module.css`).

## 2. File layout

Put the pieces of a component file in this order:

1. `'use client'`, only when needed.
2. Imports, sorted as described in general-rules section 7.
3. Local exported types used by the component's props or by its children.
4. A one-line purpose comment, then `export default function ComponentName(...)`.

Component files never declare module-level constants. Every constant goes in `app/utils/constants.tsx`, even one that only this file uses (general-rules section 7).

## 3. Component body order

1. Hooks: `useState`, then `useEffect`.
2. Handlers, toggles and validators, written as arrow functions, each with its one-line comment.
3. Derived values: filtered or sorted data, class-name strings, labels.
4. JSX pieces assembled into named variables (`serviceEntries`, `statusButton`, `serviceImage`).
5. Early returns for hidden or empty states.
6. `return (...)` with the final markup.

## 4. Props

- Destructure props in the signature.
- For a component's own props, use an inline object type. For a shape shared across files, use a `Type*` from `SharedTypes.ts`. For raw query data, use a generated `<Operation>Query` type.

  ```tsx
  // Renders the services page body with its intro and the list of services
  export default function ServicesContent({
      servicesPageData,
  }: {
      servicesPageData: GetServicesPageQuery
  }) {
  ```

- Type children as `ReactNode` (import it with `import type {ReactNode} from 'react'`) or use `React.PropsWithChildren`. Use `Readonly<{children: React.ReactNode}>` in layouts.
- Mark optional props with `?`. Callback props are typed functions: `closeModal: () => void`, `onSlideSelect: (slideIndex: number) => void`.
- When passing nullable CMS values, add fallbacks at the call site: `title={title || ''}`, `serviceStatus={(serviceStatus as SERVICE_STATUS) || SERVICE_STATUS.hidden}`.

## 5. Lists and keys

- Build lists with `.map` into a descriptive plural variable before the `return`. Name the callback parameter after the item.
- Use a stable CMS `id` as the `key`. If there is none, use a composite such as `` `${service.slug}_${index}` ``. A bare index is the last resort.
- Filter before mapping, with descriptive names (`filteredServices`, then `sortedServices`, then `serviceEntries`).
- To flatten CMS nodes, spread them into a destructuring with explicit fallbacks:

  ```tsx
  const {title, id, imageLink, imageAltText} = {
      ...serviceNode,
      ...serviceNode.serviceFields,
      imageLink: serviceNode.serviceFields?.featuredImage?.node.sourceUrl || '',
      imageAltText: serviceNode.serviceFields?.featuredImage?.node.altText || '',
  }
  ```

- For an empty list, render a short message instead of an empty container.

## 6. Conditional rendering and class names

- `{condition && (<Element />)}` renders something or nothing.
- `condition ? (<A />) : (<B />)` chooses between two elements. Assign it to a named variable when it is longer than a line.
- `? ... : null` gives a variable that is either an element or nothing.
- Combine classes with template literals: `` className={`${classes.serviceStatus} ${serviceAvailable ? classes.serviceAvailable : ''}`} ``.
- Never use inline `style` objects, `sx` props or styled wrappers. All styling goes through CSS Modules. The one exception, `app/global-error.tsx`, is in `styling-rules.md` section 1.

## 7. Icons

- **Custom icons** (logos, chess pieces and any other drawing) are plain `<svg>` components in `app/utils/icons/<name>Icon.tsx`. They work as server components, so each one:
  - has no `'use client'` and imports nothing from MUI.
  - sets a `viewBox`, `fill='currentColor'`, and a `width` and `height` of `'1em'`, so it follows its parent's `font-size` and `color`.
  - is hidden from assistive technology by default (`aria-hidden='true'`, `focusable='false'`). When an icon carries meaning, its parent gives the accessible name (for example the button's label).
  - accepts `React.SVGProps<SVGSVGElement>` and spreads them last, so a CSS Module `className` can size and color it.

  ```tsx
  import type React from 'react'

  // Renders the TikTok logo as a decorative inline SVG icon
  export default function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
          <svg
              aria-hidden='true'
              fill='currentColor'
              focusable='false'
              height='1em'
              viewBox='0 0 24 24'
              width='1em'
              {...props}
          >
              <path d='...' />
          </svg>
      )
  }
  ```

- **MUI icons:** `@mui/icons-material` may be imported only inside client components (files with `'use client'`), with named imports (`import {Close, Email} from '@mui/icons-material'`). A server component that needs an icon uses a custom icon instead. Nothing is ever imported from `@mui/material`.
- **Sizing and color** come only from CSS Modules: set `font-size` and `color` on a wrapper or a `className`. Custom icons follow them through `1em` and `currentColor`. MUI icons follow them with `fontSize='inherit'`. Never use `sx`, `style` or `styled`.
- **Icon maps** (platform to icon) live in `constants.tsx` as `new Map([[ENUM.value, <Icon key={`${ENUM.value}`} />]])`.

## 8. Reference example

This is a generic illustration of the conventions, not existing code:

```tsx
'use client'
import sharedClasses from '@/app/sharedStyles.module.css'
import type {TypeServiceEntry} from '@/app/SharedTypes'
import {SERVICE_STATUS} from '@/app/utils/constants'
import {parseCmsHtml} from '@/app/utils/htmlHandler'
import {ExpandMore} from '@mui/icons-material'
import Link from 'next/link'
import {useState} from 'react'
import classes from './ServiceEntry.module.css'

// Renders one service with an expandable description and its booking link
export default function ServiceEntry({
    title,
    shortDescription,
    fullDescription,
    serviceStatus,
    linkToBooking,
}: TypeServiceEntry) {
    const [descriptionExpanded, setDescriptionExpanded] = useState(false)

    // Switches between the short and the full description
    const toggleDescription = () => setDescriptionExpanded(!descriptionExpanded)

    const descriptionContent = descriptionExpanded
        ? fullDescription
        : shortDescription

    const bookingLink =
        serviceStatus === SERVICE_STATUS.published && linkToBooking ? (
            <Link className={classes.serviceBookingLink} href={linkToBooking}>
                Book Now
            </Link>
        ) : (
            <p className={classes.serviceComingSoon}>Coming Soon</p>
        )

    if (serviceStatus === SERVICE_STATUS.hidden) return null

    return (
        <li className={classes.serviceEntry}>
            <h3 className={sharedClasses.mainTitle}>{title}</h3>
            <div className={classes.serviceDescription}>
                {parseCmsHtml(descriptionContent)}
            </div>
            <button
                className={classes.serviceExpandButton}
                type='button'
                onClick={toggleDescription}
            >
                <span className={classes.serviceExpandIcon}>
                    <ExpandMore fontSize='inherit' />
                </span>
                {descriptionExpanded ? 'Show Less' : 'Learn More'}
            </button>
            {bookingLink}
        </li>
    )
}
```
