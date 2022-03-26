/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
import GoogleCalendar from './google-calendar.js';
import EventSources from './event-sources.js';

export const corsbase = 'https://cors.anarchism.nyc';
const domparser = new DOMParser();

/**
 * Translates a Schema.org Event type (or more specific type)
 * to a FullCalendar event object.
 */
var schemaDotOrg2FullCalendar = function (ld_json) {
    return ld_json.map(function (item) {
        return {
            title: item.name,
            start: item.startDate,
            end: item.endDate,
            url: item.url,
            extendedProps: {
                description: item.description || ''
            }
        };
    });
};

/**
 * The WordPress plugin "Tribe Events" has a neat little JSON endpoint
 * we can pull from, too.
 */
var wpTribe2FullCalendar = function (json_events) {
    return json_events.map(function (item) {
        item.start = new Date(item.utc_start_date + 'Z');
        item.end = new Date(item.utc_end_date + 'Z');
        return item;
    });
}

/**
 * Convenience method that scrapes the "Upcoming Events" list off
 * of an EventBrite's Organizer Page and transforms them into an
 * event source for FullCalendar.
 *
 * @todo Parse individual occurrences instead of treating as one long event.
 */
var fetchEventBriteEventsByOrganizer = function (url, fetchInfo, successCallback, failureCallback) {
    fetch(corsbase + '/' + url)
        .then(function (response) {
            return response.text();
        }).then(function (data) {
            var doc = domparser.parseFromString(data, 'text/html');
            successCallback(schemaDotOrg2FullCalendar(
                JSON.parse(doc.querySelectorAll('script[type="application/ld+json"]')[1].innerText)
            ));
        });
};

var fetchWordPressTribeEvents = function (url, fetchInfo, successCallback, failureCallback) {
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        successCallback(wpTribe2FullCalendar(data.events));
    });
};

// TODO:
// Convenience method that scrapes the "Upcoming Events" sections
// of a Resident Advisor (ra.co) club or promoter.
// var fetchResidentAdvisorEvents = function (url, fetchInfo, successCallback, failureCallback) {};

