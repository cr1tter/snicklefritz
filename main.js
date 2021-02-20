(function () { // begin Immediately-Invoked Function Expression
    document.addEventListener('DOMContentLoaded', function() {
        var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
            eventSources: [
                {
                    url: 'https://techlearningcollective.com/events/all.ics',
                    format: 'ics',
                    title: 'Tech Learning Collective'
                },
                {
                    url: 'https://tockify.com/api/feeds/ics/mlsupport',
                    format: 'ics',
                    title: 'MACC events'
                },
                {
                    url: 'https://bluestockings.com/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&no_html=true',
                    format: 'ics',
                    title: 'Bluestockings'
                }
            ]
        });
        calendar.render();
    });
})(); // end IIFE
