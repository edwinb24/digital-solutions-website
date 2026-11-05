import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Digital Solutions',
}

// Wraps every page in the root html and body elements
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}