export default new FullCalendar.Calendar(document.getElementById('calendar'), {
    // TODO: This isn't ready yet but its intent is to be able to toggle a given
    //       FullCalendar Event Source on or off so that a visitor can view a
    //       subset of the events on the calendar based on its source at a time.
    customButtons: {
        calendars: {
            text: 'Calendars',
            click: function () {
                var el = document.getElementById('calendarsButtonModal');
                app.getEventSources().forEach(function (s) {
                    var li = document.createElement('li');
                    var input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('name', 'calendar_source');
                    input.setAttribute('id', 'calendar-source-' + s.id);
                    li.appendChild(input);
                    var text = document.createTextNode(s.name);
                    li.appendChild(text);
                    el.querySelector('#calendarsList').appendChild(li);
                });
                var m = new bootstrap.Modal(el);
                m.show();
            }
        }
    },
    views: {
        listDay: {
            type: 'list',
            duration: { days: 1 },
            buttonText: 'list'
        }
    },
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridDay,listDay'
        // When ready, we'll add a "Calendars" button. But not yet.
        //right: 'calendars dayGridMonth,timeGridDay,listDay'
    },
    initialView: function () {
        return (window.matchMedia("only screen and (max-width: 540px)").matches)
            ? 'listDay': 'dayGridMonth';
    }(),
    nowIndicator: true,
    defaultTimedEventDuration: '02:00', // Most events are longer than one hour.
    loading: function (isLoading) {
        var el = document.getElementById('calendar-loading-spinner');
        if (isLoading && ! el.dataset.firstLoadCompleted) {
            el.style.display = 'block';
            el.setAttribute('data-first-load-completed', true);
        } else {
            el.style.display = 'none';
        }
    },
    eventSources: EventSources.concat([
        {
            name: 'TechLearningCollective.com',
            className: 'event-techlearningcollective',
            id: 'techlearningcollective',
            // Use the FullCalendar custom JSON feed until its bug #6173 is resolved.
            // See https://github.com/fullcalendar/fullcalendar/issues/6173
            url: 'https://techlearningcollective.com/events/all-fullcalendar-io.json',
            color: 'blue'
        },
        {
            name: 'Metropolitan Anarchist Coordinating Council of NYC',
            id: 'maccnyc',
            className: 'event-maccnyc',
            url: 'https://tockify.com/api/feeds/ics/mlsupport',
            format: 'ics',
            color: 'black'
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
            format: 'ics'
        },
// Not sure if this group is active anymore, so remove them for now.
//            {
//                name: 'New York CryptoParty Network',
//                id: 'newyorkcryptopartynetwork',
//                className: 'newyorkcryptopartynetwork',
//                url: corsbase + '/https://www.meetup.com/New-York-Cryptoparty-Network/events/ical/',
//                format: 'ics'
//            }

        // Likewise, these Google Calendars seem to be having trouble loading
        // for mobile users when using the Google Calendar API. Instead, we
        // fallback to the public ICS feed for these (for now) as well.

        // This one-off event source helpfully published Schema.org-style Linked Data JSON!
        {
            name: 'EastVille Comedy Club',
            id: 'eastville-comedy-club',
            className: 'eastville-comedy-club',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.eastvillecomedy.com/calendar')
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var ld_json = JSON.parse(doc.querySelector('script[type="application/ld+json"]').innerText)
                successCallback(schemaDotOrg2FullCalendar(ld_json));
            },
            color: 'purple'
        },

        // These event sources are just scraped right off the of
        // the organizer's page on EventBrite.
        {
            name: 'Cult 24 - EventBrite',
            id: 'cult-24',
            className: 'cult-24',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/24-11905129611', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Brooklyn Comedy Collective - EventBrite',
            id: 'brooklyn-comedy-collective-eventbrite',
            className: 'brooklyn-comedy-collective-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/brooklyn-comedy-collective-27620063469', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Caveat NYC - EventBrite',
            id: 'caveat-nyc-eventbrite',
            className: 'caveat-nyc-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/caveat-13580085802', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: "Dave's Lesbian Bar - EventBrite",
            id: 'daves-lesbian-bar-eventbrite',
            className: 'daves-lesbian-bar-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/daves-lesbian-bar-34182605937', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: "Dyke Beer - EventBrite",
            id: 'dyke-beer-eventbrite',
            className: 'dyke-beer-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/dyke-beer-14414017747', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        // Commented out for now until EventBrite function can handle single events
        // with multiple occurrences without displaying as "All Day" events across
        // all occurrences.
//            {
//                name: "Good Judy - EventBrite",
//                id: 'good-judy-eventbrite',
//                className: 'good-judy-eventbrite',
//                events: function (fetchInfo, successCallback, failureCallback) {
//                    return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/good-judy-31484266863', fetchInfo, successCallback, failureCallback);
//                },
//                color: 'red'
//            },
        {
            name: 'House of Yes - EventBrite',
            id: 'house-of-yes-eventbrite',
            className: 'house-of-yes-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/house-of-yes-8534581785', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Le Organizer - EventBrite',
            id: 'le-organizer-eventbrite',
            className: 'le-organizer-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/le-organizer-11067403290', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Littlefield - EventBrite',
            id: 'littlefield-eventbrite',
            className: 'littlefield-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/littlefield-18046024060', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Newtown Creek Alliance - EventBrite',
            id: 'newtown-creek-alliance-eventbrite',
            className: 'newtown-creek-alliance-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/newtown-creek-alliance-6350090643', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            // They have a Tockify but they did not enable Tockify's ICS feed. :(
            name: 'Pagan\'s Paradise - EventBrite',
            id: 'pagans-paradise-eventbrite',
            className: 'pagans-paradise-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/pagans-paradise-16960673418', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'TV Eye - EventBrite',
            id: 'tv-eye-eventbrite',
            className: 'tv-eye-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/tv-eye-28766931741', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'The Bell House - EventBrite',
            id: 'the-bell-house-eventbrite',
            className: 'the-bell-house-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/the-bell-house-17899492469', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'The Sultan Room - EventBrite',
            id: 'the-sultan-room-eventbrite',
            className: 'the-sultan-room-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/the-sultan-room-18078001345', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },
        {
            name: 'Union Hall - EventBrite',
            id: 'union-hall-eventbrite',
            className: 'the-sultan-room-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/union-hall-17899496497', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },


        // These sources are from WordPress Web sites running Tribe Events plugin.
        {
            name: 'WOW Cafe Theatre',
            id: 'wow-cafe-theatre',
            className: 'wow-cafe-theatre',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchWordPressTribeEvents('https://www.wowcafe.org/wp-json/tribe/events/v1/events', fetchInfo, successCallback, failureCallback);
            },
            color: 'blue'
        }
    ]),
    eventDidMount: function (info) {
        info.el.setAttribute('title', info.event.title);
        return [ info.el ];
    },
    eventClick: function (info) {
        info.jsEvent.preventDefault();
        if (info.event.url) {
            window.open(info.event.url);
        }
    }
});
