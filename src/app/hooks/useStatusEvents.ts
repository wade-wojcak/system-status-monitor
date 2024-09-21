import { useEffect, useMemo, useRef, useState } from 'react'
import { STATUS_TIME_WINDOW } from '../CONSTANTS'
import { type LoadAverageDataPoint } from './useSystemStatus'

/**
 * Use Status Events Props Type.
 *
 * @typedef {Object} UseStatusEventsProps
 * @property {LoadAverageDataPoint[]} loadAverageDataPoints - The list of load average data points.
 */
export type UseStatusEventsProps = {
  loadAverageDataPoints: LoadAverageDataPoint[]
}

/**
 * Recent Load Average Level Type.
 *
 * @typedef {string} RecentLoadAverageLevel
 * Possible values are:
 * - 'normal': The recent load average is at or below 1.
 * - 'mixed': The recent load average is a mix of values.
 * - 'high': The recent load average is above 1.
 */
export type RecentLoadAverageLevel = 'normal' | 'mixed' | 'high'

/**
 * Load Status Event Type Type.
 *
 * @typedef {string} LoadStatusEventType
 * Possible values are:
 * - 'high': The system has been under high load for an extended period of time.
 * - 'recovered': The system has recovered from a period of high load and has returned to normal.
 */
export type LoadStatusEventType = 'high' | 'recovered'

/**
 * Load Status Event Type.
 *
 * @typedef {Object} LoadStatusEvent
 * @property {LoadStatusEventType} type - The type of the event.
 * @property {number} timestamp - The timestamp of the event.
 */
export type LoadStatusEvent = {
  type: LoadStatusEventType
  timestamp: number
}

/**
 * Use Status Event Return Type.
 *
 * @typedef {Object} UseStatusEventReturn
 * @property {StatusEvent[]} statusEvents - The list of status events.
 */
export type StatusEvent = LoadStatusEvent

/**
 * Use Status Event Return Type.
 *
 * @typedef {Object} UseStatusEventReturn
 * @property {StatusEvent[]} statusEvents - The list of status events.
 */
export type UseStatusEventReturn = {
  statusEvents: StatusEvent[]
}

/**
 * useStatusEvents Hook.
 *
 * Hook for monitoring the load average data points and triggering status events when appropriate.
 *
 * High Load Status Event Conditions:
 * - If the load average is above 1 for at least `STATUS_TIME_WINDOW` time, a 'high' event is triggered.
 * - If the last event triggered was a 'high' event, do not trigger additional 'high' events.
 *
 * Recovered Status Event Conditions:
 * - If the load average is at or below 1 for at least `STATUS_TIME_WINDOW` time and the last event triggered was a 'high' event, a 'recovered' event is triggered.
 * - If the last event triggered was a 'recovered' event, do not trigger additional 'recovered' events.
 *
 * @param {UseStatusEventsProps} props - An object containing the load average data points.
 * @returns {UseStatusEventReturn} - An object containing the list of status events.
 */
export const useStatusEvents = (props: UseStatusEventsProps): UseStatusEventReturn => {
  const { loadAverageDataPoints } = props

  // Track the recent load average level with a rolling window of data points
  const recentLoadAverageLevel = useMemo((): RecentLoadAverageLevel => {
    // If there are no data points yet, default to 'normal'
    if (loadAverageDataPoints.length === 0) return 'normal'

    // Gather the recent load average data points within the time window
    const latestDataPoint = loadAverageDataPoints[loadAverageDataPoints.length - 1]
    const windowStart = latestDataPoint.timestamp - STATUS_TIME_WINDOW

    const recentLoadAverageDataPoints = loadAverageDataPoints.filter(dataPoint => {
      return dataPoint.timestamp >= windowStart
    })

    // Determine the overall status of the recent load average data points
    // If all data points are > 1, the status is 'high'.
    // If all data points are <= 1, the status is 'normal'.
    // Otherwise, the status is 'mixed'.
    if (recentLoadAverageDataPoints.every(dataPoint => dataPoint.value > 1)) return 'high'
    if (recentLoadAverageDataPoints.every(dataPoint => dataPoint.value <= 1)) return 'normal'

    return 'mixed'
  }, [loadAverageDataPoints])

  const previousEventTypeRef = useRef<LoadStatusEventType | null>(null)

  const [statusEvents, setStatusEvents] = useState<LoadStatusEvent[]>([])

  useEffect(() => {
    // If there are no data points yet, no action is taken
    if (loadAverageDataPoints.length === 0) return

    // If the time difference between the oldest and newest data points is less than STATUS_TIME_WINDOW, no action is taken
    const oldestDataPoint = loadAverageDataPoints[0]
    const newestDataPoint = loadAverageDataPoints[loadAverageDataPoints.length - 1]
    const timeDifference = newestDataPoint.timestamp - oldestDataPoint.timestamp
    if (timeDifference < STATUS_TIME_WINDOW) return

    if (
      recentLoadAverageLevel === 'high' &&
      (previousEventTypeRef.current === null || previousEventTypeRef.current === 'recovered')
    ) {
      setStatusEvents(prevEvents => [
        ...prevEvents,
        { type: 'high', timestamp: newestDataPoint.timestamp },
      ])
      previousEventTypeRef.current = 'high'
    } else if (recentLoadAverageLevel === 'normal' && previousEventTypeRef.current === 'high') {
      setStatusEvents(prevEvents => [
        ...prevEvents,
        { type: 'recovered', timestamp: newestDataPoint.timestamp },
      ])
      previousEventTypeRef.current = 'recovered'
    }
  }, [loadAverageDataPoints, recentLoadAverageLevel])

  return { statusEvents }
}
