/**
 * Utility module to support the calendar's Forbidden Tickets
 * event sources published at https://ForbiddenTickets.com.
 */
import { useCorsProxy } from '../utils.js';
import FullCalendarEvent from '../event.js';

export default function ForbiddenTickets ( optionsObj ) {
    this.url = new URL(optionsObj.url);

    return this.fetch(this.url).then( ( ft ) => {
        optionsObj.successCallback(ft.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    } );
};

ForbiddenTickets.prototype.fetch = async function ( url ) {
    var response = await fetch(useCorsProxy(url));
    var json = {};
    try {
        var json = await response.json();
    }
    catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
};

ForbiddenTickets.prototype.parse = function () {
    this.events = this.json;
    return this;
};

ForbiddenTickets.prototype.toFullCalendarEventObject = function ( e ) {
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(`${e.start}Z`),
        end: new Date(`${e.end}Z`),
        url: new URL(e.url),
        extendedProps: {
            description: e.title,
            //image: e.assetUrl, // Not provided by the event source.
            location: {
                // Not provided by the event source.
                //geoJSON: {
                //    type: "Point",
                //    coordinates: [e.location.mapLng, e.location.mapLat]
                //},
                eventVenue: {
                    name: e.location
                    // Not provided by the event source.
                    //address: {
                    //    streetAddress: e.location.addressLine1,
                    //    addressLocality: e.location.addressLine2.split(',')[0].trim(),
                    //    addressRegion: e.location.addressLine2.split(',')[1].trim(),
                    //    postalCode: e.location.addressLine2.split(',')[2].trim(),
                    //    addressCountry: e.location.addressCountry
                    //},
                    //geo: {
                    //    latitude: e.location.mapLat,
                    //    longitude: e.location.mapLng,
                    //}
                },
            },
            raw: e
        }
    });
}
