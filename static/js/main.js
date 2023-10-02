---
layout: none
---
import { default as calendar, calendarHeaderToolbar } from '{{ site.baseurl }}{% link static/js/calendar.js %}';

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

/**
 * Changes the toolbar buttons that are visible and their size based
 * on the size of the screen. This helps adjust for mobile screens.
 */
function adjustToolbarButtons () {
    window.addEventListener('resize', function () {
        if (window.matchMedia("only screen and (max-width: 540px)").matches) {
            // Since we have a small screen, don't show the `month` or `day` buttons.
            calendar.setOption('headerToolbar', calendarHeaderToolbar.smallScreen);
            document.querySelectorAll('.fc-toolbar .btn').forEach(function (btn) {
                btn.classList.add('btn-sm');
            });
        } else {
            calendar.setOption('headerToolbar', calendarHeaderToolbar.largeScreen);
            document.querySelectorAll('.fc-toolbar .btn').forEach(function (btn) {
                btn.classList.remove('btn-sm');
            });
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
