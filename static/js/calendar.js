/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
// Import the FullCalendar vendor modules.
import { Calendar, sliceEvents } from 'https://cdn.skypack.dev/@fullcalendar/core@6.1.4?min';
import dayGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/daygrid@6.1.4?min';
import timeGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/timegrid@6.1.4?min';
import listPlugin from 'https://cdn.skypack.dev/@fullcalendar/list@6.1.4?min';
import iCalendarPlugin from 'https://cdn.skypack.dev/@fullcalendar/icalendar@6.1.4?min';
import rrulePlugin from 'https://cdn.skypack.dev/@fullcalendar/rrule@6.1.4?min';
import bootstrap5Plugin from 'https://cdn.skypack.dev/@fullcalendar/bootstrap5@6.1.4?min';

// Import our own module code sources.
import EventSources from './event-sources.js';
import FullCalendarEvent from './event.js';
import {
    default as mapPlugin,
    map,
    addEventsInRangeTo
} from './custom-views/map.js';
import { default as calendarFilterListItem } from './custom-elements/calendar-filter-list-item.js';

export const corsbase = 'https://cors.anarchism.nyc';
export const domparser = new DOMParser();

export const calendarHeaderToolbar = {
    largeScreen: {
        left: 'prev,next today',
        center: 'title',
        //right: 'filter dayGridMonth,timeGridDay,listDay,map'
        right: 'dayGridMonth,timeGridDay,listDay,map'
    },
    smallScreen: {
        left: 'prev,next today',
        center: 'title',
        //right: 'filter listDay,map'
        right: 'listDay,map'
    }
}

var calendar = new Calendar(document.getElementById('calendar'), {
    plugins: [
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        iCalendarPlugin,
        rrulePlugin,
        bootstrap5Plugin,
        mapPlugin
    ],
    // TODO: This isn't ready yet but its intent is to be able to toggle a given
    //       FullCalendar Event Source on or off so that a visitor can view a
    //       subset of the events on the calendar based on its source at a time.
    customButtons: {
        filter: {
            text: 'Filter',
            hint: 'Filter event listings',
            icon: 'filter',
            click: function () {
                jQuery('#calendar-filter-modal').modal('show');
                calendar.getEventSources().sort(function (a, b) {
                    var x = a.internalEventSource.extendedProps.name;
                    var y = b.internalEventSource.extendedProps.name;
                    return x.localeCompare(y);
                }).forEach(function (s) {
                    var el = document.createElement('calendar-filter-list-item');
                    el.dataset.id = s.id;
                    var nameSlot = document.createElement('span');
                    nameSlot.setAttribute('slot', 'item-name');
                    nameSlot.appendChild(document.createTextNode(s.internalEventSource.extendedProps.name));
                    el.appendChild(nameSlot);
                    document.getElementById('filter-event-sources')
                        .querySelector('ul')
                        .appendChild(el);
                });
            }
        },
    },
    themeSystem: 'bootstrap5',
    views: {
        listDay: {
            type: 'list',
            duration: { days: 1 },
            buttonText: 'list',
            titleFormat: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        },
        map: {
            titleFormat: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            nextDayThreshold: '04:00:00'
        }
    },
    height: '100vh',
    headerToolbar: calendarHeaderToolbar.largeScreen,
    footerToolbar: {
        left: 'prev,next today',
        center: '',
        //right: 'filter listDay,map'
        right: 'listDay,map'
    },
    initialView: function () {
        return (window.matchMedia("only screen and (max-width: 540px)").matches)
            ? 'listDay': 'dayGridMonth';
    }(),
    initialDate: new URLSearchParams(window.location.search).get('initialDate'),
    nowIndicator: true,
    defaultTimedEventDuration: '02:00', // Most events are longer than one hour.
    weekNumbers: true,
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
                successCallback(ld_json.map(FullCalendarEvent.fromSchemaDotOrg));
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
        },
        {
            name: 'Transgression',
            id: 'transgression',
            className: 'transgression',
            events: async function (fetchInfo, successCallback, failureCallback) {
                var response = await fetch('https://transgression.party/events/');
                var html = await response.text();
                var doc = domparser.parseFromString(html, 'text/html');
                var ld_json = JSON.parse(doc.querySelector('.yoast-schema-graph').textContent);
                var itemList = ld_json['@graph'].find(function (x) {
                    return 'ItemList' === x['@type'] }
                ).itemListElement;
                successCallback(itemList.map(FullCalendarEvent.fromSchemaDotOrg));
            },
            color: 'black',
            textColor: 'white',
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
    },
    datesSet: function (dateInfo) {
        // On the Map view, handle changing markers based on the date
        // range selected in the calendar.
        if ('map' == dateInfo.view.type && map) {
            map.eachLayer(function (layer) {
                // If the Leaflet Layer has an `onEachFeature` option,
                // that's because it's a GeoJSON Layer:
                // https://leafletjs.com/reference.html#geojson
                if (layer.options.onEachFeature) {
                    layer.remove();
                }
            });
            addEventsInRangeTo({
                start: dateInfo.start,
                end  : dateInfo.end
            }, map);
        }
    }
});

export default calendar;
