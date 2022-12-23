/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
import EventSources from './event-sources.js';

export const corsbase = 'https://cors.anarchism.nyc';

export const domparser = new DOMParser();

/**
 * Translates a Schema.org Event type (or more specific type)
 * to a FullCalendar event object.
 */
export var schemaDotOrg2FullCalendar = function (ld_json) {
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
        },
        // TODO: This should show and hide the Map view.
        map: {
            text: 'map',
            click: function () {
                console.log('clicked Map button');
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
        // When ready, we'll add a "Calendars" and "Map" button. But not yet.
        //right: 'calendars dayGridMonth,timeGridDay,listDay,map'
    },
    initialView: function () {
        return (window.matchMedia("only screen and (max-width: 540px)").matches)
            ? 'listDay': 'dayGridMonth';
    }(),
    nowIndicator: true,
    defaultTimedEventDuration: '02:00', // Most events are longer than one hour.
    loading: function (isLoading) {
        if (isLoading) {
            document.getElementById('calendar-loading-spinner').style.display = 'block';
        }
    },
    eventSourceSuccess: function (rawEvents, response) {
        // Whenever an Event Source succeeds, make sure the "Loading..." spinner is off.
        document.getElementById('calendar-loading-spinner').style.display = 'none';
    },
    progressiveEventRendering: true,
    eventSources: EventSources.concat([
        // This is actually Bluestockings, but they use Bookmanager for events now.
        // So here is a simple implementation of a Bookmanager event scraper.
        {
            name: 'Bluestockings Cooperative',
            id: 'bluestocksings-cooperative',
            className: 'bluestockings-cooperative',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var session_id = 'x'; // This can be whatever.
                var store_id = '576827';
                var response = await fetch('https://api.bookmanager.com/customer/event/getList?session_id=' + session_id + '&store_id=' + store_id);
                var json = await response.json();
                // This needs some work.
                successCallback(json.rows.map(function (item) {
                    var tz_offset_milliseconds = (new Date()).getTimezoneOffset() * 60 * 1000;
                    return {
                        title: item.info.name,
                        start: new Date(item.from * 1000 - tz_offset_milliseconds),
                        end: new Date(item.to * 1000 - tz_offset_milliseconds),
                        url: 'https://bluestockings.com/events/' + item.id
                    };
                }));
            }
        },

        // This one-off event source helpfully published Schema.org-style Linked Data JSON!
        {
            name: 'EastVille Comedy Club',
            id: 'eastville-comedy-club',
            className: 'eastville-comedy-club',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.eastvillecomedy.com/calendar');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var ld_json = JSON.parse(doc.querySelector('script[type="application/ld+json"]').innerText);
                successCallback(schemaDotOrg2FullCalendar(ld_json));
            },
            color: 'purple'
        },

        // Eris Evolution is another venue but they only have a simplistic HTML page for a "calendar."
        {
            name: 'Eris Evolution',
            id: 'eris-evolution',
            className: 'eris-evolution',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.erisevolution.com/events/');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var events = [];
                var items = doc.querySelectorAll('.event');
                for (var i = 0; i < items.length; i++) {
                    var date_info = items[i].querySelector('b').textContent.split(',').map(function (i) {
                        return i.trim();
                    });
                    var start_date = date_info[0].substring(0, date_info[0].length - 2);
                    var start_year = date_info[1];
                    var time_info  = items[i].textContent.match(/(\d?\d:\d\d) (am|pm)/i)[0];
                    var event_link = items[i].querySelector('[href^="/tickets/"]');
                    events.push({
                        title: items[i].querySelector('i').textContent,
                        start: new Date(`${start_date} ${start_year} ${time_info}`),
                        url: event_link ? `https://www.erisevolution.com${event_link.getAttribute('href')}` : null
                    });
                }
                successCallback(events);
            },
            color: '#243C94'
        },

        // Elsewhere uses Dice.fm but they don't use its widget. So we'll just get
        // the same data the way their own Web site does, by requesting a JSON file.
        {
            name: 'Elsewhere Brooklyn',
            id: 'elsewhere-brooklyn',
            className: 'elsewhere-brooklyn',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.elsewherebrooklyn.com/events');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var buildId = JSON.parse(doc.getElementById('__NEXT_DATA__').textContent).buildId;
                var response = await fetch(corsbase + `/https://www.elsewherebrooklyn.com/_next/data/${buildId}/events.json`);
                var json = await response.json();
                successCallback(json.pageProps.initialEventData.events.map(function (item) {
                    return {
                        title: item.name,
                        start: new Date(item.date),
                        end: new Date(item.dateEnd),
                        url: item.url
                    };
                }));
            },
            color: '#42D177',
            textColor: '#000'
        },

        // Hacienda simply published HTML from what looks like a custom-ish PHP system.
        {
            name: 'Hacienda Villa',
            id: 'hacienda-villa',
            className: 'hacienda-villa',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.wearehacienda.com/events');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var items = doc.querySelectorAll('.more-event');
                var events = [];
                for (var i = 0; i < items.length; i++) {
                    var date = items[i].querySelector('.event-date').textContent.trim();
                    var time = items[i].querySelector('.event-date + h5').textContent.match(/\d?\d:\d\d [AP]M/i);
                    var title = items[i].querySelector('.event-title').textContent.trim();
                    title += ' - ' + items[i].querySelector('.event-short').textContent.trim();
                    var url = items[i].querySelector('.reserve-btn-right').getAttribute('href');
                    if (! url.match(/^http?/)) {
                        url = 'https://www.wearehacienda.com/' + url;
                    }
                    events.push({
                        title: title,
                        start: new Date(`${date} ${time}`),
                        url: url
                    });
                }
                successCallback(events);
            },
            color: '#000',
            textColor: '#FFF'
        },

        // Jupiter Disco also uses something very similar to Elsewhere, but there's
        // no second XHR to get a separate JSON file; it's right on the site!
        {
            name: 'Jupiter Disco',
            id: 'jupiter-disco',
            className: 'jupiter-disco',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://www.jupiterdisco.com/calendar');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var events = JSON.parse(doc.getElementById('__NEXT_DATA__').textContent).props.pageProps.events;
                successCallback(events.map(function (item) {
                    return {
                        title: item.eventName,
                        start: new Date(item.date),
                        url: 'https://www.jupiterdisco.com/calendar/' + item.slug.current
                    };
                }));
            },
            color: '#2E2E2D',
            textColor: '#FFF',
        }

        // Paragon uses Resident Advisor, which is hard(?) to scrape because they never
        // reveal show times on listing pages, only on individual pages. However, this
        // club's shows are always 9pm to 3am, so we can simply hardcode that data now.
        // Frustratingly, Resident Advisor also actively blocks certain IP ranges.
