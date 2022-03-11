app = (function () { // begin Immediately-Invoked Function Expression
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        // TODO: This isn't ready yet but its intent is to be able to toggle a given
        //       FullCalendar Event Source on or off so that a visitor can view a
        //       subset of the events on the calendar based on its source at a time.
        customButtons: {
            calendars: {
                text: 'Calendars',
                click: function () {
                    var el = document.getElementById('calendarsButtonModal');
                    console.log(app.getEventSources());
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
            // When ready, we'll add a "Calendars" button. But not yet.
            //right: 'calendars dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventSources: [
            {
                name: 'TechLearningCollective.com',
                className: 'event-techlearningcollective',
                id: 'techlearningcollective',
                // Use the FullCalendar custom JSON feed until its bug #6173 is resolved.
                // See https://github.com/fullcalendar/fullcalendar/issues/6173
                url: 'https://techlearningcollective.com/events/all-fullcalendar-io.json'
            },
            {
                // Maintained by Tech Learning Collective's Partner Operations Team.
                name: 'Friendly to Anarchism.NYC',
                id: 'friendlytoanarchismnyc',
                className: 'friendlytoanarchismnyc',
                googleCalendarApiKey: 'AIzaSyCgUpmnFFSyarVFGiTSPuzxIdJPr2M-Vic',
                googleCalendarId: '2om8s9hsd7kkkjcc88kon65i2o@group.calendar.google.com'
            },
            {
                name: 'Phase Space',
                id: 'phase-space',
                className: 'phase-space',
                googleCalendarApiKey: 'AIzaSyCgUpmnFFSyarVFGiTSPuzxIdJPr2M-Vic',
                googleCalendarId: 'q14jhdv41fng6q1b2826dp92rs@group.calendar.google.com'
            },
            {
                name: 'Metropolitan Anarchist Coordinating Council of NYC',
                id: 'maccnyc',
                className: 'event-maccnyc',
                url: 'https://tockify.com/api/feeds/ics/mlsupport',
                format: 'ics'
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
                url: 'http://cors.anarchism.nyc/https://www.meetup.com/nycmesh/events/ical/',
                format: 'ics'
            },
            {
                name: 'DEFCON201',
                id: 'defcon201',
                className: 'defcon201',
                url: 'http://cors.anarchism.nyc/https://www.meetup.com/DEFCON201/events/ical/',
                format: 'ics'
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

    document.addEventListener('DOMContentLoaded', function() {
        calendar.render();
    });

    return calendar;
})(); // end IIFE
