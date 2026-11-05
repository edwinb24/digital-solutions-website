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
4. Module-level constants that only this file uses. Shared values go in `constants.tsx`.
5. A one-line purpose comment, then `export default function ComponentName(...)`.

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
- Never use inline `style` objects, `sx` props or styled wrappers. All styling goes through CSS Modules.

## 7. Icons

- **MUI icons:** use `@mui/icons-material` with named imports (`import {Close, Email} from '@mui/icons-material'`).
- **Custom icons:** if an icon does not exist in `@mui/icons-material`, create it in `app/utils/icons/<name>Icon.tsx` by wrapping `SvgIcon`:

  ```tsx
  import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'
  import React from 'react'

  // Renders the TikTok logo as an icon compatible with @mui/icons-material
  const TiktokIcon: React.FC<SvgIconProps> = props => (
      <SvgIcon {...props} viewBox='0 0 24 24'>
          <path d='...' />
      </SvgIcon>
  )

  export default TiktokIcon
  ```

- **Sizing and color** come only from CSS Modules. Pass `fontSize='inherit'` and put the size and `color` on a wrapper or `className` in the CSS Module. The icon follows `font-size` and `currentColor`. Never use `sx`, `style` or `styled`.
- **Icon maps** (platform to icon) live in `constants.tsx` as `new Map([[ENUM.value, <Icon key={`${ENUM.value}`} />]])`.

## 8. Reference example

This is a generic illustration of the conventions, not existing code:

```tsx
'use client'
import sharedClasses from '@/app/sharedStyles.module.css'
import type {TypeServiceEntry} from '@/app/SharedTypes'
import {SERVICE_STATUS} from '@/app/utils/constants'
import {ExpandMore} from '@mui/icons-material'
import parse from 'html-react-parser'
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
                {parse(descriptionContent)}
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
