/**
 * Utility module to support the calendar's Google Calendar
 * event sources.
 */
import { useCorsProxy } from '../utils.js'

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
    var response = await fetch(useCorsProxy(url));
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
