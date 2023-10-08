/**
 * Utility module to support the calendar's SeeTickets 
 * Events Calendar sources.
 *
 * @see https://seetickets.us/
 */
import { useCorsProxy } from '../utils.js';
import FullCalendarEvent from '../event.js';

export default function SeeTicketsEvents ( optionsObj ) {
    this.events = [];
    this.location = optionsObj.location;
    this.url = optionsObj.url;

    var url = new URL(this.url);
    var url_start_date = optionsObj.fetchInfo.start.getTime() / 1000;
    var url_end_date = optionsObj.fetchInfo.end.getTime() / 1000;
    url.searchParams.set('start', url_start_date);
    url.searchParams.set('end', url_end_date);

    return this.fetch(url).then((st) => {
        optionsObj.successCallback(st.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

SeeTicketsEvents.prototype.fetch = async function ( url ) {
    var response = await fetch(useCorsProxy(this.url));
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

SeeTicketsEvents.prototype.parse = function () {
    this.events = this.events.concat(this.json);
    return this;
};

SeeTicketsEvents.prototype.toFullCalendarEventObject = function (e) {
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(e.start),
        url: e.url.match(/href='(.*)';$/)[1] || e.url,
        // SeeTickets doesn't provide location data in their API
        // so we instead use our own knowledge of the event source.
        extendedProps: {
            location: this.location
        }
    });
}
