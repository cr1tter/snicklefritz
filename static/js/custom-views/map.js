import { sliceEvents, createPlugin } from 'https://cdn.skypack.dev/@fullcalendar/core@6.0.1?min';
import momentTimezone from 'https://cdn.skypack.dev/moment-timezone@0.5.40?min';
import { default as calendar } from '../calendar.js';
import FullCalendarEvent from '../event.js';

export var map;

// Converts a slice of FullCalendar Event segments to a GeoJSON
// Feature Collection object.
//
// @param segments
// @return {object} A [GeoJSON Feature Collection](https://geojson.org/geojson-spec.html#examples) object.
export function toGeoJSONFeatureCollection (segments) {
    var geojson = {
        type: 'FeatureCollection',
        features: []
    };

    segments.forEach(function (e) {
        if (e.def.extendedProps?.location?.geoJSON) {
            var f = {
                type: 'Feature',
                geometry: e.def.extendedProps.location.geoJSON,
                properties: Object.assign({}, e.def.extendedProps)
            };
            f.properties.title       = e.def.title;
            f.properties.url         = e.def.url;
            f.properties.description = e.def.extendedProps?.description;
            f.properties.image = e.def.extendedProps?.image;

            // TODO: Something about these dates are strange. They seem to
            // be passed into this function with incorrect timezone settings.
            // We're just going to ignore that whole thing and pretend that
            // the UTC timezone is actually showing the correct local time?
            // We'll also use the Moment.js library to make this easier to
            // work with, for now, until we figure out why these events data
            // are coming in here a little bit skewed.
            f.properties.dateRange = {
                start: momentTimezone(e.instance.range.start).tz('UTC'),
                end: momentTimezone(e.instance.range.end).tz('UTC')
            };

            geojson.features.push(f);
        }
    });

    return geojson;
}

/**
 * Adds events in a given range to the given map.
 *
 * @param {object} range An object with `start` and `end` properties to indicate the date range.
 * @param {Map} map Leaflet Map object to add the events to.
 */
export function addEventsInRangeTo (range, map) {
    var viewData = calendar.view.getCurrentData();
    viewData.dateProfile.activeRange.start = range.start;
    viewData.dateProfile.activeRange.end   = range.end;

    var segs = sliceEvents(viewData, true); // allDay=true
    var geoJson = toGeoJSONFeatureCollection(segs);
    var markers = L.markerClusterGroup();
    // Add the features.
    var geoJsonLayer = L.geoJSON(geoJson, {
        onEachFeature: onEachFeature
    });
    markers.addLayer(geoJsonLayer);
    map.addLayer(markers);
    map.fitBounds(markers.getBounds());
}

// Handler to prepare each GeoJSON Feature (an event item) for the
// Leaflet Map it's about to be added to. Mostly sets up the event
// popup and binds the Marker Layer to the correct Map feature.
//
// @param feature {GeoJSON Feature}
// @param layer {Layer}
// @return {object} An object with structure `{ feature, layer }`.
function onEachFeature (feature, layer) {
    var strTooltip = `${feature.properties.dateRange.start.format('LT')}: ${feature.properties.title}`;
    if (feature.properties.location.eventVenue) {
        strTooltip += ` @ ${feature.properties?.location?.eventVenue?.name}`;
    }
    layer.bindTooltip(strTooltip);
    var htmlDescriptionHeader = `<header><h1><a href="${feature.properties.url}" title="View publisher info for ${feature.properties.title}">${feature.properties.title}<img src="${feature.properties.image}" alt="Poster image for '${feature.properties.title}'" /></a></h1></header>`;
    //var strippedOriginalDescription = feature.properties?.description?.replace(/(<([^>]+)>)/gi, '')?.trim();
    // Strip all HTML except for links.
    var strippedOriginalDescription = feature.properties
        ?.description
        ?.replace(/<(?!\/?a(?=>|\s.*>))\/?.*?>/gi, '')
        ?.trim();
    layer.bindPopup(`${htmlDescriptionHeader}<p>${strippedOriginalDescription}</p>`, {
        maxHeight: '250'
    });

    return { feature, layer };
}

const MapViewConfig = {
    classNames: [ 'map-view' ],
    content: function (props) {
        var html = '<div id="map"></div>';
        return {
            html: html
        }
    },
    didMount: function (props) {
        // Center the Map on NYC by default; if the user permits the
        // GeoLocation access prompt, the map will re-center to them.
        map = L.map('map').setView([40.6975, -73.9795], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors - See a mistake? <a href="https://openstreetmap.org/fixthemap">Fix the map</a>!'
        }).addTo(map);
        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true
        }).on('locationerror', function (e) {
            console.log(e.message);
        });
        addEventsInRangeTo({
            start: props.dateProfile.activeRange.start,
            end  : props.dateProfile.activeRange.end
        }, map);
    },
    willUnmount: function (props) {
        // Code that will execute when the view is unloaded.
    }
};

export default createPlugin({
    views: {
        map: MapViewConfig
    }
});
