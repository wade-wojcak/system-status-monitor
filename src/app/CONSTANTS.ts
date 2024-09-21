/**
 * The history window time for storing load average data points.
 */
export const DATAPOINT_TIME_WINDOW = 60 * 1000 * 10 // 10 minutes

/**
 * The time interval for refetching data from the API.
 */
export const REFETCH_INTERVAL = 10 * 1000 // 10 seconds

/**
 * The span of time required for a 'high' or 'recovered' event to be considered.
 */
export const STATUS_TIME_WINDOW = 2 * 60 * 1000 // 2 minutes
