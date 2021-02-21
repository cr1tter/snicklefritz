(function () { // begin Immediately-Invoked Function Expression
    document.addEventListener('DOMContentLoaded', function() {
        var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            eventSources: [
                {
                    // Use the FullCalendar custom JSON feed until its bug #6173 is resolved.
                    // See https://github.com/fullcalendar/fullcalendar/issues/6173
                    url: 'https://techlearningcollective.com/events/all-fullcalendar-io.json'
                },
                {
                    url: 'https://tockify.com/api/feeds/ics/mlsupport',
                    format: 'ics',
                }

                // Bluestockings has not correctly configured CORS headers.
//                {
//                    url: 'https://bluestockings.com/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&no_html=true',
//                    format: 'ics',
//                    title: 'Bluestockings'
//                }
            ],
            eventClick: function (info) {
                info.jsEvent.preventDefault();
                if (info.event.url) {
                    window.open(info.event.url);
                }
            }
        });
        calendar.render();
    });
})(); // end IIFE
