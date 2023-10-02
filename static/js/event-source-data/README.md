# Event Source Data

This folder is intended to be where [FullCalendar Event Source objects](https://fullcalendar.io/docs/event-source-object) are defined. These define where events are published and how to retrieve a given event listing from those publications so that it can be displayed in this calendar.

## Event source types and one-off sources

There are two overarching categories of event source data, each processed slightly differently. The first is a custom scraper/parser built specifically for a single publisher. We call these *one-off event sources*. The other is a proper event source that has an associated `sourceType`, JavaScript object constructor, and any additional event source options that are defined either by this project or by the underlying FullCalendar library.

In both cases, the files follow a pattern wherein their default export is an array containing one or more objects that describe the sources themselves, either in groups or individually.

```javascript
const EventSourcesList = [
    {
        sourceType: 'name-of-event-source-type',
        options: {
            // Optional additional options for all event sources of this type.
        },
        sources: [
            // Array of event source objects themselves.
        ]
    },
    {
        sourceType: 'name-of-other-event-source-type',
        sources: [ ... ]
    }
]
```

One-off event sources, due to the fact that they handle edge and corner cases, are the most complex.

### One-off event sources

One-off event sources are defined in the [`one-off.js`](one-off.js) file. For consistency's sake, they are exported within an array containing a single object with two properties:

* `sourceType`: This is a string value that will always be set to `one-off`.
* `sources`: This is an array of event source objects. The objects are not processed further and are handed directly to [the `eventSources` FullCalendar option](https://fullcalendar.io/docs/eventSources) during initialization. This means they can make use of full JavaScript functionality, and are provided convenience variables (`corsbase` and `domparser`, a CORS proxy base URL and a reference to [the Web browser's `DOMParser` interface](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)) so that they can do perform whatever Web scraping/parsing they need.

## Customizing event source data

If you are forking this project, you should define your own event source data so that the events you are displaying are relevant to your needs. This means editing the `.js` files in this directory. Be aware that these files are not [JSON](https://www.json.org/) or another data transport format, but rather full JavaScript source code and thus must follow JavaScript syntax and other rules to remain valid.
