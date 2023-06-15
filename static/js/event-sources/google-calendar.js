/**
 * Utility module to support the calendar's Google Calendar
 * event sources.
 */
import { corsbase } from '../calendar.js'

export const GoogleCalendarEventSources = [
    {
        name: 'Billie Bullock',
        id: 'billie-bullock',
        className: 'billie-bullock',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/heybilliebullock%40gmail.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Caffiene Underground',
        id: 'caffiene-underground',
        className: 'caffiene-underground',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/013k1i3tkls5tas280vio8cfm4%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Footlight Presents',
        id: 'footlight-presents',
        className: 'footlight-presents',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/q2eve034kguv4h52j3291udvbo%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        // Maintained by Tech Learning Collective's Partner Operations Team.
        // This is mostly a stop-gap for events we can't automatically add.
        name: 'Friendly to Anarchism.NYC',
        id: 'friendlytoanarchismnyc',
        className: 'friendlytoanarchismnyc',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/2om8s9hsd7kkkjcc88kon65i2o%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Happy Fun Hideaway',
        id: 'happy-fun-hideaway',
        className: 'hart-bar',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/df0602291afe16242665e5d462f9086f30f7d420b9aa4edb1d9eb159e5c970e5@group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Hart Bar',
        id: 'hart-bar',
        className: 'hart-bar',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/qhsrkjv5s7mb4vidjem575jvt4%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'NYC Resistor',
        id: 'nycresistor',
        className: 'nycresistor',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/p2m2av9dhrh4n1ub7jlsc68s7o%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'NYSEC.io',
        id: 'nysec-io',
        className: 'nysec-io',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/tvrptkil8r120s1guaefhp23hs%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Phase Space',
        id: 'phase-space',
        className: 'phase-space',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/q14jhdv41fng6q1b2826dp92rs%40group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'The Lot Radio',
        id: 'the-lot-radio',
        className: 'the-lot-radio',
        // The Lot Radio uses FullCalendar as well, so we can just replicate their requests.
        // (Since they have not limited the origin domain on the Google API side at all....)
        // Note this'll trigger security alerts, but it's not really our issue since the API
        // key is theirs. The secure move is on them to allow requests only from their site.
        googleCalendarApiKey: 'AIzaSyD7jIVZog7IC--y1RBCiLuUmxEDeBH9wDA',
        googleCalendarId: 'thelotradio.com_j1ordgiru5n55sa5u312tjgm9k@group.calendar.google.com'
    },
    {
        name: 'Queer Flatbush',
        id: 'queer-flatbush',
        className: 'queer-flatbush',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/queerflatbush%40gmail.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Verse BK',
        id: 'verse-bk',
        className: 'verse-bk',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new GoogleCalendar({
                url: 'https://calendar.google.com/calendar/ical/c_qi5b592teecmbi4l2jk7ff69ao@group.calendar.google.com/public/basic.ics',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function GoogleCalendar (optionsObj) {
    return this.fetch(optionsObj.url).then((gcal) => {
        optionsObj.successCallback(gcal.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    })
};

/**
 * Fetch events via Google Calendar ICS.
 */
GoogleCalendar.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(corsbase + '/' + url);
    var ics = await response.text();
    this.ics = ics;
    return this;
};

GoogleCalendar.prototype.parse = function () {
    var events = [];

    var jcal = ICAL.parse(this.ics);
    var vcal = new ICAL.Component(jcal);
    var vevents = vcal.getAllSubcomponents('vevent');
    this.events = vevents;
    return this;
};

/**
 * Converts a parsed Google Calendar vevent in jCal format to
 * a FullCalendar Event Object.
 *
 * @param {object} e Event data in jCal format.
 * @return {object} FullCalendar Event Object
 */
GoogleCalendar.prototype.toFullCalendarEventObject = function (e) {
    // The format for a Google Calendar single event page is this:
    //
    //     https://calendar.google.com/calendar/event?eid={eventid}&ctz=America/New_York
    //
    // where `{eventid}` is a base64 encoded string constructed as:
    //
    //     vEvent UID component + ' ' + calendar ID + '@g'
    //
    // The `@g` at the end is literal.
    var calendar = this.url.match(/calendar\/ical\/(.*)%40.*public\/basic.ics/)[1];
    var vevent = new ICAL.Event(e);
    // TODO: Add location information to this.
    var newEvent = {
        title: vevent.summary,
        start: vevent.startDate.toJSDate(),
        end: vevent.endDate.toJSDate(),
        // Google Calendars don't provide a URL.
        // So we generate one with the event UID ourselves.
        url: 'https://www.google.com/calendar/event?eid='
            + btoa(
                vevent.uid.replace('@google.com', '') + ' ' + calendar + '@g'
            ).replaceAll('=', '')
            + '&ctz=America/New_York'
    };
    if (e.hasProperty('rrule')) {
        newEvent.rrule = 'DTSTART:' + vevent.startDate.toICALString()
            // TODO: This needs to remain commented out until upstream
            //       FullCalendar RRULE plugin supports DTEND. Details
            //       https://github.com/jakubroztocil/rrule/pull/421
            //+ '\nDTEND:' + vevent.endDate.toICALString()
            + '\n' + e.getFirstProperty('rrule').toICALString();
    }
    return newEvent;
};
