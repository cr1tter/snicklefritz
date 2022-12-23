import { sliceEvents, createPlugin } from '@fullcalendar/core';

const MapViewConfig = {
    classNames: [ 'map-view' ],
    content: function (props) {
        var segs = sliceEvents(props, true); // allDay=true
        var html = 'this is a test';
        return {
            html: html
        }
    }
};

export default createPlugin({
    views: {
        map: MapViewConfig
    }
});
