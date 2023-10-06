/**
 * This file simply shims various event source descriptions together.
 */
import { default as MainEventSourceData } from './event-source-data/main.js';
import { default as OneOffEventSourceData } from './event-source-data/one-off.js';

var EventSourceData = MainEventSourceData.concat(
    OneOffEventSourceData
);

export default EventSourceData;
