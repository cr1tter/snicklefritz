/**
 * Defines behavior for the list items in the calendar
 * filtering modal dialogue that is used to limit which
 * events are shown in the calendar's view.
 */
export default class calendarFilterListItem extends HTMLElement {
    constructor () {
        super();
        let templateContent = document.getElementById('filter-list-item-template').content;

        const shadowRoot = this.attachShadow({
            mode: 'open'
        });

        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
};
