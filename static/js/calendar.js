---
layout: none
---
/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
// Import the FullCalendar vendor modules.
import { Calendar, sliceEvents } from 'https://cdn.skypack.dev/@fullcalendar/core@6.1.9?min';
import dayGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/daygrid@6.1.9?min';
import timeGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/timegrid@6.1.9?min';
import listPlugin from 'https://cdn.skypack.dev/@fullcalendar/list@6.1.9?min';
import iCalendarPlugin from 'https://cdn.skypack.dev/@fullcalendar/icalendar@6.1.9?min';
import rrulePlugin from 'https://cdn.skypack.dev/@fullcalendar/rrule@6.1.9?min';
import bootstrap5Plugin from 'https://cdn.skypack.dev/@fullcalendar/bootstrap5@6.1.9?min';

// Import our own module code sources.
import EventSources from '{{ site.baseurl }}{% link static/js/event-sources.js %}';
import FullCalendarEvent from '{{ site.baseurl }}{% link static/js/event.js %}';
import {
    default as mapPlugin,
    map,
    addEventsInRangeTo
} from '{{ site.baseurl }}{% link static/js/custom-views/map.js %}';
import { default as calendarFilterEventSourceListItem } from '{{ site.baseurl }}{% link static/js/custom-elements/calendar-filter-event-source-list-item.js %}';

export const calendarHeaderToolbar = {
    largeScreen: {
        left: 'prev,next today',
        center: 'title',
        right: 'filter dayGridMonth,timeGridDay,listDay,map'
    },
    smallScreen: {
        left: 'prev,next today',
        center: 'title',
        right: 'filter listDay,map'
    }
};

/**
 * Changes the toolbar buttons that are visible and their size based
 * on the size of the screen. This helps adjust for mobile screens.
 *
 * @return void
 */
export function adjustToolbarButtons () {
    if (window.matchMedia("only screen and (max-width: 540px)").matches) {
        calendar.setOption('headerToolbar', calendarHeaderToolbar.smallScreen);
        document.querySelectorAll('.fc-toolbar .btn').forEach(function (btn) {
            btn.classList.add('btn-sm');
        });
    } else {
        calendar.setOption('headerToolbar', calendarHeaderToolbar.largeScreen);
        document.querySelectorAll('.fc-toolbar .btn').forEach(function (btn) {
            btn.classList.remove('btn-sm');
        });
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
    customButtons: {
        filter: {
            text: 'Filter',
            hint: 'Filter event listings',
            icon: 'filter',
            click: function () {
                jQuery('#calendar-filter-modal').modal('show');
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
                month: 'short',
                day: 'numeric'
            },
            noEventsContent: {
                html: `No events to display. Are you <a href="javascript:document.querySelector('.fc-filter-button').click();">filtering</a>?`
            }
        },
        map: {
            titleFormat: {
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
        right: 'filter listDay,map'
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
    eventSources: EventSources,
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
    // Called whenever the FullCalendar View is changed.
    datesSet: function (dateInfo) {
        adjustToolbarButtons();

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
    },
    windowResize: function (arg) {
        adjustToolbarButtons();
    }
});

export default calendar;
