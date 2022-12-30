/**
 * Utility module to support the calendar's Squarespace
 * event sources.
 */
import { corsbase } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export const SquarespaceEventSources = [
    {
        name: '3 Dollar Bill',
        id: 'three-dollar-bill',
        className: 'three-dollar-bill',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.3dollarbillbk.com/rsvp?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Avant Gardner',
        id: 'avant-gardner',
        className: 'avant-gardner',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.avant-gardner.com/?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Black Flamingo',
        id: 'black-flamingo',
        className: 'black-flamingo',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.blackflamingonyc.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Brooklyn Art Cave',
        id: 'brooklyn-art-cave',
        className: 'brooklyn-art-cave',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.brooklynartcave.com/events-one?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Cherry on Top',
        id: 'cherry-on-top',
        className: 'cherry-on-top',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.cherryontopnyc.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
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
        name: 'Mood Ring',
        id: 'mood-ring',
        className: 'mood-ring',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://moodringnyc.squarespace.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Morbid Anatomy',
        id: 'morbid-anatomy',
        className: 'morbid-anatomy',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.morbidanatomy.org/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Nowhere Bar',
        id: 'nowhere-bar',
        className: 'nowhere-bar',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.nowherebarnyc.com/new-events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'NYC Dyke March',
        id: 'nyc-dyke-march',
        className: 'nyc-dyke-march',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.nycdykemarch.com/upcoming-events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Nook BK',
        id: 'nook-bk',
        className: 'nook-bk',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://nookbk.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'POWRPLNT',
        id: 'powrplnt',
        className: 'powrplnt',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.powrplnt.org/calendar-5?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Scope Tonight',
        id: 'scope-tonight',
        className: 'scope-tonight',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.scopetonight.com/scope-events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'TailGate Brooklyn',
        id: 'tailgate-brooklyn',
        className: 'tailgate-brooklyn',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.tailgatebk.com/events-one?format=json',
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
        name: 'The Broadway',
        id: 'the-broadway',
        className: 'the-broadway',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.thebroadway.nyc/showcalendar?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Q NYC',
        id: 'the-q-nyc',
        className: 'the-q-nyc',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://theqnyc.com/events?format=json',
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
        name: 'The Tank',
        id: 'the-tank',
        className: 'the-tank',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://thetanknyc.org/calendar-1/?format=json',
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
        name: 'Wandering Barman',
        id: 'wandering-barman',
        className: 'wandering-barman',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.wanderingbarman.com/events?format=json',
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
    },
    {
        name: 'Yu and Me Books',
        id: 'yu-and-me-books',
        className: 'yu-and-me-books',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Squarespace({
                url: 'https://www.yuandmebooks.com/events?format=json',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function Squarespace (optionsObj) {
    var url = new URL(optionsObj.url);
    // TODO: Fetch next month's events, but only after a view change.
//    var url_start_date = (optionsObj.fetchInfo.start.getMonth() + 1).toString().padStart(2, '0')
//        + '-' + optionsObj.fetchInfo.start.getFullYear();
//    url.searchParams.set('month', url_start_date);

    return this.fetch(url).then((ss) => {
        optionsObj.successCallback(ss.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
};

Squarespace.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(corsbase + '/' + url);
    var json = {};
    try {
        var json = await response.json();
    }
    catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
};

Squarespace.prototype.parse = function () {
    this.events = this.json.upcoming || this.json.items;
    return this;
};

Squarespace.prototype.toFullCalendarEventObject = function (e) {
    return new FullCalendarEvent({
        title: e.title,
        start: e.startDate,
        end: e.endDate,
        url: new URL(this.url).origin + e.fullUrl,
        extendedProps: {
            description: e.body,
            image: e.assetUrl,
            location: {
                geoJSON: {
                    type: "Point",
                    coordinates: [e.location.mapLng, e.location.mapLat]
                },
                eventVenue: {
                    name: e.location.addressTitle,
                    address: {
                        streetAddress: e.location.addressLine1,
                        // TODO: Some of these are not provided.
//                        addressLocality: e.location.addressLine2.split(',')[0].trim(),
//                        addressRegion: e.location.addressLine2.split(',')[1].trim(),
//                        postalCode: e.location.addressLine2.split(',')[2].trim(),
                        addressCountry: e.location.addressCountry
                    },
                    geo: {
                        latitude: e.location.mapLat,
                        longitude: e.location.mapLng,
                    }
                },
            },
            raw: e
        }
    });
}
