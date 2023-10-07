/**
 * Utility module to support the calendar's Tockify
 * event sources.
 */
import { corsbase } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export default function Tockify (optionsObj) {
    var url = new URL(optionsObj.url);
    url.searchParams.append('startms', optionsObj.fetchInfo.start.getTime());
    this.url = url;
    return this.fetch(this.url).then((t) => {
        optionsObj.successCallback(t.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

Tockify.prototype.fetch = async function (url) {
    var response = await fetch(url);
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        console.error(e);
    }
    this.json = json;
    return this
}

Tockify.prototype.parse = function () {
    this.events = this.json.events;
    return this;
}

Tockify.prototype.toFullCalendarEventObject = function (e) {
    var start = new Date();
    var end  = new Date();
    var url = (e.content.customButtonLink)
        ? e.content.customButtonLink
        : `${this.url.origin}/${this.url.searchParams.get('calname')}/detail/${e.eid.uid}/${e.eid.tid}`;
    var geoJSON = (e.content.location?.latitude && e.content.location?.longitude)
        ? {
            type: "Point",
            coordinates: [
                e.content.location.longitude,
                e.content.location.latitude
            ]
        } : null;
    return new FullCalendarEvent({
        title: e.content.summary.text,
        start: start.setTime(e.when.start.millis),
        end: end.setTime(e.when?.end?.millis),
        url: url,
        extendedProps: {
            description: e.content.description.text,
            image: null,
            location: {
                geoJSON: geoJSON,
                eventVenue: {
                    name: e.content.place,
                    address: {
                        streetAddress: e.content?.location?.c_street,
                        addressLocality: e.content?.location?.c_locality,
                        addressRegion: e.content?.location?.c_region,
                        postalCode: e.content?.location?.c_postcode,
                        addressCountry: e.content?.location?.c_country
                    },
                    geo: {
                        latitude: e.content?.location?.latitude,
                        longitude: e.content?.location?.longitude
                    }
                }
            },
            raw: e
        }
    });
}
