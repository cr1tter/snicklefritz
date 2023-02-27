/**
 * Defines behavior for the list items in the calendar
 * filtering modal dialogue that is used to limit which
 * events are shown in the calendar's view.
 *
 * The `template` for this Custom Element is defined in
 * the `_includes/calendar.html` file.
 */

import { default as calendar } from '../calendar.js';

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
        if ('none' == s.display) {
            inputElement.checked = false;
        } else {
            inputElement.checked = true;
        }

        inputElement.addEventListener('change', this.toggleDisplay);
    }

    /**
     * Shows or hides the FullCalendar Event Source
     * associated with this Custom Element filter item.
     */
    toggleDisplay () {
        var inputElement = this;
        var s = calendar.getEventSourceById(inputElement.value);
        // Match each event with source's internal ID.
        var sid = s.internalEventSource.sourceId;
        calendar.getEvents().forEach(function (x) {
            if (sid == x._def.sourceId) {
                x.setProp(
                    'display',
                    (inputElement.checked) ? 'auto' : 'none'
                );
            }
        });
    }
};

window.customElements.define('calendar-filter-list-item', calendarFilterListItem);
