import ApproachSection from './approach_section/ApproachSection'
import HomeBanner from './home_banner/HomeBanner'
import classes from './HomeContent.module.css'
import ServicesSection from './services_section/ServicesSection'

// Renders the home page sections inside the main landmark
export default function HomeContent() {
    return (
        <main className={classes.homeContent}>
            <HomeBanner />
            <ServicesSection />
            <ApproachSection />
        </main>
    )
}
