'use client'
import sharedClasses from '@/app/sharedStyles.module.css'
import {
    HEADER_LOGO_TEXT,
    NAVIGATION_MENU_PANEL_ID,
    START_CONVERSATION_LINK,
} from '@/app/utils/constants'
import KnightIcon from '@/app/utils/icons/knightIcon'
import Link from 'next/link'
import {type KeyboardEvent, useRef, useState} from 'react'
import HamburgerMenu from './hamburger_menu/HamburgerMenu'
import NavigationMenu from './navigation_menu/NavigationMenu'
import classes from './SiteHeader.module.css'

// Renders the site header with the logo, the menu and the call to action
export default function SiteHeader() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false)
    const hamburgerReference = useRef<HTMLButtonElement>(null)

    // Closes the menu and returns focus to its button on Escape
    const handleEscapeKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Escape' || !hamburgerOpen) return
        setHamburgerOpen(false)
        hamburgerReference.current?.focus()
    }

    const openMenuPanelClass = hamburgerOpen
        ? classes.siteHeaderMenuPanelOpen
        : ''

    return (
        <header className={classes.siteHeader}>
            <div
                className={`${sharedClasses.pageWideWrapper} ${classes.siteHeaderContent}`}
                role='presentation'
                onKeyDown={handleEscapeKeyDown}
            >
                <div className={classes.siteHeaderLogo}>
                    <KnightIcon className={classes.siteHeaderLogoIcon} />
                    <span>{HEADER_LOGO_TEXT}</span>
                </div>
                <HamburgerMenu
                    hamburgerOpen={hamburgerOpen}
                    ref={hamburgerReference}
                    onToggle={() => setHamburgerOpen(open => !open)}
                />
                <div
                    className={`${classes.siteHeaderMenuPanel} ${openMenuPanelClass}`}
                    id={NAVIGATION_MENU_PANEL_ID}
                    role='presentation'
                    onClick={() => setHamburgerOpen(false)}
                >
                    <NavigationMenu />
                    <Link
                        className={classes.siteHeaderCallToAction}
                        href={START_CONVERSATION_LINK.link}
                    >
                        {START_CONVERSATION_LINK.title}
                    </Link>
                </div>
            </div>
        </header>
    )
}
