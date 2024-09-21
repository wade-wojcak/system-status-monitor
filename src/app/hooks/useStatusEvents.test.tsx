import { act, renderHook, waitFor } from '@testing-library/react'
import { TEST_DATA_POINTS } from './testDataPoints'
import { useStatusEvents } from './useStatusEvents'
import { LoadAverageDataPoint } from './useSystemStatus'

/**
 * Test Suite for useStatusEvents Hook.
 */
describe('useStatusEvents Hook', () => {
  /**
   * No events triggered prior to data point generation.
   * This test ensures that the hook returns an empty list of status events when no data points are provided.
   */
  it('No events triggered prior to data point generation', () => {
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints: [] }))
    expect(result.current.statusEvents.length).toEqual(0)
  })

  /**
   * No events triggered prior to minimum event window time with all "normal" data points.
   * This test ensures that the hook does not trigger any status events when all data points are "normal".
   */
  it('No events triggered prior to minimum event window time with all "normal" data points', () => {
    const loadAverageDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.normal.subWindow]
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    expect(result.current.statusEvents.length).toEqual(0)
  })

  /**
   * No events triggered prior to minimum event window time with all "high" data points.
   * This test ensures that the hook does not trigger any status events when all data points are "high".
   */
  it('No events triggered prior to minimum event window time with all "high" data points', () => {
    const loadAverageDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.high.subWindow]
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    expect(result.current.statusEvents.length).toEqual(0)
  })

  /**
   * No events triggered prior to minimum event window time with a mix of "normal" and "high" data points.
   * This test ensures that the hook does not trigger any status events when there is a mix of "normal" and "high" data points.
   */
  it('No events triggered prior to minimum event window time with a mix of "normal" and "high" data points', () => {
    const loadAverageDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.mixed.subWindow]
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    expect(result.current.statusEvents.length).toEqual(0)
  })

  /**
   * No events triggered after the minimum event window time with all "normal" data points.
   * This test ensures that the hook does not trigger any status events when all data points are "normal".
   */
  it('No events triggered after the minimum event window time with all "normal" data points', () => {
    const loadAverageDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.normal.fullWindow]
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    expect(result.current.statusEvents.length).toEqual(0)
  })

  /**
   * A "high" event is triggered after the minimum event window time with all "high" data points.
   * This test ensures that the hook triggers a "high" event when all data points are "high".
   */
  it('A "high" event is triggered after the minimum event window time with all "high" data points', () => {
    const loadAverageDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.high.fullWindow]
    const { result } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    expect(result.current.statusEvents.length).toEqual(1)
    expect(result.current.statusEvents[0].type).toEqual('high')
  })

  /**
   * After an initial full window of "normal" data points, a "high" event is triggered.
   * This test ensures that the hook triggers a "high" event when the data points transition from "normal" to "high".
   */
  it('After an initial full window of "normal" data points, a "high" event is triggered', () => {
    const normalDataPoints: LoadAverageDataPoint[] = [
      ...TEST_DATA_POINTS.transitions.normalToHigh[0],
    ]
    const highDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.transitions.normalToHigh[1]]

    let loadAverageDataPoints: LoadAverageDataPoint[] = []

    const { result, rerender } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    // Step 1: add normal data points and expect no events
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...normalDataPoints]
      rerender({ loadAverageDataPoints })
    })

    expect(result.current.statusEvents.length).toEqual(0)

    // Step 2: add high data points and expect a 'high' event
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...highDataPoints]
      rerender({ loadAverageDataPoints })
    })

    expect(result.current.statusEvents.length).toEqual(1)
    expect(result.current.statusEvents[0].type).toEqual('high')
  })

  /**
   * Simulate transitining from "normal" to "high" and back to "recovered".
   * This test ensures that the hook triggers the appropriate status events when the data points transition from "normal" to "high" and back to "recovered".
   */
  it('Simulate transitining from "normal" to "high" and back to "recovered"', async () => {
    const norrmalDataPoints1: LoadAverageDataPoint[] = [
      ...TEST_DATA_POINTS.transitions.normalToHighToNormal[0],
    ]
    const highDataPoints: LoadAverageDataPoint[] = [
      ...TEST_DATA_POINTS.transitions.normalToHighToNormal[1],
    ]
    const normalDataPoints2: LoadAverageDataPoint[] = [
      ...TEST_DATA_POINTS.transitions.normalToHighToNormal[2],
    ]

    let loadAverageDataPoints: LoadAverageDataPoint[] = []

    const { result, rerender } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    // Step 1: add normal data points and expect no events
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...norrmalDataPoints1]
      rerender({ loadAverageDataPoints })
    })

    expect(result.current.statusEvents.length).toEqual(0)

    // Step 2: add high data points and expect a 'high' event
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...highDataPoints]
      rerender({ loadAverageDataPoints })
    })

    expect(result.current.statusEvents.length).toEqual(1)
    expect(result.current.statusEvents[0].type).toEqual('high')

    // Step 3: add normal data points and expect a 'recovered' event
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...normalDataPoints2]
      console.log(loadAverageDataPoints)
      rerender({ loadAverageDataPoints })
    })

    await waitFor(() => {
      expect(result.current.statusEvents.length).toEqual(2)
      expect(result.current.statusEvents[0].type).toEqual('high')
      expect(result.current.statusEvents[1].type).toEqual('recovered')
    })
  })

  /**
   * Simulate transitiong from "high" to "recovered".
   * This test ensures that the hook triggers the appropriate status events when the data points transition from "high" to "recovered".
   */
  it('Simulate transitiong from "high" to "recovered"', async () => {
    const highDataPoints: LoadAverageDataPoint[] = [...TEST_DATA_POINTS.transitions.highToNormal[0]]
    const normalDataPoints: LoadAverageDataPoint[] = [
      ...TEST_DATA_POINTS.transitions.highToNormal[1],
    ]

    let loadAverageDataPoints: LoadAverageDataPoint[] = []

    const { result, rerender } = renderHook(() => useStatusEvents({ loadAverageDataPoints }))

    // Step 1: add high data points and expect a 'high' event
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...highDataPoints]
      rerender({ loadAverageDataPoints })
    })

    await waitFor(() => {
      expect(result.current.statusEvents.length).toEqual(1)
      expect(result.current.statusEvents[0].type).toEqual('high')
    })

    // Step 2: add normal data points and expect a 'recovered' event
    act(() => {
      loadAverageDataPoints = [...loadAverageDataPoints, ...normalDataPoints]
      rerender({ loadAverageDataPoints })
    })

    await waitFor(() => {
      expect(result.current.statusEvents.length).toEqual(2)
      expect(result.current.statusEvents[1].type).toEqual('recovered')
    })
  })
})
