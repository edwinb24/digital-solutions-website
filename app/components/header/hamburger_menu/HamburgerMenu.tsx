'use client'
import {
    CLOSE_NAVIGATION_MENU_LABEL,
    NAVIGATION_MENU_PANEL_ID,
    OPEN_NAVIGATION_MENU_LABEL,
} from '@/app/utils/constants'
import {Close, Menu} from '@mui/icons-material'
import {type ReactNode, useEffect, useRef, useState} from 'react'
import classes from './HamburgerMenu.module.css'

// Shows the menu inline on desktop and behind a toggle button on phones
export default function HamburgerMenu({children}: {children: ReactNode}) {
    const [navigationMenuOpen, setNavigationMenuOpen] = useState(false)
    const menuButtonReference = useRef<HTMLButtonElement>(null)
    const menuPanelReference = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!navigationMenuOpen) return

        // Closes the menu and returns focus to its button on Escape
        const handleEscapeKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            setNavigationMenuOpen(false)
            menuButtonReference.current?.focus()
        }

        // Closes the menu after the visitor chooses one of its links
        const handleMenuLinkClick = (e: MouseEvent) => {
            if (e.target instanceof Element && e.target.closest('a')) {
                setNavigationMenuOpen(false)
            }
        }

        const menuPanel = menuPanelReference.current
        document.addEventListener('keydown', handleEscapeKeyDown)
        menuPanel?.addEventListener('click', handleMenuLinkClick)

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyDown)
            menuPanel?.removeEventListener('click', handleMenuLinkClick)
        }
    }, [navigationMenuOpen])

    // Opens the menu when it is closed and closes it when it is open
    const toggleNavigationMenu = () =>
        setNavigationMenuOpen(!navigationMenuOpen)

    const menuButtonLabel = navigationMenuOpen
        ? CLOSE_NAVIGATION_MENU_LABEL
        : OPEN_NAVIGATION_MENU_LABEL

    const menuButtonIcon = navigationMenuOpen ? (
        <Close fontSize='inherit' />
    ) : (
        <Menu fontSize='inherit' />
    )

    return (
        <div className={classes.hamburgerMenu}>
            <button
                aria-controls={NAVIGATION_MENU_PANEL_ID}
                aria-expanded={navigationMenuOpen}
                aria-label={menuButtonLabel}
                className={classes.hamburgerMenuButton}
                ref={menuButtonReference}
                type='button'
                onClick={toggleNavigationMenu}
            >
                {menuButtonIcon}
            </button>
            <div
                className={`${classes.hamburgerMenuPanel} ${navigationMenuOpen ? classes.hamburgerMenuPanelOpen : ''}`}
                id={NAVIGATION_MENU_PANEL_ID}
                ref={menuPanelReference}
            >
                {children}
            </div>
        </div>
    )
}
