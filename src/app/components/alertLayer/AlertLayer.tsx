import { memo, useEffect, useState } from 'react'
import { LoadStatusEventType, StatusEvent } from '../../hooks/useStatusEvents'
import { MergeClassNames, UIStrings } from '../../util'
import { Icon } from '../icon'
import { Modal } from '../modal'

/**
 * Alert Layer Props Type.
 *
 * @typedef {Object} AlertLayerProps
 * @property {StatusEvent[]} statusEvents - The list of status events.
 */
export type AlertLayerProps = {
  statusEvents: StatusEvent[]
}

/**
 * Component for displaying an alert modal when a status event is triggered.
 * The alert dialog is triggered when a status event is triggered and is automatically dismissed after 5 seconds.
 *
 * @param {AlertLayerProps} props - An object containing the new status event.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const AlertLayer = memo((props: AlertLayerProps) => {
  const { statusEvents } = props

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // If there or no status events to display, do nothing
    if (statusEvents.length === 0) return

    setIsOpen(true)

    // Automatically close the modal after 5 seconds
    const timeout = setTimeout(() => {
      setIsOpen(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [statusEvents])

  const renderStatusIcon = (type: LoadStatusEventType) => {
    switch (type) {
      case 'high':
        return <Icon type='error' className='h-8 w-8' />
      case 'recovered':
        return <Icon type='check' className='h-8 w-8' />
      default:
        return null
    }
  }

  const renderStatusEventModal = () => {
    if (statusEvents.length === 0) return null

    const { type } = statusEvents[0]

    const eventTypeTextColor = UIStrings.statusEvent[type].textColor

    return (
      <Modal
        headerText={UIStrings.statusEvent.alert.title}
        panelClasses='w-full max-w-[400px] flex flex-col'
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        <div className='flex w-full flex-col gap-y-5 p-5'>
          <p
            className={MergeClassNames(
              'flex flex-row items-center gap-x-1 text-2xl font-bold',
              eventTypeTextColor,
            )}
          >
            {renderStatusIcon(type)}
            {UIStrings.statusEvent[type].title}
          </p>
          <p>{UIStrings.statusEvent[type].message}</p>
          <p>{UIStrings.statusEvent.alert.message}</p>
        </div>
      </Modal>
    )
  }

  return (
    <div
      aria-live='assertive'
      className='pointer-events-none fixed inset-0 z-[9999] flex h-[100dvh] w-full flex-col items-end'
    >
      {renderStatusEventModal()}
    </div>
  )
})

AlertLayer.displayName = 'AlertLayer'
