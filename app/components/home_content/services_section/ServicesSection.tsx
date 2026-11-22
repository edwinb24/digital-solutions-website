import sharedClasses from '@/app/sharedStyles.module.css'
import {SERVICE_ENTRIES, SERVICES_SECTION_TITLE} from '@/app/utils/constants'
import ServiceEntry from './service_entry/ServiceEntry'
import classes from './ServicesSection.module.css'

// Renders the three services as joined cards
export default function ServicesSection() {
    const serviceEntries = SERVICE_ENTRIES.map(service => (
        <ServiceEntry key={service.id} {...service} />
    ))

    return (
        <section
            className={`${sharedClasses.pageWideWrapper} ${classes.servicesSection}`}
        >
            <h2 className={classes.servicesSectionTitle}>
                {SERVICES_SECTION_TITLE}
            </h2>
            <ul className={classes.servicesSectionList}>{serviceEntries}</ul>
        </section>
    )
}
