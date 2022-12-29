/**
 * Utility module to support plain iCalendar formatted
 * event sources.
 */
// Let's just declare this here.
const corsbase = 'https://cors.anarchism.nyc';

export const IcalendarEventSources = [
    {
        name: 'Livecode.NYC',
        id: 'livecode-nyc',
        className: 'livecode-nyc',
        url: 'https://livecode.nyc/calendar.ics',
        format: 'ics',
    },
    {
        name: 'NYC Anarchist Bookfair',
        id: 'nyc-anarchist-bookfair',
        className: 'nyc-anarchist-bookfair',
        url: corsbase + '/https://anarchistbookfair.net/?ical=1',
        format: 'ics',
    },
    // These calendars hosted on Meetup.com will fail due
    // to a missing CORS header. Current workaround is to
    // use a CORS proxy. This can be tightened down when
    // https://github.com/fullcalendar/fullcalendar/issues/4627#issuecomment-831402797 
    // is resolved.
    {
        name: 'NYC Mesh',
        id: 'nycmesh',
        className: 'nycmesh',
        url: corsbase + '/https://www.meetup.com/nycmesh/events/ical/',
        format: 'ics',
        color: '#FC0'
    },
    {
        name: 'NYC Tri-State Area Bisexual+ SGL Queer & Questioning Meetup',
        id: 'nyc-tri-state-area-bisexual-sgl-queer-questioning-meetup',
        className: 'nyc-tri-state-area-bisexual-sgl-queer-questioning-meetup',
        url: corsbase + '/https://www.meetup.com/bisexual-nyc/events/ical/',
        format: 'ics',
        color: '#FC0'
    },
    {
        name: 'DEFCON201',
        id: 'defcon201',
        className: 'defcon201',
        url: corsbase + '/https://www.meetup.com/DEFCON201/events/ical/',
        format: 'ics',
        color: '#FC0'
    },
// Not sure if this group is active anymore, so remove them for now.
//    {
//        name: 'New York CryptoParty Network',
//        id: 'newyorkcryptopartynetwork',
//        className: 'newyorkcryptopartynetwork',
//        url: corsbase + '/https://www.meetup.com/New-York-Cryptoparty-Network/events/ical/',
//        format: 'ics'
//    }
];
