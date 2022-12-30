/**
 * Utility module to support the calendar's WordPress
 * Events Organiser sources.
 *
 * @see https://wp-event-organiser.com
 */
import { corsbase } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export const WordPressEventsOrganiserSources = [
    {
        name: 'The Seneca',
        id: 'the-seneca',
        className: 'the-seneca',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressEventsOrganiser({
                url: corsbase + '/https://www.thesenecanyc.com/wp-admin/admin-ajax.php?action=eventorganiser-fullcal&timeformat=g:i%20a&users_events=false',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function WordPressEventsOrganiser (optionsObj) {
    this.events = [];

    var url = new URL(optionsObj.url);
    var url_start_date = optionsObj.fetchInfo.start.toISOString().replace(/T.*/, '');
    var url_end_date = optionsObj.fetchInfo.end.toISOString().replace(/T.*/, '');
    url.searchParams.set('start', url_start_date);
    url.searchParams.set('end', url_end_date);

    return this.fetch(url).then((eo) => {
        optionsObj.successCallback(eo.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

WordPressEventsOrganiser.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(url);
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        // We'll just print the error, but execution will continue as
        // we have still caught the error.
        console.error(e);
    }
    this.json = json;
    return this;
};

WordPressEventsOrganiser.prototype.parse = function () {
    this.events = this.events.concat(this.json);
    return this;
};

WordPressEventsOrganiser.prototype.toFullCalendarEventObject = function (e) {
    // TODO: This doesn't actually provide venue details, yet.
//    var geoJSON = (e.venue.geo_lat && e.venue.geo_lng)
//        ? {
//            type: "Point",
//            coordinates: [e.venue.geo_lng, e.venue.geo_lat]
//        }
//        : null;
    var url = new URL(e.url);
    url = `${url.origin}/events/event/${url.hash.substring(1)}/`;
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        url: url,
        extendedProps: {
            description: e.description,
            //image: e.image.url, // TODO: Not implemented yet.
            // TODO: Venue/location data not implemented yet.
            location: null // {
//                geoJSON: geoJSON,
//                eventVenue: {
//                    name: e.venue.venue,
//                    address: {
//                        streetAddress: e.venue.address,
//                        addressLocality: e.venue.city,
//                        //addressRegion: e.venue.state,
//                        postalCode: e.venue.zip,
//                        addressCountry: e.venue.country
//                    },
//                    geo: {
//                        latitude: e.venue.geo_lat,
//                        longitude: e.venue.geo_lng
//                    }
//                }
//            }
        }
    });
};
