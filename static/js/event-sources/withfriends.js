/**
 * Utility module to support the calendar's WithFriends
 * event sources.
 */
import { useCorsProxy, domparser } from '../utils.js';
import FullCalendarEvent from '../event.js';

export default function WithFriends ( optionsObj ) {
    // A `movementId` is WithFriends' name for an organizer.
    this.movementId = optionsObj.movementId;
    this.url = new URL(`https://withfriends.co/Movement/${this.movementId}/Incremental_Events:Display_Infinite_Scroll=1,Display_Item_Element=li,Display_Item_Classes=Event_List_Item%20wf-event%20wf-front,Display_Iterator_Element=None,Display_Increment=5,Display_Template_Alias=New_List,Display_Segment=Upcoming,Display_Property_Alias=Events,Display_Front=1,Display_Item_Type=Movement,Display_Item=${this.movementId}`);

    return this.fetch(this.url).then( ( wf ) => {
        optionsObj.successCallback(wf.parse().events);
    });
};

WithFriends.prototype.fetch = async function ( url ) {
    var response = await fetch(useCorsProxy(url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `Raw=1&Metadata_Namespace=Jelly_Site_998_Container_Movement_${this.movementId}_Async_Wrapper_Movement_${this.movementId}_Block_New_Movement_${this.movementId}_Async_Wrapper_Movement_${this.movementId}_Movement_${this.movementId}_Async_Wrapper`
    });
    try {
        var html = await response.text();
        var doc = domparser.parseFromString(html, 'text/html');
        this.items = doc.querySelectorAll('.Event_List_Item');
    } catch (e) {
        console.error(e);
    }
    return this;
}

WithFriends.prototype.parse = function () {
    var events = [];
    this.items.forEach(function (item) {
        var date_string = item.querySelector('[data-property="Start_Time"]').textContent.trim()
            .replace('at', new Date().getFullYear()); // Withfriends doesn't publish a full year, so we just guess.
        events.push(new FullCalendarEvent({
            title: item.querySelector('[data-property="Name"]').textContent.trim(),
            start: new Date(date_string),
            url: 'https://withfriends.co' + item.querySelector('.wf-event-link').getAttribute('href'),
            extendedProps: {
                location: {
                    geoJSON: null
                }
            }
        }));
    });
    this.events = events;
    return this;
}
