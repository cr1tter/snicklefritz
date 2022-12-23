/**
 * GoDaddy has a calendar widget feature that lets Web
 * site owners post to a Google Calendar and display
 * those events on their Web site.
 *
 * https://www.godaddy.com/help/show-a-public-calendar-on-my-website-24592
 */
import { corsbase } from '../calendar.js';

export const GoDaddyCalendarWidgetSources = [
    {
        name: 'Secret Pour',
        id: 'secret-pour',
        className: 'secret-pour',
        events: async function (fetchInfo, successCallback, failureCallback) {
            // TODO: The exact URL might be different
            //       or change, but the IDs in this
            //       can be scraped from the page's
            //       HTML content itself, probably?
            await new GoDaddy({
                originUrl: 'https://secretpour.com/events',
                url: 'https://calendar.apps.secureserver.net/v1/events/f4b023b5-76b9-43ad-a946-16742fbc9f3f/1e888006-2674-49ab-b9c7-b6bb2abf3e57/936f236b-8d20-4733-ac9c-d1fc34f3ae6e',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

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
    //var response = await fetch(corsbase + '/' + url);
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
    return {
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        url: this.originUrl, // Individual GoDaddy events don't have a URL sadly.
        extendedProps: {
            description: e.desc,
            location: {
                geoJSON: null,
                raw: e.location
            }
        }
    }
}
