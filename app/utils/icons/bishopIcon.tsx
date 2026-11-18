import type React from 'react'

// Renders a bishop chess piece as a decorative inline SVG icon
export default function BishopIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <circle cx='16' cy='4.5' r='1.8' />
            <path
                d='M16 6.5c3.5 3 5.5 6 5.5 9 0 2.5-1.5 4-3 4.5l1 5h-7l1-5c-1.5-.5-3-2-3-4.5 0-3 2-6 5.5-9zM17.6 10.2l1.2 1-3.6 4.2-1.2-1z'
                fillRule='evenodd'
            />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
