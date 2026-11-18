import {
    CLOSE_NAVIGATION_MENU_LABEL,
    NAVIGATION_MENU_PANEL_ID,
    OPEN_NAVIGATION_MENU_LABEL,
} from '@/app/utils/constants'
import type {Ref} from 'react'
import classes from './HamburgerMenu.module.css'

// Renders the button that opens and closes the menu on phones
export default function HamburgerMenu({
    hamburgerOpen,
    onToggle,
    ref,
}: {
    hamburgerOpen: boolean
    onToggle: () => void
    ref: Ref<HTMLButtonElement>
}) {
    const openBarTopClass = hamburgerOpen ? classes.hamburgerBarTopOpen : ''
    const openBarMiddleClass = hamburgerOpen
        ? classes.hamburgerBarMiddleOpen
        : ''
    const openBarBottomClass = hamburgerOpen
        ? classes.hamburgerBarBottomOpen
        : ''

    return (
        <button
            aria-controls={NAVIGATION_MENU_PANEL_ID}
            aria-expanded={hamburgerOpen}
            aria-label={
                hamburgerOpen
                    ? CLOSE_NAVIGATION_MENU_LABEL
                    : OPEN_NAVIGATION_MENU_LABEL
            }
            className={classes.hamburger}
            ref={ref}
            type='button'
            onClick={onToggle}
        >
            <span
                className={`${classes.hamburgerBarTop} ${openBarTopClass}`}
            ></span>
            <span
                className={`${classes.hamburgerBarMiddle} ${openBarMiddleClass}`}
            ></span>
            <span
                className={`${classes.hamburgerBarBottom} ${openBarBottomClass}`}
            ></span>
        </button>
    )
}
