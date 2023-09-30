/**
 * Utility module to support the calendar's EventBrite
 * event sources.
 */
import { corsbase, domparser } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export default function EventBrite (optionsObj) {
    var url = new URL(optionsObj.url);

    return this.fetch(url).then((eb) => {
        optionsObj.successCallback(eb.parse().events);
    });
};

EventBrite.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(corsbase + '/' + url);
    var json = {}
    try {
        var html = await response.text();
        var doc = domparser.parseFromString(html, 'text/html');
        json = JSON.parse(doc.querySelectorAll('script[type="application/ld+json"]')[1].innerText);
    }
    catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
};

/**
 * @TODO Parse individual occurrences instead of treating as one long event.
 */
EventBrite.prototype.parse = function () {
    this.events = this.json.map(FullCalendarEvent.fromSchemaDotOrg);
    return this;
};
