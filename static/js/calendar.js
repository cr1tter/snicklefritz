/**
 * Calendar is the main calendar-handling code.
 *
 * Effectively, the "app" itself.
 */
import EventSources from './event-sources.js';

export const corsbase = 'https://cors.anarchism.nyc';

const domparser = new DOMParser();

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
