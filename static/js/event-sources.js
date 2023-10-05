/**
 * List of Full Calendar Event Sources.
 *
 * This file aggregates the full list of FullCalendar Event
 * Sources used in this calendar. Individual Event Sources
 * might need to be transformed in different ways so they are
 * given their own ECMAScript Module file where they are made
 * compatible, if necessary. Then they're all concatenated
 * into one big `EventSources` array, here.
 */
// Site-specific event source data is loaded first.
import { default as EventSourceData } from './event-source-data.js';

// Each event source module/scraper/transformer is loaded next, as we
// will need access to their prototype object.
let EventConstructors = {};
import { default as Dice } from './event-sources/dice.js';
EventConstructors.Dice = Dice;
import { default as EventBrite } from './event-sources/eventbrite.js';
EventConstructors.EventBrite = EventBrite;
import { default as GoDaddy } from './event-sources/godaddy-calendar.js';
EventConstructors.GoDaddy = GoDaddy;
import { default as GoogleCalendar } from './event-sources/google-calendar.js';
EventConstructors.GoogleCalendar = GoogleCalendar;
import { default as SeeTicketsEvents } from './event-sources/seetickets.js';
EventConstructors.SeeTicketsEvents = SeeTicketsEvents;
import { default as Squarespace } from './event-sources/squarespace.js';
EventConstructors.Squarespace = Squarespace;
import { default as Tockify } from './event-sources/tockify.js';
EventConstructors.Tockify = Tockify;
import { default as WithFriends } from './event-sources/withfriends.js';
EventConstructors.WithFriends = WithFriends;
import { default as WordPressEventsOrganiser } from './event-sources/wordpress-events-organiser.js';
EventConstructors.WordPressEventsOrganiser = WordPressEventsOrganiser;
import { default as WordPressTribeEvents } from './event-sources/wordpress-tribe-events-calendar.js';
EventConstructors.WordPressTribeEvents = WordPressTribeEvents;

// Finally, we loop over the site-specific data and for each type of
// event source we construct an object for FullCalendar to make use of
// except for the `one-off` event sources, as they're currently
// complete FullCalendar objects.
const EventSources = EventSourceData.flatMap(function (element, index, array) {
    return ( 'one-off' === element.sourceType ) ? element.sources : element.sources.map(function (source) {
        // This is the object we'll return.
        var eventSourceObject = {};

        // First add any options set on the event source type level.
        if ( element.options ) {
            Object.assign(eventSourceObject, element.options);
        }

        // Next, assign properties based on the event source itself.
        // This is really a superset of the FullCalendar-supported
        // event source object options described in their docs:
        //     https://fullcalendar.io/docs/event-source-object#options
        Object.assign(eventSourceObject, {
            // Options we define.
            location: source.location,         // for static venue map pins.
            useCorsProxy: source.useCorsProxy, // for automatically munging the URL
            originUrl: source.originUrl,       // for GoDaddy API.
            movementId: source.movementId,     // for WithFriends scraper.

            // General Event Source Options defined by FullCalendar.
            name: source.name,
            id: source.id,
            className: source.className,

            // Set these (and only these?) conditionally.
            ...( source.backgroundColor && { backgroundColor: source.backgroundColor }),
            ...( source.color && { color: source.color }),
            ...( source.textColor && { textColor: source.textColor }),

            // The other possible FC-supported options.
            allow: source.allow,
            constraint: source.constraint,
            defaultAllDay: source.defaultAllDay,
            display: source.display,
            durationEditable: source.durationEditable,
            editable: source.editable,
            eventDataTransform: source.eventDataTransform,
            failure: source.failure,
            overlap: source.overlap,
            resourceEditable: source.resourceEditable,
            startEditable: source.startEditable,
            success: source.success,

            // FullCalendar-defined options for JSON or iCalendar feeds.
            url: source.url,
            format: element?.options?.format,

            // FullCalendar-defined options for JSON feeds only.
            // https://fullcalendar.io/docs/events-json-feed#options
            method: ( source.method ) ? source.method : 'GET',
            extraParams: source.extraParams,
            startParam: source.startParam,
            endParam: source.endParam,
            timeZoneParam: source.timeZoneParam,

            // FullCalendar-defined options for Google Calendar API.
            // https://fullcalendar.io/docs/google-calendar
            googleCalendarId: source.googleCalendarId,
            googleCalendarApiKey: source.googleCalendarApiKey
        });

        // The FullCalendar-defined `events` function callback.
        // This is what we use for most of the event sources.
        eventSourceObject.events = async function (fetchInfo, successCallback, failureCallback) {
            await new EventConstructors[element.sourceType](Object.assign(eventSourceObject, {
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback,
            }));
        };

        // Natively supported source types don't use an `events` function.
        switch ( element.sourceType ) {
            case 'ics':
            case 'json':
                delete eventSourceObject.events;
                break;
            default:
                // Special case for when we're using Google
                // Calendar API proper.
                // TODO: This should probably be treated as
                // a different "source type" but, meh.
                if ( source.googleCalendarApiKey ) {
                    delete eventSourceObject.events;
                }
                break;
        }

        return eventSourceObject;
    });
});

export default EventSources;
