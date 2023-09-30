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

// These are natively-supported event source types.
// They don't need or use object constructors.
import { default as JSONFeedEventSources } from './event-sources/fullcalendar-json-feed.js';
import { default as IcalendarEventSources } from './event-sources/icalendar.js';

// Finally, we loop over the site-specific data and
// for each type of event source we construct an
// object for FullCalendar to make use of.
const EventSources = EventSourceData.flatMap(function (element, index, array) {
    return element.sources.map(function (source) {
        var obj = {
            name: source.name,
            id: source.id,
            className: source.className,
            events: async function (fetchInfo, successCallback, failureCallback) {
                await new EventConstructors[element.sourceType]({
                    originUrl: (source.originUrl) ? source.originUrl : null,
                    url: source.url,
                    fetchInfo: fetchInfo,
                    successCallback: successCallback,
                    failureCallback: failureCallback,
                    headers: (source.headers) ? source.headers : {},
                    location: (source.location) ? source.location : {},
                    movementId: (source.movementId) ? source.movementId : {}
                });
            }
        };
        if ( element.options ) {
            Object.assign(obj, element.options, source.options);
        }
        // Special case for when we're using Google
        // Calendar API proper.
        // TODO: This should probably be treated as
        // a different "source type" but, meh.
        if ( element.googleCalendarApiKey ) {
            delete obj.events;
            obj.googleCalendarApiKey = element.googleCalendarApiKey;
            obj.googleCalendarId = element.googleCalendarId;
        }
        return obj;
    });
}).concat(
    // These sources require no manipulation, as
    // they're natively understood by FullCalendar,
    // so we just add them as-is to our source list.
    JSONFeedEventSources,
    IcalendarEventSources
);

export default EventSources;
