/**
 * Utility module to support the calendar's Squarespace
 * event sources.
 */
import { corsbase } from './calendar.js';

export const SquarespaceEventSources = [
    {
        name: 'Club Cumming',
        id: 'club-cumming',
        className: 'club-cumming',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://clubcummingnyc.com/schedule?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Hot Rabbit',
        id: 'hot-rabbit',
        className: 'hot-rabbit',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.hotrabbit.com/new-events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Market Hotel',
        id: 'market-hotel',
        className: 'market-hotel',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.markethotel.org/calendar?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Talon Bar',
        id: 'talon-bar',
        className: 'talon-bar',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.talonbar.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Nest Brooklyn',
        id: 'the-nest-brooklyn',
        className: 'the-nest-brooklyn',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.thenestbrooklyn.com/event-calender?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Taillor Group',
        id: 'the-taillor-group',
        className: 'the-taillor-group',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.taillors.com/calendar?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Trans Pecos',
        id: 'trans-pecos',
        className: 'trans-pecos',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.thetranspecos.com/cal?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Wonderville',
        id: 'wonderville',
        className: 'wonderville',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.wonderville.nyc/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function Squarespace (optionsObj) {
    return this.fetch(optionsObj.url).then((ss) => {
        optionsObj.successCallback(ss.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    })
};

Squarespace.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(corsbase + '/' + url);
    var json = await response.json();
    this.json = json;
    return this;
};

Squarespace.prototype.parse = function () {
    this.events = this.json.upcoming || this.json.items;
    return this;
};

Squarespace.prototype.toFullCalendarEventObject = function (e) {
    return {
        title: e.title,
        start: e.startDate,
        end: e.endDate,
        url: new URL(this.url).origin + e.fullUrl
    }
}
