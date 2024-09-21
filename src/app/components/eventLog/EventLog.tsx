import { Transition } from '@headlessui/react'
import { memo, useMemo } from 'react'
import { LoadStatusEventType, type StatusEvent } from '../../hooks/useStatusEvents'
import { MergeClassNames, UIStrings } from '../../util'
import { Card } from '../card'
import { Icon } from '../icon'

/**
 * Event Log Props Type.
 *
 * @typedef {Object} EventLogProps
 * @property {StatusEvent[]} statusEvents - The list of status events.
 */
export type EventLogProps = {
  statusEvents: StatusEvent[]
}

/**
 * Component for displaying a log of status events.
 * The event log is a scrollable list of status events, sorted by timestamp in descending order.
 *
 * @param {EventLogProps} props - An object containing the list of status events.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const EventLog = memo((props: EventLogProps) => {
  const { statusEvents } = props

  // Sort the status events by timestamp in descending order
  const sortedStatusEvents = useMemo(() => {
    if (statusEvents.length === 0) return []

    return statusEvents.sort((a, b) => b.timestamp - a.timestamp)
  }, [statusEvents])

  const renderHeader = () => {
    return (
      <div className='flex w-full flex-row border-b border-b-black bg-gray-200 px-2.5 py-2.5 font-bold'>
        <div className='w-[140px] px-2.5'>Event Type</div>
        <div className='w-[140px] px-2.5'>Timestamp</div>
        <div className='w-auto px-2.5'>Message</div>
      </div>
    )
  }

  const renderStatusIcon = (type: LoadStatusEventType) => {
    switch (type) {
      case 'high':
        return <Icon type='error' />
      case 'recovered':
        return <Icon type='check' />
      default:
        return null
    }
  }

  const getTimeString = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const renderEvents = () => {
    return (
      <div className='flex max-h-[225px] w-full flex-col items-start overflow-y-auto xl:max-h-[180px]'>
        {sortedStatusEvents.map(event => {
          const { type, timestamp } = event

          const eventTypeTextColor = UIStrings.statusEvent[type].textColor

          return (
            <div
              key={timestamp}
              className='flex w-full flex-row border-b border-b-gray-400 px-2.5 py-2.5 even:bg-gray-50'
            >
              <Transition
                show={true}
                appear
                enter='ease-out duration-500'
                enterFrom='opacity-0 translate-x-5'
                enterTo='opacity-100 translate-x-0'
              >
                <div className='flex w-full flex-row'>
                  <div
                    className={MergeClassNames(
                      'flex w-[140px] flex-row items-center gap-x-1 whitespace-nowrap px-2.5 font-bold',
                      eventTypeTextColor,
                    )}
                  >
                    {renderStatusIcon(type)}
                    {UIStrings.statusEvent[type].title}
                  </div>
                  <div className='w-[140px] whitespace-nowrap px-2.5'>
                    {getTimeString(timestamp)}
                  </div>
                  <div className='w-auto truncate px-2.5'>
                    {UIStrings.statusEvent[type].message}
                  </div>
                </div>
              </Transition>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card title='Event Log'>
      {renderHeader()}
      <div className='relative flex h-full min-h-[180px] w-full flex-col'>
        {sortedStatusEvents.length === 0 && (
          <div className='absolute inset-0 flex h-full w-full flex-col items-center justify-center text-lg'>
            {UIStrings.statusEvent.fallback}
          </div>
        )}
        {sortedStatusEvents.length > 0 && renderEvents()}
      </div>
    </Card>
  )
})

EventLog.displayName = 'EventLog'