//        {
//            name: 'Paragon Broadway',
//            id: 'paragon-broadway',
//            className: 'paragon-broadway',
//            events: async function (fetchInfo, successCallback, failureCallback) {
//                var response = await fetch(corsbase + '/https://ra.co/widget/eventlisting?promoter=108635');
//                var html = await response.text();
//                var doc = domparser.parseFromString(html, 'text/html');
//                var items = doc.querySelectorAll('.events');
//                events = [];
//                for (var i = 0; i < items.length; i++) {
//                    var date_el = items[i].querySelector('.flag').textContent.trim();
//                    var date = date_el.substring(0, date_el.length - 2); // Strip the annoying slash.
//                    var title = items[i].querySelector('.title a').textContent.trim();
//                    var event_id = items[i].querySelector('.title a').getAttribute('href').match(/\d+$/)[0];
//                    events.push({
//                        title: title,
//                        start: new Date(`${date} 21:00`), // Paragon's shows always start at 9 PM.
//                        url: `https://ra.co/events/${url}`
//                    });
//                }
//                successCallback(events);
//            },
//            color: '#2E2E2D',
//            textColor: '#FFF',
//        }

    ]),
    eventDidMount: function (info) {
        info.el.setAttribute('title', info.event.title);
        if ('listDay' == info.view.type) {
            info.el.querySelector('a').appendChild(document.createTextNode(
                ` - via ${info.event.source.internalEventSource?.extendedProps?.name}`
            ));
        }
        return [ info.el ];
    },
    eventClick: function (info) {
        info.jsEvent.preventDefault();
        if (info.event.url) {
            window.open(info.event.url);
        }
    }
});
