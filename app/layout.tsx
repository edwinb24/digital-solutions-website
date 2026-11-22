import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
import SiteFooter from './components/footer/SiteFooter'
import SiteHeader from './components/header/SiteHeader'
import './globals.css'
import './reset.css'

const manropeFont = Manrope({
    display: 'swap',
    subsets: ['latin'],
    variable: '--manrope-font',
})

export const metadata: Metadata = {
    title: 'E4 Digital Solutions',
}

// Wraps every page in the body grid with the header, footer and brand font
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html className={manropeFont.variable} lang='en'>
            <body>
                <SiteHeader />
                {children}
                <SiteFooter />
            </body>
        </html>
    )
}
