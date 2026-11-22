import {BOOK_CODE_REVIEW_LINK, HOME_BANNER} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import HomeBanner from './HomeBanner'

describe('HomeBanner', () => {
    it('renders one h1, the copy and the call to action', () => {
        render(<HomeBanner />)

        const headings = screen.getAllByRole('heading', {level: 1})
        const callToAction = screen.getByRole('link', {
            name: BOOK_CODE_REVIEW_LINK.title,
        })

        expect(headings).toHaveLength(1)
        expect(headings[0]).toHaveTextContent(HOME_BANNER.headline)
        expect(screen.getByText(HOME_BANNER.eyebrow)).toBeInTheDocument()
        expect(screen.getByText(HOME_BANNER.paragraph)).toBeInTheDocument()
        expect(callToAction).toHaveAttribute('href', BOOK_CODE_REVIEW_LINK.link)
    })
})
