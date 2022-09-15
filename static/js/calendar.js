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
        right: 'dayGridMonth,timeGridDay,listDay,map'
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
                var buildId = JSON.parse(doc.getElementById('__NEXT_DATA__').textContent).buildId;;
                var response = await fetch(corsbase + `/https://www.elsewherebrooklyn.com/_next/data/${buildId}/events.json`);
                var json = await response.json();
                successCallback(json.pageProps.events.data.map(function (item) {
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
        },

        // TV Eye uses SeeTickets.us but scraping that is confusing so instead we'll
        // just pull from their own Web site.
        {
            name: 'TV Eye',
            id: 'tv-eye',
            className: 'tv-eye',
            color: '#F113A2',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch(corsbase + '/https://tveyenyc.com/calendar/');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var els = doc.querySelectorAll('#seetickets article.list-view-item');
                var events = [];
                els.forEach(function (el) {
                    var date = new Date(el.querySelector('.dates').innerText.trim());
                    var date_string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    var time   = (el.querySelector('.detail_door_time .name') || el.querySelector('.detail_event_time .name'))
                        .innerText.trim();
                    var hour   = time.split(':')[0];
                    var minute = time.split(':')[1].split(' ')[0].padStart(2, '0');
                    var ampm   = time.match('([Aa]|[Pp])[Mm]$')[0];
                    if ('PM' === ampm.toUpperCase()) {
                        hour = parseInt(hour) + 12; // Naively convert to 24 hour time.
                    }
                    hour = hour.toString().padStart(2, '0');
                    date_string = `${date_string}T${hour}:${minute}:00`;
                    var title = el.querySelector('h1.event-name').innerText.trim();
                    var start = new Date(date_string);
                    var url = el.querySelector('.buy-tickets').getAttribute('href');

                    events.push({
                        title: title,
                        start: start,
                        url: url,
                        // All events at TV Eye are, well,
                        // at TV Eye, so, lol.
                        location: {
                            lat: '40.6978584',
                            lon: '-73.9074125'
                        }
                    });
                });
                return events;
            }
        }
    ]),
    eventContent: function (info) {
        if ( 'listDay' == info.view.type ) {
            return {
                html: `<a href="${info.event.url}">${info.event.title} - via ${info.event.source.internalEventSource?.extendedProps?.name}</a>`
            };
        }
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
