/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
const corsbase = 'https://cors.anarchism.nyc';
const domparser = new DOMParser();

/**
 * Fetch events via Google Calendar ICS.
 */
var fetchGoogleCalendarICS = async function (url, fetchInfo, successCallback, failureCallback) {

    // The format for a Google Calendar single event page is this:
    //
    //     https://calendar.google.com/calendar/event?eid={eventid}&ctz=America/New_York
    //
    // where `{eventid}` is a base64 encoded string constructed as:
    //
    //     vEvent UID component + ' ' + calendar ID + '@g'
    //
    // The `@g` at the end is literal.
    var calendar = url.match(/calendar\/ical\/(.*)%40.*public\/basic.ics/)[1];
    var events = [];

    var ics = await fetch(url).then((data) => {
        return data.text();
    });
    var jcal = ICAL.parse(ics);
    var vcal = new ICAL.Component(jcal);
    var vevents = vcal.getAllSubcomponents('vevent');
    vevents.forEach(function (e) {
        var vevent = new ICAL.Event(e);
        var newEvent = {
            title: vevent.summary,
            start: vevent.startDate.toJSDate(),
            end: vevent.endDate.toJSDate(),
            // Google Calendars don't provide a URL.
            // So we generate one with the event UID ourselves.
            url: 'https://calendar.google.com/calendar/event?eid='
                + btoa(vevent.uid.replace('@google.com', '') + ' ' + calendar + '@g')
                + '&ctz=America/New_York',
        };
        if (e.hasProperty('rrule')) {
            newEvent.rrule = 'DTSTART:' + vevent.startDate.toICALString()
                + '\n' + e.getFirstProperty('rrule').toICALString();
        }
        events.push(newEvent);
    });

    return events;
};

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
            var j = JSON.parse(doc.querySelectorAll('script[type="application/ld+json"]')[1].innerText);
            successCallback(j.map(function (vevent) {
                return {
                    title: vevent.name,
                    start: vevent.startDate,
                    end: vevent.endDate,
                    url: vevent.url
                }
            }));
        });
};

/**
 * Convenience method that scrapes the "Upcoming Events" sections
 * of a Squarespace-hosted Web site from organizers who use it.
 */
var fetchSquarespaceEvents = function (url, fetchInfo, successCallback, failureCallback) {
    fetch(corsbase + '/' + url)
        .then(function (response) {
            return response.text();
        }).then(function (data) {
            var j = JSON.parse(data);
            var x = j.upcoming || j.items;
            successCallback(x.map(function (vevent) {
                return {
                    title: vevent.title,
                    start: vevent.startDate,
                    end: vevent.endDate,
                    url: new URL(url).origin + vevent.fullUrl
                }
            }));
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
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        // When ready, we'll add a "Calendars" button. But not yet.
        //right: 'calendars dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: function () {
        return (window.matchMedia("only screen and (max-width: 540px)").matches)
            ? 'listWeek': 'dayGridMonth';
    }(),
    nowIndicator: true,
    eventSources: [
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
        {
            // Maintained by Tech Learning Collective's Partner Operations Team.
            // This is mostly a stop-gap for events we can't automatically add.
            name: 'Friendly to Anarchism.NYC',
            id: 'friendlytoanarchismnyc',
            className: 'friendlytoanarchismnyc',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchGoogleCalendarICS(corsbase + '/https://calendar.google.com/calendar/ical/2om8s9hsd7kkkjcc88kon65i2o%40group.calendar.google.com/public/basic.ics', fetchInfo, successCallback, failureCallback);
            },
            color: 'gray'
        },
        {
            name: 'Phase Space',
            id: 'phase-space',
            className: 'phase-space',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchGoogleCalendarICS(corsbase + '/https://calendar.google.com/calendar/ical/q14jhdv41fng6q1b2826dp92rs%40group.calendar.google.com/public/basic.ics', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        },

        // These event sources are just scraped right off the of
        // the organizer's page on EventBrite.
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
            name: 'Littlefield - EventBrite',
            id: 'littlefield-eventbrite',
            className: 'littlefield-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/littlefield-18046024060', fetchInfo, successCallback, failureCallback);
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
            name: 'The Sultan Room - EventBrite',
            id: 'the-sultan-room-eventbrite',
            className: 'the-sultan-room-eventbrite',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchEventBriteEventsByOrganizer('https://www.eventbrite.com/o/the-sultan-room-18078001345', fetchInfo, successCallback, failureCallback);
            },
            color: 'red'
        },

        // Some Web sites hosted on Squarespace also provide (some) data.
        {
            name: 'Hot Rabbit',
            id: 'hot-rabbit',
            className: 'hot-rabbit',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchSquarespaceEvents('https://www.hotrabbit.com/new-events?format=json', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        },
        {
            name: 'Market Hotel',
            id: 'market-hotel',
            className: 'market-hotel',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchSquarespaceEvents('https://www.markethotel.org/calendar?format=json', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        },
        {
            name: 'The Nest Brooklyn',
            id: 'the-nest-brooklyn',
            className: 'the-nest-brooklyn',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchSquarespaceEvents('https://www.thenestbrooklyn.com/event-calender?format=json', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        },
        {
            name: 'Trans Pecos',
            id: 'trans-pecos',
            className: 'trans-pecos',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchSquarespaceEvents('https://www.thetranspecos.com/cal?format=json', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        },
        {
            name: 'Wonderville',
            id: 'wonderville',
            className: 'wonderville',
            events: function (fetchInfo, successCallback, failureCallback) {
                return fetchSquarespaceEvents('https://www.wonderville.nyc/events?format=json', fetchInfo, successCallback, failureCallback);
            },
            color: 'white',
            textColor: 'black'
        }
    ],
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
