/**
 * Utility module to support the calendar's Squarespace
 * event sources.
 */

export const DiceEventSources = [
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
                failureCallback: failureCallback
            });
        }
    }
];

export default function Dice (optionsObj) {
    var url = optionsObj.url;
    return this.fetch(url).then((dice_events) => {
        optionsObj.successCallback(dice_events.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

Dice.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(url, {
        headers: {
           'x-api-key': '7rU0bJyVtM5s3vDdYNiuQ4UtDo6pAnmH1QgXsI7E' // Union-Pool.com
        }
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
