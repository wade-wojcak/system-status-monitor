import os, { type CpuInfo } from 'os'

/**
 * System Status API Response Type.
 *
 * @typedef {Object} SystemStatusAPIResponse
 * @property {number} loadAverage - The normalized 1-minute CPU load average.
 */
export type SystemStatusAPIResponse = {
  loadAverage: number
}

/**
 *
 * System Status API Route Handler (GET)
 *
 * This function retrieves information about the system's status and returns it as a JSON response.
 *
 * @returns {Promise<Response>} - A JSON response containing the normalized 1-minute CPU load average (number).
 */
const GET = async () => {
  const cpus: CpuInfo[] = os.cpus()
  const cpuCount: number = cpus.length
  const loadAverages: number[] = os.loadavg()

  // Get the 1-minute load average
  const oneMinuteLoadAverage: number = loadAverages[0]

  // Calculate the normalized load average by dividing the 1-minute load average by the number of CPUs
  const normalizedLoadAverage: number = oneMinuteLoadAverage / cpuCount

  const response: SystemStatusAPIResponse = { loadAverage: normalizedLoadAverage }

  return Response.json(response)
}

/**
 * Prevents the API response from being cached.
 */
const revalidate: number = 0

export { GET, revalidate }
