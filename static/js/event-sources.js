/**
 * List of Full Calendar Event Sources.
 */
import { GoogleCalendarEventSources } from './google-calendar.js';
import { SquarespaceEventSources } from './squarespace.js';
import { WordPressTribeEventsCalendarSources } from './wordpress-tribe-events-calendar.js';

const EventSources = [].concat(
    GoogleCalendarEventSources.map((i) => {
        i.color = 'gray';
        return i;
    }),
    SquarespaceEventSources.map((i) => {
        i.color = 'white';
        i.textColor = 'black';
        return i;
    }),
    WordPressTribeEventsCalendarSources.map((i) => {
        i.color = (i.color) ? i.color : 'blue';
        return i;
    })
);

export default EventSources;
