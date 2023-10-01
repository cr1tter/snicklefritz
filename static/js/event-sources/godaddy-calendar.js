/**
 * GoDaddy has a calendar widget feature that lets Web
 * site owners post to a Google Calendar and display
 * those events on their Web site.
 *
 * https://www.godaddy.com/help/show-a-public-calendar-on-my-website-24592
 */
import FullCalendarEvent from '../event.js';

export default function GoDaddy (optionsObj) {
    var url = new URL(optionsObj.url);
    this.originUrl = optionsObj.originUrl;

    return this.fetch(url).then((gd) => {
        optionsObj.successCallback(gd.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

GoDaddy.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(url);
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
}

GoDaddy.prototype.parse = function () {
    this.events = this.json.events;
    return this;
}

GoDaddy.prototype.toFullCalendarEventObject = function (e) {
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        url: this.originUrl, // Individual GoDaddy events don't have a URL sadly.
        extendedProps: {
            description: e.desc,
            location: {
                geoJSON: null
            }
        }
    });
}
