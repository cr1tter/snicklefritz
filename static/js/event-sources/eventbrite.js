/**
 * Utility module to support the calendar's EventBrite
 * event sources.
 */
import { corsbase, domparser } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export const EventBriteEventSources = [
    {
        name: 'AdHoc Presents',
        id: 'adhoc-presents',
        className: 'adhoc-presents',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/adhoc-presents-new-york-17573655465',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Alphaville',
        id: 'alphaville',
        className: 'alphaville',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/alphaville-52151572343',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'ArtCrawl Harlem',
        id: 'artcrawl-harlem',
        className: 'artcrawl-harlem',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/artcrawl-harlem-33584703715',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Barnard Vagelos Computational Science Center',
        id: 'barnard-vagelos-computational-science-center',
        className: 'barnard-vagelos-computational-science-center',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/barnard-vagelos-computational-science-center-34292236013',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Big Milk',
        id: 'big-milk',
        className: 'big-milk',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/big-milk-43187278483',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
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
        name: 'Brooklyn Psychedelic Society',
        id: 'brooklyn-psychedelic-society',
        className: 'brooklyn-psychedelic-society',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/brooklyn-psychedelic-society-46486784473',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Brooklyn Transcore',
        id: 'brooklyn-transcore',
        className: 'brooklyn-transcore',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/brooklyn-transcore-54036656203',
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
        name: 'CUNY Anthropology Department',
        id: 'cuny-anthropology-department',
        className: 'cuny-anthropology-department',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/anthropology-department-53111918033',
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
        name: 'Farm to People',
        id: 'farm-to-people',
        className: 'farm-to-people',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/farm-to-people-19804387040',
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
        name: 'I\'m Baby x Kaylita',
        id: 'im-baby-x-kaylita',
        className: 'im-baby-x-kaylita',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/im-baby-x-kaylita-40383327263',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Soo Intoit and RoiiiBoiiii',
        id: 'soo-intoit-and-roiii-boiiii',
        className: 'soo-intoit-and-roiii-boiiii',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/soo-intoit-amp-roiiiboiiii-49152333613',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Lakeside Prospect Park',
        id: 'lakeside-prospect-park',
        className: 'lakeside-prospect-park',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/lakeside-prospect-park-8423162270',
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
        name: 'Miss Bloom Sex Educator',
        id: 'miss-bloom-sex-educator',
        className: 'miss-bloom-sex-educator',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/miss-bloom-sex-educator-31043208919',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Museum of Reclaimed Urban Space (MoRUS)',
        id: 'morus',
        className: 'morus',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/museum-of-reclaimed-urban-space-18102992064',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'New Women Space',
        id: 'new-women-space',
        className: 'new-women-space',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/new-women-space-28254425133',
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
        name: 'Nicole (@fruitqueer)',
        id: 'nicole-fruitqueer',
        className: 'nicole-fruitqueer',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/nicole-54434531973',
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
        name: 'Parker RopeBoi',
        id: 'parker-ropeboi',
        className: 'parker-ropeboi',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/parker-ropeboi-2021938181',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Party Dad',
        id: 'party-dad',
        className: 'party-dad',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/party-dad-54407191923',
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
        name: 'QueerSpace NYC',
        id: 'queerspace-nyc',
        className: 'queerspace-nyc',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/queerspace-nyc-46274508873',
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
        name: 'Sundown Bar (Sundownstairs)',
        id: 'sundown-bar-sundownstairs',
        className: 'sundown-bar-sundownstairs',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/sundownstairs-59227590153',
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
        name: 'The Future Now',
        id: 'the-future-now',
        className: 'the-future-now',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/the-future-now-41195140453',
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
    },
    {
        name: 'Wet Spot',
        id: 'wet-spot',
        className: 'wet-spot-room',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/wet-spot-33199977351',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Zara Franke/Lucy Gaehring',
        id: 'zara-franke-lucy-gaehring',
        className: 'zara-franke-lucy-gaehring',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new EventBrite({
                url: 'https://www.eventbrite.com/o/zara-frankelucy-gaehring-58162939403',
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
