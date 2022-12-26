import { sliceEvents, createPlugin } from '@fullcalendar/core';

const MapViewConfig = {
    classNames: [ 'map-view' ],
    content: function (props) {
        var html = '<div id="map" style="height: 300px;"></div>';
        return {
            html: html
        }
    },
    didMount: function (props) {
        // Center the map on New York City.
        var map = L.map('map').setView([40.6975, -73.9795], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Get today's events.
        var segs = sliceEvents(props, true); // allDay=true

        // For each event, create a marker.
        // TODO: Use GeoJSON layers per event source instead of event?
        // TODO: Use GeoJSON features instead of simpler Points.
        segs.forEach(function (e) {
            if (e?.def?.extendedProps?.location?.geoJSON) {
                console.log(e.def.extendedProps.location.geoJSON);
                L.geoJSON(
                    e.def.extendedProps.location.geoJSON
                ).bindPopup(function (layer) {
                    return e.def.extendedProps.description;
                }).addTo(map);
            }
        });
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
