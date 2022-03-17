app = (function () { // begin Immediately-Invoked Function Expression

    const corsbase = 'https://cors.anarchism.nyc';
    const domparser = new DOMParser();

    /**
     * Translate a jCal (RFC 7265) `vevent` component to a FullCalendar event object.
     *
     * @param {array} vevent
     * @return {object}
     */
    var jCal2FullCalendar = function (vevent) {
        var newEvent = {};
        vevent.forEach(function (property) {
            switch (property[0]) {
                case 'summary':
                    newEvent.title = property[3];
                    break;
                case 'dtstart':
                    newEvent.start = property[3]
                    break;
                case 'dtend':
                    newEvent.end = property[3];
                    break;
                case 'url':
                    newEvent.url = property[3];
                    break;
                case 'uid':
                    newEvent.uid = property[3];
                    break;
            }
        });
        return newEvent;
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

    // The app's `calendar` member is the FullCalendar implementation itself.
    // Think of this as the `main()` function, basically.
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
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
                url: corsbase + '/https://calendar.google.com/calendar/ical/2om8s9hsd7kkkjcc88kon65i2o%40group.calendar.google.com/public/basic.ics',
                format: 'ics',
                color: 'gray'
            },
            {
                name: 'Phase Space',
                id: 'phase-space',
                className: 'phase-space',
                url: corsbase + '/https://calendar.google.com/calendar/ical/q14jhdv41fng6q1b2826dp92rs%40group.calendar.google.com/public/basic.ics',
                format: 'ics',
                color: 'white',
                textColor: 'black'
            },

            // These event sources are just scraped right off the of
            // the organizer's page on EventBrite.
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
        eventSourceSuccess: function (rawEvents, xhr) {
            if (!xhr) { return rawEvents; }
            // If this is a Google Calendar ICS feed, we need to insert URLs
            // because they're missing from the iCalendar feed provided by Google.
            if (-1 === xhr.responseURL.indexOf('https://calendar.google.com/')) {
                return rawEvents; // This is not a GCal ICS feed. Return event source unchanged.
            }

            // The format for a Google Calendar single event page is this:
            //
            //     https://calendar.google.com/calendar/event?eid={eventid}&ctz=America/New_York
            //
            // where `{eventid}` is a base64 encoded string constructed as:
            //
            //     vEvent UID component + ' ' + calendar ID + '@g'
            //
            // The `@g` at the end is literal.
            var calendar = xhr.responseURL.match(/calendar\/ical\/(.*)%40.*public\/basic.ics/)[1];
            var events   = [];
            var jcal     = ICAL.parse(xhr.responseText); // jCal (RFC 7265) formatted data.

            jcal[2].forEach(function (component) {
                if ("vevent" !== component[0]) { return; }
                events.push(jCal2FullCalendar(component[1]));
                // Google Calendars don't provide a URL.
                // So we generate one with the event UID ourselves.
                events[events.length - 1].url = 'https://calendar.google.com/calendar/event?eid='
                        + btoa(events[events.length - 1].uid.replace('@google.com', '') + ' ' + calendar + '@g')
                        + '&ctz=America/New_York';
            });

            return events;
        },
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

    document.addEventListener('DOMContentLoaded', function() {
        calendar.render();
    });

    return calendar;
})(); // end IIFE
