import type React from 'react'

// Renders a king chess piece as a decorative inline SVG icon
export default function KingIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d='M15 2h2v2h2v2h-2v3h-2V6h-2V4h2z' />
            <path d='M11 9.5h10V11H11z' />
            <path d='M10 12h12l-2 4 1.5 9h-11L12 16z' />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
