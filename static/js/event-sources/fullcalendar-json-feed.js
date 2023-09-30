/**
 * Utility module to support native FullCalendar JSON feed
 * event sources.
 */
const JSONFeedEventSources = [
    {
        name: 'TechLearningCollective.com',
        className: 'event-techlearningcollective',
        id: 'techlearningcollective',
        // Use the FullCalendar custom JSON feed until its bug #6173 is resolved.
        // See https://github.com/fullcalendar/fullcalendar/issues/6173
        url: 'https://techlearningcollective.com/events/all-fullcalendar-io.json',
        color: 'blue'
    }
];
export default JSONFeedEventSources;
