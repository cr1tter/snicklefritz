/**
 * Utility module to support the calendar's Tockify
 * event sources.
 */
import { corsbase } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export const TockifyEventSources = [
    {
        name: 'Bushwick Daily',
        id: 'bushwick-daily',
        className: 'bushwick-daily',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Tockify({
                url: `https://tockify.com/api/ngevent?max=100&calname=bushwickdaily&start-inclusive=true&longForm=true&showAll=true&startms=${new Date().getTime()}`,
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Metropolitan Anarchist Coordinating Council of NYC',
        id: 'maccnyc',
        className: 'event-maccnyc',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Tockify({
                url: `https://tockify.com/api/ngevent?max=100&calname=mlsupport&start-inclusive=true&longForm=true&showAll=true&startms=${new Date().getTime()}`,
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function Tockify (optionsObj) {
    var url = new URL(optionsObj.url);
    return this.fetch(url).then((t) => {
        optionsObj.successCallback(t.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

Tockify.prototype.fetch = async function (url) {
    this.url = new URL(url);
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
    return new FullCalendarEvent({
        title: e.content.summary.text,
        start: start.setTime(e.when.start.millis),
        end: end.setTime(e.when.end.millis),
        url: url,
        extendedProps: {
            description: e.content.description.text,
            image: null,
            location: {
                geoJSON: {
                    type: "Point",
                    coordinates: [
                        e.content?.location?.longitude,
                        e.content?.location?.latitude
                    ]
                },
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
