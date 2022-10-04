/**
 * Utility module to support the calendar's SeeTickets 
 * Events Calendar sources.
 *
 * @see https://seetickets.us/
 */
import { corsbase } from '../calendar.js';

export const SeeTicketsEventsCalendarSources = [
    {
        name: 'Baby\'s All Right',
        id: 'babys-all-right',
        className: 'babys-all-right',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new SeeTicketsEvents({
                // From https://wl.seetickets.us/BabysAllRightBrooklyn
                url: corsbase + '/https://wl.seetickets.us/wafform.aspx?_act=eventcalendarwidget&AJAX=1&FetchEvents=1&_pky=6066969&afflky=BabysAllRightBrooklyn',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function SeeTicketsEvents (optionsObj) {
    this.events = [];

    var url = new URL(optionsObj.url);
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

SeeTicketsEvents.prototype.fetch = async function (url) {
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

SeeTicketsEvents.prototype.parse = function () {
    this.events = this.events.concat(this.json);
    return this;
};

SeeTicketsEvents.prototype.toFullCalendarEventObject = function (e) {
    return {
        title: e.title,
        start: new Date(e.start),
        url: e.url.match(/href='(.*)';$/)[1] || e.url
    };
}
