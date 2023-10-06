/**
 * Utility module to support the calendar's WordPress
 * Modern Events Calendar sources.
 *
 * @see https://webnus.net/modern-events-calendar/
 */
import { corsbase, domparser } from '../calendar.js';
import FullCalendarEvent from '../event.js';
import { convert12To24HourTime } from '../utils.js';

export default function ModernEventsCalendarEvents (optionsObj) {
    this.events = [];
    this.useCorsProxy = optionsObj.useCorsProxy;

    var url = new URL(optionsObj.url);

    return this.fetch(url).then((mec) => {
        optionsObj.successCallback(mec.parse().events);
    });
};

ModernEventsCalendarEvents.prototype.fetch = async function (url) {
    this.url = (this.useCorsProxy)
        ? new URL(`${corsbase}/${url.toString()}`)
        : url;
    var response = await fetch(this.url);
    var html;
    try {
        html = await response.text();
    } catch (e) {
        // We'll just print the error, but execution will continue as
        // we have still caught the error.
        console.error(e);
    }
    this.html = html;
    return this;
};

ModernEventsCalendarEvents.prototype.parse = function () {
    var events = [];
    var doc = domparser.parseFromString(this.html, 'text/html');
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(function (el) {
        var times = el.nextElementSibling.querySelector('.mec-event-time').textContent
            .trim().split(' - ').map(convert12To24HourTime);
        var data = FullCalendarEvent.fromSchemaDotOrg(JSON.parse(el.textContent));
        data.start = new Date(`${data.start} ${times[0].join(':')}`);
        data.end = new Date(`${data.end} ${times[1].join(':')}`);
        events.push(data);
    });
    this.events = events;
    return this;
};
