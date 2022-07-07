/**
 * Utility module to support the calendar's Squarespace
 * event sources.
 */

export const DiceEventSources = [
    {
        name: "C'mon Everybody",
        id: 'cmon-everybody',
        className: 'cmon-everybody',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Dice({
                // Pulled from https://www.cmoneverybody.com/events
                url: 'https://events-api.dice.fm/v1/events?page%5Bsize%5D=24&types=linkout,event&filter%5Bvenues%5D%5B%5D=C%27mon%20Everybody&filter%5Bvenues%5D%5B%5D=Cmon%20Everybody',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback,
                headers: {
                    'x-api-key': 'PyghT2k59li4oGXIef8t4Git2vRl58H7WAuUJGpd'
                }
            });
        }
    },
    {
        name: 'Our Wicked Lady',
        id: 'our-wicked-lady',
        className: 'our-wicked-lady',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Dice({
                // Pulled from https://www.ourwickedlady.com/
                url: 'https://events-api.dice.fm/v1/events?page[size]=24&types=linkout,event&filter[promoters][]=Our%20Wicked%20Lady%20LLC',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback,
                headers: {
                   'x-api-key': 'vgtVSu5LGc3TMBuE36FwF1hn26kkt6xi5ThPJrqg'
                }
            });
        }
    },
    {
        name: 'Purgatory BK',
        id: 'purgatory-bk',
        className: 'purgatory-bk',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Dice({
                // Pulled from https://www.purgatorybk.com/events
                url: 'https://events-api.dice.fm/v1/events?page%5Bsize%5D=24&types=linkout,event&filter%5Bvenues%5D%5B%5D=purgatory&filter%5Bvenues%5D%5B%5D=Purgatory&filter%5Bvenues%5D%5B%5D=Purgatory%20Events%20LLC',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback,
                headers: {
                   'x-api-key': 'VKEBoWiYzJ9uJ8tjR15aD6lL4RnUz8hb4kIYYxFA'
                }
            });
        }
    },
    {
        name: 'Union Pool',
        id: 'union-pool',
        className: 'union-pool',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new Dice({
                // Pulled from https://www.union-pool.com/calendar
                url: 'https://events-api.dice.fm/v1/events?page%5Bsize%5D=24&types=linkout,event&filter%5Bpromoters%5D%5B%5D=Loop%20De%20Lou%20Production%20Corp%20dba%20Union%20Pool&filter%5Bflags%5D%5B%5D=going_ahead&filter%5Bflags%5D%5B%5D=postponed&filter%5Bflags%5D%5B%5D=rescheduled',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback,
                headers: {
                   'x-api-key': '7rU0bJyVtM5s3vDdYNiuQ4UtDo6pAnmH1QgXsI7E'
                }
            });
        }
    }
];

export default function Dice (optionsObj) {
    var url = optionsObj.url;
    this.requestHeaders = optionsObj.headers;
    return this.fetch(url).then((dice_events) => {
        optionsObj.successCallback(dice_events.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

Dice.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(url, {
        headers: this.requestHeaders
    });
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
}

Dice.prototype.parse = function () {
    this.events = this.json.data;
    return this;
}

Dice.prototype.toFullCalendarEventObject = function (e) {
    return {
        title: e.name,
        start: e.date,
        end: e.date_end,
        url: e.url
    };
}
