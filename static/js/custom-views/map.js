import { sliceEvents, createPlugin } from '@fullcalendar/core';
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
                f.properties.title = e.def.title;
                f.properties.dateRange = e.instance.range; // TODO: Are these times wrong?
                f.properties.description =  e.def.extendedProps?.description;
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
                layer.bindTooltip(`${feature.properties.dateRange.start.toLocaleTimeString()}: ${feature.properties.title} @ ${feature.properties?.location?.eventVenue?.name}`);
                layer.bindPopup(feature.properties.description, {
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
