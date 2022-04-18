/**
 * List of Full Calendar Event Sources.
 *
 * This file aggregates the full list of FullCalendar Event
 * Sources used in this calendar. Individual Event Sources
 * might need to be transformed in different ways so they are
 * given their own ECMAScript Module file where they are made
 * compatible, if necessary. Then they're all concatenated
 * into one big array, here.
 *
 * @TODO: Can we paralellize this in some way to make initial
 *        loading ("time to first (calendar) paint") faster?
 */
import { EventBriteEventSources } from './event-sources/eventbrite.js';
import { GoogleCalendarEventSources } from './event-sources/google-calendar.js';
import { SquarespaceEventSources } from './event-sources/squarespace.js';
import { WordPressTribeEventsCalendarSources } from './event-sources/wordpress-tribe-events-calendar.js';
import { JSONFeedEventSources } from './event-sources/fullcalendar-json-feed.js';
import { IcalendarEventSources } from './event-sources/icalendar.js';

const EventSources = [].concat(
    EventBriteEventSources.map((i) => {
        i.color = 'red';
        return i;
    }),
    GoogleCalendarEventSources.map((i) => {
        i.color = 'gray';
        return i;
    }),
    JSONFeedEventSources.map((i) => {
        return i;
    }),
    IcalendarEventSources.map((i) => {
        i.color = (i.color) ? i.color : 'black';
        i.textColor = (i.textColor) ? i.textColor : 'white';
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
