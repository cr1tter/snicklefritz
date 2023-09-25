/**
 * Defines behavior for the list items in the calendar
 * filtering modal dialogue that is used to limit which
 * events are shown in the calendar's view.
 *
 * The `template` for this Custom Element is defined in
 * the `_includes/calendar.html` file.
 */

import { default as calendar } from '../calendar.js';
import { default as EventSources } from '../event-sources.js';

export default class calendarFilterListItem extends HTMLElement {
    constructor () {
        super();
        let templateContent = document.getElementById('filter-list-item-template').content;

        const shadowRoot = this.attachShadow({
            mode: 'open'
        });

        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback () {
        var inputElement = this.shadowRoot.querySelector('input');
        var labelElement = this.shadowRoot.querySelector('label');
        inputElement.setAttribute('id', `filter-${this.dataset.id}`);
        inputElement.setAttribute('value', `${this.dataset.id}`);
        labelElement.setAttribute('for', `filter-${this.dataset.id}`);
        var s = calendar.getEventSourceById(this.dataset.id);
        if ('none' == s.internalEventSource.ui.display) {
            inputElement.checked = false;
        } else {
            inputElement.checked = true;
        }

        inputElement.addEventListener('change', this.toggleDisplay);
    }

    /**
     * Adds (shows) or removes (hides) the FullCalendar Event Source
     * associated with this Custom Element filter item.
     *
     * Instead of using the `display` property for an EventSource, we
     * simply `.remove()` the `EventSource` object itself. Then, when
     * we want to make it visible again, we re-add it to the calendar.
     * This is a workaround until the `EventSource.display` property
     * can be used to toggle the display of events after they've been
     * added in the initial calendar rendering step.
     */
    toggleDisplay () {
        var inputElement = this;
        var s = calendar.getEventSourceById(inputElement.value);
        if ( inputElement.checked ) {
            calendar.addEventSource(EventSources.find( function (x) {
                return x.id === inputElement.value
            }));
        } else {
            s.remove()
        }
    }
};

window.customElements.define('calendar-filter-list-item', calendarFilterListItem);
