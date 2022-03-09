app = (function () { // begin Immediately-Invoked Function Expression
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
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
            right: 'calendars dayGridMonth,timeGridWeek,timeGridDay'
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
                className: 'friendlytoanarchismnyc',
                googleCalendarApiKey: 'AIzaSyCgUpmnFFSyarVFGiTSPuzxIdJPr2M-Vic',
                googleCalendarId: '2om8s9hsd7kkkjcc88kon65i2o@group.calendar.google.com'
            },
            {
                name: 'Metropolitan Anarchist Coordinating Council of NYC',
                id: 'maccnyc',
                className: 'event-maccnyc',
                url: 'https://tockify.com/api/feeds/ics/mlsupport',
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
