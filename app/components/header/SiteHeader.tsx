import sharedClasses from '@/app/sharedStyles.module.css'
import {HEADER_LOGO_TEXT, START_CONVERSATION_LINK} from '@/app/utils/constants'
import KnightIcon from '@/app/utils/icons/knightIcon'
import Link from 'next/link'
import HamburgerMenu from './hamburger_menu/HamburgerMenu'
import NavigationMenu from './navigation_menu/NavigationMenu'
import classes from './SiteHeader.module.css'

// Renders the site header with the logo, the menu and the call to action
export default function SiteHeader() {
    return (
        <header className={classes.siteHeader}>
            <div
                className={`${sharedClasses.pageWideWrapper} ${classes.siteHeaderContent}`}
            >
                <div className={classes.siteHeaderLogo}>
                    <KnightIcon className={classes.siteHeaderLogoIcon} />
                    <span>{HEADER_LOGO_TEXT}</span>
                </div>
                <HamburgerMenu>
                    <NavigationMenu />
                    <Link
                        className={classes.siteHeaderCallToAction}
                        href={START_CONVERSATION_LINK.link}
                    >
                        {START_CONVERSATION_LINK.title}
                    </Link>
                </HamburgerMenu>
            </div>
        </header>
    )
}
