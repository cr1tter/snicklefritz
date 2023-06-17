export default class FullCalendarEvent {
    constructor (props) {
        return Object.assign({
            title: null,
            start: null,
            end: null,
            url: null,
            // In general, these should sort of match the Schema.org
            // schema for an Event object to fill in FullCalendar event
            // object definition that is not already accounted for.
            extendedProps: {
                description: null,
                image: null,
                location: {
                    geoJSON: {
                        type: "Point",
                        coordinates: [null, null] // Longitude, Latitude
                    },
                    // Should be Schema.org EventVenue, type of Place.
                    // https://schema.org/EventVenue
                    eventVenue: {
                        name: null,
                        description: null,
                        url: null,
                        logo: null,
                        address: {
                            streetAddress: null,
                            addressLocality: null,
                            addressRegion: null,
                            postalCode: null,
                            addressCountry: null
                        },
                        geo: {
                            latitude: null,
                            longitude: null
                        },
                        hasMap: null
                    }
                }
            },
            raw: null // Raw information from original source.
        }, props); // Whatever we pass in should override.
    }; 

    /**
     * Translates a Schema.org Event type (or more specific type)
     * to a FullCalendar event object.
     *
     * @param {Object} item JSON-formatted Schema.org Event object.
     */
    static fromSchemaDotOrg (item) {
        // If we have a `geo` object, format it to geoJSON.
        var geoJSON = (item.location.geo) ? {
            type: "Point",
            coordinates: [
                item.location.geo.longitude,
                item.location.geo.latitude
            ]
        } : null; // Otherwise, set it to null.
        return {
            title: item.name,
            start: item.startDate,
            end: item.endDate,
            url: item.url,
            extendedProps: {
                description: item.description || null,
                image: item.image,
                location: {
                    geoJSON: geoJSON,
                    eventVenue: {
                        name: item.location?.name,
                        address: {
                            streetAddress: item.location?.streetAddress,
                            addressLocality: item.location?.addressLocality,
                            addressRegion: item.location?.addressRegion,
                            postalCode: item.location?.postalCode,
                            addressCountry: item.location?.addressCountry
                        },
                        geo: item.location?.geo
                    }
                }
            }
        };
    }
};
