import {MAIN_NAVIGATION_LABEL, MENU_PAGE_LINKS} from '@/app/utils/constants'
import Link from 'next/link'
import classes from './NavigationMenu.module.css'

// Renders the main menu links as a pill-shaped list
export default function NavigationMenu() {
    const menuEntries = MENU_PAGE_LINKS.map(pageLink => (
        <li key={pageLink.id}>
            <Link className={classes.navigationMenuLink} href={pageLink.link}>
                {pageLink.title}
            </Link>
        </li>
    ))

    return (
        <nav aria-label={MAIN_NAVIGATION_LABEL}>
            <ul className={classes.navigationMenu}>{menuEntries}</ul>
        </nav>
    )
}
