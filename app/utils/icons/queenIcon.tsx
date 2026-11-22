import type React from 'react'

// Renders a queen chess piece as a decorative inline SVG icon
export default function QueenIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <circle cx='9' cy='7' r='1.3' />
            <circle cx='12.5' cy='5.5' r='1.3' />
            <circle cx='16' cy='5' r='1.3' />
            <circle cx='19.5' cy='5.5' r='1.3' />
            <circle cx='23' cy='7' r='1.3' />
            <path
                d='M9 8.5l3 7 1.5-8 2.5 7.5 2.5-7.5 1.5 8 3-7-2 10.5.5 6h-11l.5-6z'
            />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
