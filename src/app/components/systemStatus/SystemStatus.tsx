import { memo, useMemo } from 'react'
import { StatusEvent } from '../../hooks/useStatusEvents'
import type { LoadAverageDataPoint } from '../../hooks/useSystemStatus'
import { MergeClassNames, UIStrings } from '../../util'
import { Card } from '../card'
import { Icon } from '../icon'

/**
 * System Status Props Type.
 *
 * @typedef {Object} SystemStatusProps
 * @property {LoadAverageDataPoint[]} loadAverageDataPoints - The list of load average data points.
 * @property {StatusEvent[]} statusEvents - The list of status events.
 */
export type SystemStatusProps = {
  loadAverageDataPoints: LoadAverageDataPoint[]
  statusEvents: StatusEvent[]
}

/**
 * Load Status Type.
 *
 * @typedef {string} LoadStatus
 * Possible values are:
 * - 'normal': The system is not under high load.
 * - 'high': The system is under high load.
 */
export type LoadStatus = 'normal' | 'high'

/**
 * Component for displaying the system's status.
 * The component displays various information in a simple table format.
 *
 * @param {SystemStatusProps} props - An object containing the CPU count, the list of load average data points, and the current load status.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const SystemStatus = memo((props: SystemStatusProps) => {
  const { loadAverageDataPoints, statusEvents } = props

  const currentLoadStatus: LoadStatus = useMemo(() => {
    if (loadAverageDataPoints.length === 0) return 'normal'

    return loadAverageDataPoints[loadAverageDataPoints.length - 1].value > 1 ? 'high' : 'normal'
  }, [loadAverageDataPoints])

  const renderRow = (
    label: string,
    value: string | React.ReactNode,
    isLastRow: boolean = false,
  ) => {
    return (
      <div
        className={MergeClassNames(
          'grid grid-cols-2 gap-x-2.5 px-5 py-2.5',
          !isLastRow && 'border-b border-b-gray-400',
        )}
      >
        <div className='font-medium'>{label}</div>
        <div className='flex flex-row justify-end text-right'>{value}</div>
      </div>
    )
  }

  const renderLoadStatus = () => {
    if (loadAverageDataPoints.length === 0) return '-'

    const loadStatusText = UIStrings.cpuLoadStatus[currentLoadStatus].text
    const loadStatusColor = UIStrings.cpuLoadStatus[currentLoadStatus].textColor

    let statusIcon: React.ReactNode

    switch (currentLoadStatus) {
      case 'high':
        statusIcon = <Icon type='error' />
        break
      case 'normal':
        statusIcon = <Icon type='check' />
        break
      default:
        statusIcon = null
        break
    }

    return (
      <span
        className={MergeClassNames('flex flex-row items-center gap-x-1 font-bold', loadStatusColor)}
      >
        {statusIcon}
        {loadStatusText}
      </span>
    )
  }

  const renderCurrentLoadAverage = () => {
    if (loadAverageDataPoints.length === 0) return '-'

    const mostRecentLoadAverage = loadAverageDataPoints[loadAverageDataPoints.length - 1]

    return mostRecentLoadAverage.value.toFixed(2)
  }

  const renderLastUpdated = () => {
    if (loadAverageDataPoints.length === 0) return '-'

    const mostRecentLoadAverage = loadAverageDataPoints[loadAverageDataPoints.length - 1]

    // Format the timestamp as a localized string
    return new Date(mostRecentLoadAverage.timestamp).toLocaleTimeString()
  }

  const renderNumberOfHighLoadEvents = () => {
    return statusEvents.filter(statusEvent => statusEvent.type === 'high').length
  }

  const renderNumberOfRecoveredLoadEvents = () => {
    return statusEvents.filter(statusEvent => statusEvent.type === 'recovered').length
  }

  return (
    <Card title='System Status' className='h-full'>
      <div className='flex w-full flex-col'>
        {renderRow('Current CPU Load Status', renderLoadStatus())}
        {renderRow('Current CPU Load Average', renderCurrentLoadAverage())}
        {renderRow('Last Updated', renderLastUpdated())}
        {renderRow('# of High Load Events', renderNumberOfHighLoadEvents())}
        {renderRow('# of Recovered Events', renderNumberOfRecoveredLoadEvents(), true)}
      </div>
    </Card>
  )
})

SystemStatus.displayName = 'SystemStatus'
