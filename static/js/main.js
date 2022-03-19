import { default as calendar } from './calendar.js';

if ('loading' === document.readyState) {
    document.addEventListener('DOMContentLoaded', calendar.render);
} else {
    calendar.render();
}
