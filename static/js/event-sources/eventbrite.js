/**
 * Utility module to support the calendar's EventBrite
 * event sources.
 */
import { corsbase, schemaDotOrg2FullCalendar } from '../calendar.js';

const domparser = new DOMParser();

export const EventBriteEventSources = [
    {
        name: 'Brooklyn Comedy Collective',
        id: 'brooklyn-comedy-collective',
        className: 'brooklyn-comedy-collective',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/brooklyn-comedy-collective-27620063469',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Caveat NYC',
        id: 'caveat-nyc',
        className: 'caveat-nyc',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/caveat-13580085802',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Cult 24',
        id: 'cult-24',
        className: 'cult-24',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/24-11905129611',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: "Dave's Lesbian Bar",
        id: 'daves-lesbian-bar',
        className: 'daves-lesbian-bar',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/daves-lesbian-bar-34182605937',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Dyke Beer',
        id: 'dyke-beer',
        className: 'dyke-beer',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/dyke-beer-14414017747',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Geneva Rust-Orta',
        id: 'geneva-rust-orta',
        className: 'geneva-rust-orta',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/geneva-rust-orta-29943238651',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    // Commented out for now until EventBrite function can handle single events
    // with multiple occurrences without displaying as "All Day" events across
    // all occurrences.
    //            {
    //                name: "Good Judy",
    //                id: 'good-judy',
    //                className: 'good-judy',
    //                events: async function (fetchInfo, successCallback, failureCallback) {
    //                    await new EventBrite({
    //    url: 'https://www.eventbrite.com/o/good-judy-31484266863',
    //    fetchInfo: fetchInfo,
    // successCallback: successCallback,
    //  failureCallback: failureCallback
    // });
//                },
//            },
    {
        name: 'House of Yes',
        id: 'house-of-yes',
        className: 'house-of-yes',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/house-of-yes-8534581785',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'House of X',
        id: 'house-of-x',
        className: 'house-of-x',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/house-of-x-35646479823',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'LasReinas',
        id: 'lasreinas',
        className: 'lasreinas',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/lasreinas-2712122890',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Le Organizer',
        id: 'le-organizer',
        className: 'le-organizer',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/le-organizer-11067403290',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Littlefield',
        id: 'littlefield',
        className: 'littlefield',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/littlefield-18046024060',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Newtown Creek Alliance',
        id: 'newtown-creek-alliance',
        className: 'newtown-creek-alliance',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/newtown-creek-alliance-6350090643',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        // They have a Tockify but they did not enable Tockify's ICS feed. :(
        name: 'Pagan\'s Paradise',
        id: 'pagans-paradise',
        className: 'pagans-paradise',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/pagans-paradise-16960673418',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Queer Social',
        id: 'queer-social',
        className: 'queer-social',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/queer-social-18203994164',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Secret Loft',
        id: 'secret-loft',
        className: 'secret-loft',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/secret-loft-11841101530',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'TV Eye',
        id: 'tv-eye',
        className: 'tv-eye',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/tv-eye-28766931741',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Bell House',
        id: 'the-bell-house',
        className: 'the-bell-house',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/the-bell-house-17899492469',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Nova Experiment',
        id: 'the-nova-experiment',
        className: 'the-nova-experiment',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/the-nova-experiment-17863009866',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Sultan Room',
        id: 'the-sultan-room',
        className: 'the-sultan-room',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/the-sultan-room-18078001345',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Union Hall',
        id: 'union-hall',
        className: 'the-sultan-room',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/union-hall-17899496497',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function EventBrite (optionsObj) {
    var url = new URL(optionsObj.url);

    return this.fetch(url).then((eb) => {
        optionsObj.successCallback(eb.parse().events);
    })
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
    this.events = schemaDotOrg2FullCalendar(this.json);
    return this;
};
