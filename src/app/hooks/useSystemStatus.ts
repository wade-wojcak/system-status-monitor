import { useCallback, useEffect, useState } from 'react'
import { DATAPOINT_TIME_WINDOW, REFETCH_INTERVAL } from '../CONSTANTS'
import { SystemStatusAPIResponse } from '../api/system/status/route'

/**
 * Load Average Data Point Type.
 *
 * @typedef {Object} LoadAverageDataPoint
 * @property {number} timestamp - The timestamp of the data point.
 * @property {number} value - The value of the data point.
 */
export type LoadAverageDataPoint = {
  timestamp: number
  value: number
}

/**
 * Use System Status Return Type.
 *
 * @typedef {Object} UseSystemStatusReturn
 * @property {LoadAverageDataPoint[]} loadAverageDataPoints - The list of load average data points.
 */
export type UseSystemStatusReturn = {
  loadAverageDataPoints: LoadAverageDataPoint[]
}

/**
 * useSystemStatus Hook.
 *
 * Hook for monitoring system status. This hook periodically fetches system status data from the API and maintains a rolling window of data points.
 *
 * @returns {UseSystemStatusReturn} - An object containing the list of load average data points.
 */
export const useSystemStatus = (): UseSystemStatusReturn => {
  const [loadAverageDataPoints, setLoadAverageDataPoints] = useState<LoadAverageDataPoint[]>([])

  // Fetch system status data from the API
  const fetchSystemStatus = useCallback(
    async (signal: AbortSignal) => {
      try {
        const response = await fetch('/api/system/status', { method: 'GET', signal })

        const { loadAverage } = (await response.json()) as SystemStatusAPIResponse

        // Create a new data point with the current load average
        const newDataPoint: LoadAverageDataPoint = {
          timestamp: new Date().getTime(),
          value: loadAverage ?? 0,
        }

        // Update the list of load average data points
        setLoadAverageDataPoints(prevDataPoints => {
          const currentTimeWindow = new Date(Date.now() - DATAPOINT_TIME_WINDOW).getTime()

          // Filter out any data points that are older than the time window
          const updatedData = [...prevDataPoints, newDataPoint].filter(
            dataPoint => dataPoint.timestamp >= currentTimeWindow,
          )

          return updatedData
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    },
    [setLoadAverageDataPoints],
  )

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    // Fetch system status data every REFETCH_INTERVAL milliseconds
    fetchSystemStatus(signal)
    const timer = setInterval(() => fetchSystemStatus(signal), REFETCH_INTERVAL)

    return () => {
      clearInterval(timer)
      controller.abort()
    }
  }, [fetchSystemStatus])

  return {
    loadAverageDataPoints,
  }
}
