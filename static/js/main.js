import { default as calendar } from './calendar.js';

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

if ('loading' === document.readyState) {
    document.addEventListener('DOMContentLoaded', calendar.render);
    document.addEventListener('DOMContentLoaded', hidePastFeaturedEvents);
} else {
    calendar.render();
    removePastFeaturedEvents();
}
