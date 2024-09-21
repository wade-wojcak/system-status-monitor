import { REFETCH_INTERVAL, STATUS_TIME_WINDOW } from '../CONSTANTS'
import { LoadAverageDataPoint } from './useSystemStatus'

/**
 * Generates a random number between 0 and 1.
 *
 * @returns {number} - A random number between 0 and 1.
 */
const generateNormalValue = () => Math.random()

/**
 * Generates a random number greater than 1 and less than 10.
 *
 * @returns {number} - A random number greater than 1 and less than 10.
 */
const generateHighValue = () => Math.random() * 10 + 1

/**
 * Creates a new data point with the given timestamp and value.
 *
 * @param {number} timestamp - The timestamp of the data point.
 * @param {number} value - The value of the data point.
 * @returns {LoadAverageDataPoint} - A new data point with the given timestamp and value.
 */
const createDataPoint = (timestamp: number, value: number): LoadAverageDataPoint => ({
  timestamp,
  value,
})

/**
 * The start time of the test.
 */
const testStartTime = new Date().getTime()

/**
 * Generate Data Points Props Type.
 *
 * @typedef {Object} GenerateDataPointsProps
 * @property {number} duration - The duration of the data points.
 * @property {() => number} generateValue - A function that generates a value for each data point.
 * @property {number} [startTime] - The start time of the data points. Default is the start time of the test.
 */
type GenerateDataPointsProps = {
  duration: number
  generateValue: () => number
  startTime?: number
}

/**
 * Generates a set of data points with a given duration and value generator.
 * The data points will have timestamps ranging from the start time to the end of the duration.
 *
 * @param {GenerateDataPointsProps} props - An object containing the duration and value generator.
 * @returns {LoadAverageDataPoint[]} - An array of data points.
 */
const generateDataPoints = (props: GenerateDataPointsProps): LoadAverageDataPoint[] => {
  const { duration, generateValue, startTime = testStartTime } = props

  let elapsedTime = 0

  const dataPoints: LoadAverageDataPoint[] = []

  while (elapsedTime < duration) {
    const timeStamp = startTime + elapsedTime
    const value = generateValue()
    dataPoints.push(createDataPoint(timeStamp, value))
    elapsedTime += REFETCH_INTERVAL
  }

  return dataPoints
}

/**
 * Generate a set of "normal" data points that do not fill an event window.
 */
const normalSubWindow: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW,
  generateValue: generateNormalValue,
})

/**
 * Generate a set of "high" data points that do not fill an event window.
 * These data points will not trigger any events.
 */
const highSubWindow: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW,
  generateValue: generateHighValue,
})

/**
 * Generate a mix of "normal" and "high" data points that do not fill an event window.
 * These data points will not trigger any events.
 */
const mixedSubWindow: LoadAverageDataPoint[] = []

mixedSubWindow.push(
  ...generateDataPoints({
    duration: STATUS_TIME_WINDOW / 2,
    generateValue: generateNormalValue,
  }),
)

mixedSubWindow.push(
  ...generateDataPoints({
    duration: STATUS_TIME_WINDOW,
    generateValue: generateHighValue,
    startTime: testStartTime + STATUS_TIME_WINDOW / 2,
  }),
)

/**
 * Generate a set of "high" data points, spanning a full event window.
 * These data points will trigger a "high" event.
 */
const highFullWindow: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
  generateValue: generateHighValue,
})

/**
 * Generate a set of "normal" data points, spanning a full event window.
 * These data points will trigger a "high" event.
 */
const normalFullWindow: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
  generateValue: generateNormalValue,
})

/**
 * Generate a mix of "normal" and "high" data points, spanning a full event window.
 * These data points will not trigger any events.
 */
const mixedFullWindow: LoadAverageDataPoint[] = []

mixedFullWindow.push(
  ...generateDataPoints({
    duration: STATUS_TIME_WINDOW / 2,
    generateValue: generateNormalValue,
  }),
)

mixedFullWindow.push(
  ...generateDataPoints({
    duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
    generateValue: generateHighValue,
    startTime: testStartTime + STATUS_TIME_WINDOW / 2,
  }),
)

/**
 * Generate a set of data points transitioning from "normal" to "high", spanning two full event windows.
 * These data points will trigger a "high" event.
 */
const normalToHigh_normal: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
  generateValue: generateNormalValue,
})

const normalToHigh_high: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW * 2 + REFETCH_INTERVAL * 2,
  generateValue: generateHighValue,
  startTime: testStartTime + STATUS_TIME_WINDOW + REFETCH_INTERVAL,
})

/**
 * Generate a set of data points transitioning from "high" to "normal", spanning two full event windows.
 * These data points will trigger both a "high" and a "recovered" event.
 */
const highToNormal_high: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
  generateValue: generateHighValue,
})
const highToNormal_normal: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW * 2 + REFETCH_INTERVAL * 2,
  generateValue: generateNormalValue,
  startTime: testStartTime + STATUS_TIME_WINDOW + REFETCH_INTERVAL,
})

/**
 * Generate a set of data points transitioning from "normal" to "high" and back to "normal", spanning three full event windows.
 * These data points will trigger both a "high" and a "recovered" event.
 */
const normalToHighToNormal_normal1: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW + REFETCH_INTERVAL,
  generateValue: generateNormalValue,
})

const normalToHighToNormal_high: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW * 2 + REFETCH_INTERVAL * 2,
  generateValue: generateHighValue,
  startTime: testStartTime + STATUS_TIME_WINDOW + REFETCH_INTERVAL,
})
const normalToHighToNormal_normal2: LoadAverageDataPoint[] = generateDataPoints({
  duration: STATUS_TIME_WINDOW * 3 + REFETCH_INTERVAL * 3,
  generateValue: generateNormalValue,
  startTime: testStartTime + STATUS_TIME_WINDOW * 2 + REFETCH_INTERVAL * 2,
})

/**
 * Test Data Points.
 */
const TEST_DATA_POINTS = {
  normal: {
    subWindow: normalSubWindow,
    fullWindow: normalFullWindow,
  },
  high: {
    subWindow: highSubWindow,
    fullWindow: highFullWindow,
  },
  mixed: {
    subWindow: mixedSubWindow,
    fullWindow: mixedFullWindow,
  },
  transitions: {
    highToNormal: [highToNormal_high, highToNormal_normal],
    normalToHigh: [normalToHigh_normal, normalToHigh_high],
    normalToHighToNormal: [
      normalToHighToNormal_normal1,
      normalToHighToNormal_high,
      normalToHighToNormal_normal2,
    ],
  },
}

export { TEST_DATA_POINTS }
