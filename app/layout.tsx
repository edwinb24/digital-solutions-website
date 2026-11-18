import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
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

// Wraps every page in the root html and body elements with the brand font
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html className={manropeFont.variable} lang='en'>
            <body>{children}</body>
        </html>
    )
}
