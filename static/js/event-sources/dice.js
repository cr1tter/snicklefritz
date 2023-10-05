/**
 * Utility module to support the calendar's Squarespace
 * event sources.
 */
import FullCalendarEvent from '../event.js';

export default function Dice (optionsObj) {
    var url = optionsObj.url;
    this.requestHeaders = optionsObj.extraParams.headers;
    return this.fetch(url).then((dice_events) => {
        optionsObj.successCallback(dice_events.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

Dice.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(url, {
        headers: this.requestHeaders
    });
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
}

Dice.prototype.parse = function () {
    this.events = this.json.data;
    return this;
}

Dice.prototype.toFullCalendarEventObject = function (e) {
    return new FullCalendarEvent({
        title: e.name,
        start: e.date,
        end: e.date_end,
        url: e.url,
        extendedProps: {
            description: e.raw_description,
            image: e?.event_images?.square,
            location: {
                geoJSON: {
                    type: "Point",
                    coordinates: [e.location.lng, e.location.lat]
                },
                eventVenue: {
                    name: e.venue,
                    address: {
                        streetAddress: e.location.street,
                        addressLocality: e.location.city,
                        addressRegion: e.location.state,
                        postalCode: e.location.zip,
                        addressCountry: e.location.country
                    },
                    geo: {
                        latitude: e.location.lat,
                        longitude: e.location.lng
                    }
                }
            }
        }
    });
}
