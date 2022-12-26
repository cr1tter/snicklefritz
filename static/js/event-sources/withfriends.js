/**
 * Utility module to support the calendar's WithFriends
 * event sources.
 */
import { corsbase, domparser } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export const WithFriendsEventSources = [
    {
        name: 'Babycastles (WithFriends)',
        id: 'babycastles',
        className: 'babycastles',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '105694',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'City Reliquary (WithFriends)',
        id: 'city-reliquary',
        className: 'city-reliquary',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '3850819',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Hex House (WithFriends)',
        id: 'hex-house',
        className: 'hex-house',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '9492801',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Mayday Space (WithFriends)',
        id: 'mayday-space',
        className: 'mayday-space',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '250678',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Mil Mundos (WithFriends)',
        id: 'mil-mundos',
        className: 'mil-mundos',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '2108660',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Rubulad (WithFriends)',
        id: 'rubulad',
        className: 'rubulad',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '239193',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    },
    {
        name: 'Spectacle Microcinema (WithFriends)',
        id: 'spectacle-microcinema',
        className: 'spectacle-microcinema',
        events: async function (fetchInfo, successCallback, failureCallback) {
            await new WithFriends({
                movementId: '335653',
                fetchInfo: fetchInfo,
                successCallback: successCallback,
                failureCallback: failureCallback
            });
        }
    }
];

export default function WithFriends (optionsObj) {
    // A `movementId` is WithFriends' name for an organizer.
    this.movementId = optionsObj.movementId;
    var url = new URL(`https://withfriends.co/Movement/${this.movementId}/Incremental_Events:Display_Infinite_Scroll=1,Display_Item_Element=li,Display_Item_Classes=Event_List_Item%20wf-event%20wf-front,Display_Iterator_Element=None,Display_Increment=5,Display_Template_Alias=New_List,Display_Segment=Upcoming,Display_Property_Alias=Events,Display_Front=1,Display_Item_Type=Movement,Display_Item=${this.movementId}`);

    return this.fetch(url).then((wf) => {
        optionsObj.successCallback(wf.parse().events);
    });
};

WithFriends.prototype.fetch = async function (url) {
    this.url = url;
    var response = await fetch(corsbase + '/' + url, {
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
