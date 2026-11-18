import type React from 'react'

// Renders a pawn chess piece as a decorative inline SVG icon
export default function PawnIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <circle cx='16' cy='9' r='4' />
            <path d='M12.5 14h7l-1 2 2.5 9h-10l2.5-9z' />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
