/**
 * Utility module to support the calendar's
 * Resident Advisor (RA) event sources.
 */
import FullCalendarEvent from '../event.js';
import * as Utils from '../utils.js';

const gqlQueryDocument = Utils.gql`
query GET_DEFAULT_EVENTS_LISTING($indices: [IndexType!], $aggregations: [ListingAggregationType!], $filters: [FilterInput], $pageSize: Int, $page: Int, $sortField: FilterSortFieldType, $sortOrder: FilterSortOrderType, $baseFilters: [FilterInput]) {
  listing(indices: $indices, aggregations: [], filters: $filters, pageSize: $pageSize, page: $page, sortField: $sortField, sortOrder: $sortOrder) {
    data {
      ...eventFragment
      __typename
    }
    totalResults
    __typename
  }
  aggregations: listing(indices: $indices, aggregations: $aggregations, filters: $baseFilters, pageSize: 0, sortField: $sortField, sortOrder: $sortOrder) {
    aggregations {
      type
      values {
        value
        name
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment eventFragment on IListingItem {
  ... on Event {
    id
    title
    attending
    date
    startTime
    contentUrl
    queueItEnabled
    flyerFront
    newEventForm
    images {
      id
      filename
      alt
      type
      crop
      __typename
    }
    artists {
      id
      name
      __typename
    }
    venue {
      id
      name
      contentUrl
      live
      area {
        id
        name
        urlName
        country {
          id
          name
          urlCode
          __typename
        }
        __typename
      }
      __typename
    }
    pick {
      id
      blurb
      __typename
    }
    __typename
  }
  __typename
}
`.trim();

export default function ResidentAdvisor ( optionsObj ) {
    this.url          = new URL(optionsObj.url);
    this.gqlVariables = {
        indices: [
            'EVENT'
        ],
        pageSize: 100,
        page: 1,
        aggregations: [],
        filters: [
            {
                type: 'CLUB',
                value: optionsObj.extraParams.gqlVariables.club
            },
            {
                type: 'DATERANGE',
                value: `{"gte":"${optionsObj.fetchInfo.start.toISOString()}"}`
            }
        ],
        sortOrder: 'ASCENDING',
        sortField: 'DATE',
        baseFilters: [
            {
                type: 'CLUB',
                value: optionsObj.extraParams.gqlVariables.club
            },
            {
                type: 'DATERANGE',
                value: `{"gte":"${optionsObj.fetchInfo.start.toISOString()}"}`
            }
        ]
    }
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
    const graphQLClient = new Utils.GraphQLClient(
        Utils.useCorsProxy(url),
        {
            'Referer': 'https://ra.co/events',
            'Content-Type': 'application/json'
        }
    );
    this.json = await graphQLClient.request(gqlQueryDocument, this.gqlVariables);
    return this;
}

ResidentAdvisor.prototype.parse = function () {
    this.events = this.json.listing.data;
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
