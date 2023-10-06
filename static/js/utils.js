/**
 * Simplistic and "good enough" helper functions, mostly for dealing
 * with common one-off event source type issues.
 */

/**
 * Simplistically converts a 12-hour time format string to a 24-hour time.
 *
 * @param str {String} The 12-hour formatted time string, e.g., `"8:00 am"`
 * @return
 */
export function convert12To24HourTime (str) {
    var h;
    var m;
    if ( str.match(/ am$/) ) {
        [h, m] = str.match(/^(\d?\d):(\d\d)/).slice(1);
        if ( '12' === h ) {
            h = '00';
        }
    } else {
        h = parseInt(str.match(/^\d?\d/)[0]) + 12;
        m = str.match(/:(\d\d) /)[1];
        if ( '24' === h ) {
            h = '12';
        }
    }
    h.toString().padStart(2, '0');
    return [h, m];
}
