/**
 * Utility module to support the calendar's
 * Resident Advisor (RA) event sources.
 */
import FullCalendarEvent from '../event.js';
import * as Utils from '../utils.js';

export default function ResidentAdvisor ( optionsObj ) {
    this.url          = new URL(optionsObj.url);
    this.fetchInfo    = optionsObj.fetchInfo;
    this.gqlVariables = optionsObj.extraParams.gqlVariables;
    return this.fetch(this.url).then((ra) => {
        optionsObj.successCallback(ra.parse().events.map(
            this.toFullCalendarEventObject.bind(this)
        ));
    });
}

/**
 * Makes a request of a GraphQL endpoint.
 *
 * @param {URL} The GraphQL endpoint to query.
 * @return {ResidentAdvisor}
 */
ResidentAdvisor.prototype.fetch = async function ( url ) {
    var query = 'query GET_DEFAULT_EVENTS_LISTING($indices: [IndexType!], $aggregations: [ListingAggregationType!], $filters: [FilterInput], $pageSize: Int, $page: Int, $sortField: FilterSortFieldType, $sortOrder: FilterSortOrderType, $baseFilters: [FilterInput]) {\n  listing(indices: $indices, aggregations: [], filters: $filters, pageSize: $pageSize, page: $page, sortField: $sortField, sortOrder: $sortOrder) {\n    data {\n      ...eventFragment\n      __typename\n    }\n    totalResults\n    __typename\n  }\n  aggregations: listing(indices: $indices, aggregations: $aggregations, filters: $baseFilters, pageSize: 0, sortField: $sortField, sortOrder: $sortOrder) {\n    aggregations {\n      type\n      values {\n        value\n        name\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment eventFragment on IListingItem {\n  ... on Event {\n    id\n    title\n    attending\n    date\n    startTime\n    contentUrl\n    queueItEnabled\n    flyerFront\n    newEventForm\n    images {\n      id\n      filename\n      alt\n      type\n      crop\n      __typename\n    }\n    artists {\n      id\n      name\n      __typename\n    }\n    venue {\n      id\n      name\n      contentUrl\n      live\n      area {\n        id\n        name\n        urlName\n        country {\n          id\n          name\n          urlCode\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pick {\n      id\n      blurb\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n'
    var response = await fetch(Utils.useCorsProxy(url), {
        method: 'POST',
        referrer: 'https://ra.co/events',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operationName: 'GET_DEFAULT_EVENTS_LISTING',
            variables: {
                indices: [
                    'EVENT'
                ],
                pageSize: 20,
                page: 1,
                aggregations: [],
                filters: [
                    {
                        type: 'CLUB',
                        value: this.gqlVariables.club
                    },
                    {
                        type: 'DATERANGE',
                        value: `{"gte":"${this.fetchInfo.start.toISOString()}"}`
                    }
                ],
                sortOrder: 'ASCENDING',
                sortField: 'DATE',
                baseFilters: [
                    {
                        type: 'CLUB',
                        value: this.gqlVariables.club
                    },
                    {
                        type: 'DATERANGE',
                        value: `{"gte":"${this.fetchInfo.start.toISOString()}"}`
                    }
                ]
            },
            query: query
        })
        //body: Utils.graphql`${payload}`
    });
    var json = {};
    try {
        var json = await response.json();
    } catch (e) {
        console.error(e);
    }
    this.json = json;
    return this;
}

ResidentAdvisor.prototype.parse = function () {
    this.events = this.json.data.listing.data;
    return this;
}

ResidentAdvisor.prototype.toFullCalendarEventObject = function ( e ) {
    return new FullCalendarEvent({
        title: e.title,
        start: new Date(e.startTime),
        //end: e.date_end, // TODO: Query for this is not yet implemented.
        url: `https://ra.co${e.contentUrl}`,
        extendedProps: {
            //description: e.raw_description, // TODO: Query for this is not yet implemented.
            image: e?.images.find(function ( i ) { return 'FLYERFRONT' === i.type; })?.filename,
            location: {
                // TODO: Is this implementable?
                //geoJSON: {
                //    type: "Point",
                //    coordinates: [e.location.lng, e.location.lat]
                //},
                eventVenue: {
                    name: e.venue.name,
                    address: {
                        //streetAddress: e.???,   // TODO: Query for this is not yet implemented.
                        //addressLocality: e.???, // TODO: Query for this is not yet implemented.
                        addressRegion: e.venue.area.name,
                        //postalCode: e.???,      // TODO: Query for this is not yet implemented.
                        addressCountry: e.venue.area.country.name
                    },
                    // TODO: Is this implementable?
                    //geo: {
                    //    latitude: e.location.lat,
                    //    longitude: e.location.lng
                    //}
                }
            }
        }
    });
}
