/**
 * Utility module to support the calendar's WordPress Tribe
 * Events Calendar sources.
 *
 * @see https://theeventscalendar.com/
 */
import { corsbase } from '../calendar.js';

export const WordPressTribeEventsCalendarSources = [
    {
        name: 'Flux Factory',
        id: 'flux-factory',
        className: 'flux-factory',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: corsbase + '/http://www.fluxfactory.org/wp-json/tribe/events/v1/events?per_page=50&geoloc=true&geoloc_lat=40.7127837&geoloc_lng=-74.00594130000002',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        },
        color: '#597432',
        textColor: '#FFF'
    },
    {
        name: 'GoMag',
        id: 'gomag',
        className: 'gomag',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: corsbase + '/http://gomag.com/wp-json/tribe/events/v1/events?per_page=50&geoloc=true&geoloc_lat=40.7127837&geoloc_lng=-74.00594130000002',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        },
        color: '#ed008c'
    },
    {
        name: 'Lesbian Sex Mafia',
        id: 'lesbian-sex-mafia',
        className: 'lesbian-sex-mafia',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: corsbase + '/https://lesbiansexmafia.org/wp-json/tribe/events/v1/events?per_page=50&geoloc=true&geoloc_lat=40.7127837&geoloc_lng=-74.00594130000002',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        },
        color: '#000',
        textColor: '#FFF'
    },
    {
        name: 'The Eulenspiegel Society',
        id: 'the-eulenspiegel-society',
        className: 'the-eulenspiegel-society',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: corsbase + '/https://www.tes.org/wp-json/tribe/events/v1/events?per_page=50&geoloc=true&geoloc_lat=40.7127837&geoloc_lng=-74.00594130000002',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        },
        color: '#000',
        textColor: '#FFF'
    },
    {
        name: 'The Brick',
        id: 'the-brick',
        className: 'the-brick',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: corsbase + '/https://www.bricktheater.com/wp-json/tribe/events/v1/events?per_page=50',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        },
        color: '#ed008c'
    },
    {
        name: 'The People\'s Forum',
        id: 'the-peoples-forum',
        className: 'the-peoples-forum',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: 'https://peoplesforum.org/wp-json/tribe/events/v1/events?per_page=50',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'WOW Cafe Theatre',
        id: 'wow-cafe-theatre',
        className: 'wow-cafe-theatre',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WordPressTribeEvents({
                url: 'https://www.wowcafe.org/wp-json/tribe/events/v1/events',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function WordPressTribeEvents (optionsObj) {
    this.events = [];

    var url = new URL(optionsObj.url);
    var url_start_date = optionsObj.fetchInfo.start.toISOString().replace(/T.*/, ' 00:00:00');
    var url_end_date = optionsObj.fetchInfo.end.toISOString().replace(/T.*/, ' 00:00:00');
    url.searchParams.set('start_date', url_start_date);
    url.searchParams.set('end_date', url_end_date);

    return this.fetchAll(url).then((wp) => {
        optionsObj.successCallback(wp.events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

/**
 * Fetches all pages in a paginated collection and stores them in the
 * the object's `events` member array.
 */
WordPressTribeEvents.prototype.fetchAll = async function (url) {
    await this.fetch(url);
    this.parse();
    while (this.json.next_rest_url) {
        let u = (url.host === new URL(corsbase).host)
            ? corsbase + '/' + this.json.next_rest_url
            : this.json.next_rest_url;
        await this.fetch(u);
        this.parse();
    }
    return this;
};

WordPressTribeEvents.prototype.fetch = async function (url) {
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

WordPressTribeEvents.prototype.parse = function () {
    this.events = this.events.concat(this.json.events);
    return this;
};

WordPressTribeEvents.prototype.toFullCalendarEventObject = function (e) {
    return {
        title: e.title,
        start: new Date(e.utc_start_date + 'Z'),
        end: new Date(e.utc_end_date + 'Z'),
        url: e.url
    };
}
