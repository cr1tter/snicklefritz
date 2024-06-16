/**
 * This file contains the actual list of event sources used by a
 * given instance of this site.
 */

/**
 * The `MainEventSourceData` constant is the main data
 * structure for sourcing event information. It's
 * a nested structure that looks like this:
 *
 * ```javascript
 * [
 *     {
 *         sourceType: 'Constructor', // Name of default export from event source plugin.
 *         options: {
 *             // Various options to set on the event source itself.
 *             // For details, see
 *             //     https://fullcalendar.io/docs/event-source-object#options
 *         },
 *         // List of individual sources that require the given Constructor:
 *         sources: [
 *             // Different values here, usually at a minimum:
 *             {
 *                 name: 'Source name',
 *                 id: 'source-name-for-html-id',
 *                 className: 'source-name-for-html-class',
 *                 url: 'https://example.com/blah.ical'
 *             }
 *         ]
 *     }
 * ]
 * ```
 */
const MainEventSourceData = [
    {
        sourceType: 'ics',
        options: {
            color: 'green',
            format: 'ics'
        },
        sources: [
            {
                name: 'Disroot Calendar',
                id: 'disroot-calendar',
                className: 'disroot-calendar',
                url: 'http://cloud.disroot.org/remote.php/dav/public-calendars/L7YHFSLXQzYCLCyo?export',
                useCorsProxy: true
            }
        ]
    }
    /*{
        sourceType: 'EventBrite',
        options: {
            color: 'red'
        },
        sources: [
            {
                name: 'AdHoc Presents',
                id: 'adhoc-presents',
                className: 'adhoc-presents',
                url: 'https://www.eventbrite.com/o/adhoc-presents-new-york-17573655465'
            }
        ]
    },
    {
        sourceType: 'GoogleCalendar',
        options: {
            color: 'gray'
        },
        sources: [
            {
                name: 'Billie Bullock',
                id: 'billie-bullock',
                className: 'billie-bullock',
                url: 'https://calendar.google.com/calendar/ical/heybilliebullock%40gmail.com/public/basic.ics'
            },
            
        ]
    },
    {
        // For "events from an iCalendar feed" type
        // of event source, see:
        //     https://fullcalendar.io/docs/icalendar
        sourceType: 'ics',
        options: {
            format: 'ics'
        },
        sources: [
            {
                name: 'Livecode.NYC',
                id: 'livecode-nyc',
                className: 'livecode-nyc',
                url: 'https://livecode.nyc/calendar.ics',
            }
        ]
    },
    {
        // For handling "events (as a json feed)" which are natively
        // supported in FullCalendar. See:
        //     https://fullcalendar.io/docs/events-json-feed
        sourceType: 'json',
        options: {
            format: 'json'
        },
        sources: [
            {
                name: 'TechLearningCollective.com',
                className: 'event-techlearningcollective',
                id: 'techlearningcollective',
                // Use the FullCalendar custom JSON feed until its bug #6173 is resolved.
                // See https://github.com/fullcalendar/fullcalendar/issues/6173
                url: 'https://techlearningcollective.com/events/all-fullcalendar-io.json',
                color: 'blue'
            }
        ]
    },
    {
        sourceType: 'ResidentAdvisor',
        options: {
            url: 'https://ra.co/graphql',
            color: '#FF4849',
            textColor: '#FFF'
        },
        sources: [
            {
                name: 'Baby\'s All Right',
                className: 'babys-all-right',
                id: 'babys-all-right',
                extraParams: {
                    gqlVariables: {
                        club: '85157'
                    }
                }
            }
        ]
    },
    {
        sourceType: 'Squarespace',
        options: {
            color: 'white',
            textColor: 'black'
        },
        sources: [
            {
                name: '3 Dollar Bill',
                id: 'three-dollar-bill',
                className: 'three-dollar-bill',
                url: 'https://www.3dollarbillbk.com/rsvp?format=json'
            }
        ]
    }*/,
    {
        sourceType: 'WordPressEventsOrganiser',
        options: {
            color: 'blue'
        },
        sources: [
            {
                name: 'The Seneca',
                id: 'the-seneca',
                className: 'the-seneca',
                url: 'https://www.thesenecanyc.com/wp-admin/admin-ajax.php?action=eventorganiser-fullcal&timeformat=g:i%20a&users_events=false',
                useCorsProxy: true
            }
        ]
    }
];

export default MainEventSourceData;
