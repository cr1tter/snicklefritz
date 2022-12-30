import { sliceEvents, createPlugin } from 'https://cdn.skypack.dev/@fullcalendar/core@6.0.1?min';
import momentTimezone from 'https://cdn.skypack.dev/moment-timezone@0.5.40?min';
import FullCalendarEvent from '../event.js';

const MapViewConfig = {
    classNames: [ 'map-view' ],
    content: function (props) {
        var html = '<div id="map" style="height: 300px;"></div>';
        return {
            html: html
        }
    },
    didMount: function (props) {
        // Get today's events.
        var segs = sliceEvents(props, true); // allDay=true

        var geojson = {
            type: 'FeatureCollection',
            features: []
        };

        segs.forEach(function (e) {
            if (e.def.extendedProps?.location?.geoJSON) {
                var f = {
                    type: 'Feature',
                    geometry: e.def.extendedProps.location.geoJSON,
                    properties: Object.assign({}, e.def.extendedProps)
                };
                f.properties.title       = e.def.title;
                f.properties.url         = e.def.url;
                f.properties.description = e.def.extendedProps?.description;

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

        // Center the map on New York City.
        var map = L.map('map').setView([40.6975, -73.9795], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors - See a mistake? <a href="https://openstreetmap.org/fixthemap">Fix the map</a>!'
        }).addTo(map);

        // Add the features.
        L.geoJSON(geojson, {
            onEachFeature: function (feature, layer) {
                var strTooltip = `${feature.properties.dateRange.start.format('LT')}: ${feature.properties.title}`;
                if (feature.properties.location.eventVenue) {
                    strTooltip += ` @ ${feature.properties?.location?.eventVenue?.name}`;
                }
                layer.bindTooltip(strTooltip);

                var htmlDescription             = `<h1><a href="${feature.properties.url}">${feature.properties.title}</a></h1>`;
                //var strippedOriginalDescription = feature.properties?.description?.replace(/(<([^>]+)>)/gi, '')?.trim();
                // Strip all HTML except for links.
                var strippedOriginalDescription = feature.properties
                    ?.description
                    ?.replace(/<(?!\/?a(?=>|\s.*>))\/?.*?>/gi, '')
                    ?.trim();
                layer.bindPopup(`${htmlDescription}<p>${strippedOriginalDescription}</p>`, {
                    maxHeight: '250'
                });
            }
        }).addTo(map);
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
