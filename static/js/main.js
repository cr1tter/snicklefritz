---
layout: none
---
import { default as calendar, adjustToolbarButtons } from '{{ site.baseurl }}{% link static/js/calendar.js %}';

function removePastFeaturedEvents () {
    var els = document.getElementById('featured-events').querySelectorAll('[data-not-valid-after]');
    els.forEach(function (el) {
        var date = new Date(el.dataset.notValidAfter);
        var time = new Date();
        if ( time >= date ) {
            el.remove();
        }
    });
}

// Don't use the `$` variable for jQuery exclusively.
// https://api.jquery.com/jQuery.noConflict/
jQuery.noConflict();

if ('loading' === document.readyState) {
    document.addEventListener('DOMCOntentLoaded', function () {
        calendar.render();
        removePastFeaturedEvents();
        adjustToolbarButtons();
    });
} else {
    calendar.render();
    removePastFeaturedEvents();
    adjustToolbarButtons();
}
