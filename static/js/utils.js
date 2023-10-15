---
layout: none
---
/**
 * Simplistic and "good enough" helper functions, mostly for dealing
 * with common one-off event source type issues.
 */
export const domparser = new DOMParser();

const corsbase = '{{ site.cors_proxy_base_url | default: "https://cors.anarchism.nyc"}}';

/**
 * Changes a URL so that it will be retrieved through a CORS proxy.
 *
 * @param {URL|String} url The URL to modify.
 * @return {URL} The URL, with the CORS proxy endpoint prepended.
 */
export function useCorsProxy ( url ) {
    return new URL(`${corsbase}/${url.toString()}`);
}

/**
 * Simplistically converts a 12-hour time format string to a 24-hour time.
 *
 * @param str {String} The 12-hour formatted time string, e.g., `"8:00 am"`.
 * @return {String} The 24-hour formatted time string, e.g., `"20:00"`.
 */
export function convert12To24HourTime (str) {
    var h, m;
    if ( str.match(/ ?am$/) ) {
        [h, m] = str.match(/^(\d?\d):(\d\d)/).slice(1);
        if ( '12' === h ) {
            h = '00';
        }
    } else {
        h = parseInt(str.match(/^\d?\d/)[0]) + 12;
        m = str.match(/:(\d\d)/)[1];
        if ( '24' === h ) {
            h = '12';
        }
    }
    h.toString().padStart(2, '0');
    return [h, m].join(':');
}
