import sharedClasses from '@/app/sharedStyles.module.css'
import {
    COMPANY_NAME,
    FOOTER_LINK_SEPARATOR,
    FOOTER_NAVIGATION_LABEL,
    MENU_PAGE_LINKS,
} from '@/app/utils/constants'
import KnightIcon from '@/app/utils/icons/knightIcon'
import Link from 'next/link'
import classes from './SiteFooter.module.css'

// Renders the site footer with the logo and the menu links
export default function SiteFooter() {
    const footerLinks = MENU_PAGE_LINKS.map((pageLink, index) => (
        <li key={pageLink.id}>
            {index > 0 && (
                <span
                    aria-hidden='true'
                    className={classes.siteFooterLinksSeparator}
                >
                    {FOOTER_LINK_SEPARATOR}
                </span>
            )}
            <Link className={classes.siteFooterLink} href={pageLink.link}>
                {pageLink.title}
            </Link>
        </li>
    ))

    return (
        <footer className={classes.siteFooter}>
            <div
                className={`${sharedClasses.pageWideWrapper} ${classes.siteFooterContent}`}
            >
                <div className={classes.siteFooterLogo}>
                    <KnightIcon className={classes.siteFooterLogoIcon} />
                    <span>{COMPANY_NAME}</span>
                </div>
                <nav aria-label={FOOTER_NAVIGATION_LABEL}>
                    <ul className={classes.siteFooterLinks}>{footerLinks}</ul>
                </nav>
            </div>
        </footer>
    )
}
