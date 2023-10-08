/**
 * Utility module to support the calendar's EventBrite
 * event sources.
 */
import { useCorsProxy, domparser } from '../utils.js';
import FullCalendarEvent from '../event.js';

export default function EventBrite ( optionsObj ) {
    this.url = new URL(optionsObj.url);

    return this.fetch(this.url).then( ( eb ) => {
        optionsObj.successCallback(eb.parse().events);
    });
};

EventBrite.prototype.fetch = async function (url) {
    var response = await fetch(useCorsProxy(url));
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
