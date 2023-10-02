/**
 * This file simply shims various event source descriptions together.
 */
import { default as EventSourceData } from './event-source-data/main.js';
import { default as OneOffEventSourceData } from './event-source-data/one-off.js';

EventSourceData.concat(
    OneOffEventSourceData
);

export default EventSourceData;
