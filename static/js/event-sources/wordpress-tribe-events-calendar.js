/**
 * Utility module to support the calendar's WordPress Tribe
 * Events Calendar sources.
 *
 * @see https://theeventscalendar.com/
 */
import { corsbase } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export default function WordPressTribeEvents (optionsObj) {
    this.events = [];
    this.url = new URL(optionsObj.url);
    this.useCorsProxy = optionsObj.useCorsProxy;

    // Set up initial HTTP query.
    var url = this.url;
    var url_start_date = optionsObj.fetchInfo.start.toISOString().replace(/T.*/, ' 00:00:00');
    var url_end_date = optionsObj.fetchInfo.end.toISOString().replace(/T.*/, ' 00:00:00');
    url.searchParams.set('start_date', url_start_date);
    url.searchParams.set('end_date', url_end_date);

    return this.fetchAll(url).then((wp) => {
        optionsObj.successCallback(wp.events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

/**
 * Fetches all pages in a paginated collection and stores them in the
 * the object's `events` member array.
 */
WordPressTribeEvents.prototype.fetchAll = async function (url) {
    await this.fetch(url);
    this.parse();
    while (this.json.next_rest_url) {
        await this.fetch(new URL(this.json.next_rest_url));
        this.parse();
    }
    return this;
};

WordPressTribeEvents.prototype.fetch = async function (url) {
    var url = (this.useCorsProxy)
        ? new URL(`${corsbase}/${url.toString()}`)
        : url;
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

WordPressTribeEvents.prototype.parse = function () {
    this.events = this.events.concat(this.json.events);
    return this;
};

WordPressTribeEvents.prototype.toFullCalendarEventObject = function (e) {
    var geoJSON = (e.venue.geo_lat && e.venue.geo_lng)
        ? {
            type: "Point",
            coordinates: [e.venue.geo_lng, e.venue.geo_lat]
        }
        : null;
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(e.utc_start_date + 'Z'),
        end: new Date(e.utc_end_date + 'Z'),
        url: e.url,
        extendedProps: {
            description: e.description,
            image: e.image.url,
            location: {
                geoJSON: geoJSON,
                eventVenue: {
                    name: e.venue.venue,
                    address: {
                        streetAddress: e.venue.address,
                        addressLocality: e.venue.city,
                        //addressRegion: e.venue.state,
                        postalCode: e.venue.zip,
                        addressCountry: e.venue.country
                    },
                    geo: {
                        latitude: e.venue.geo_lat,
                        longitude: e.venue.geo_lng
                    }
                }
            }
        }
    });
};
