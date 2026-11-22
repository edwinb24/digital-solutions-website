import type React from 'react'

// Renders a knight chess piece, also used as the logo, as an inline SVG icon
export default function KnightIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path
                d='M23 25c.5-8.5-1-15-6.5-17.5L15.5 4 14 6.8C11 8 9 10.5 7.5 14L7 16c1 1.5 3 1.5 5 0 1-.5 2-.2 2.2.5-1.7 2.5-3.7 4.5-3.7 8.5zM13.4 10.5a.9.9 0 1 1-1.8 0 .9.9 0 1 1 1.8 0z'
                fillRule='evenodd'
            />
            <path d='M7 25h18v3H7z' />
        </svg>
    )
}
