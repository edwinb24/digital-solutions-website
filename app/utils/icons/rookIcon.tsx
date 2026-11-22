import type React from 'react'

// Renders a rook chess piece as a decorative inline SVG icon
export default function RookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden='true'
            fill='currentColor'
            focusable='false'
            height='1em'
            viewBox='0 0 32 32'
            width='1em'
            {...props}
        >
            <path d='M9 5h3v3h2.5V5h3v3H20V5h3v6l-2 2v12H11V13l-2-2z' />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
