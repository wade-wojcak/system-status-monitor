'use client'

import { useStatusEvents } from '../../hooks/useStatusEvents'
import { useSystemStatus } from '../../hooks/useSystemStatus'
import { AlertLayer } from '../alertLayer'
import { Chart } from '../datavis'
import { EventLog } from '../eventLog'
import { Icon } from '../icon'
import { SystemStatus } from '../systemStatus'

/**
 * Container component for the home page.
 *
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const HomeContainer = () => {
  const { loadAverageDataPoints } = useSystemStatus()
  const { statusEvents } = useStatusEvents({ loadAverageDataPoints })

  return (
    <div className='mx-auto max-w-screen-2xl'>
      <div className='flex w-full flex-col gap-y-10 p-10'>
        <span className='flex items-center gap-x-2.5'>
          <Icon type='monitor' className='h-11 w-11' />
          <h1 className='text-4xl font-bold'>System Status Monitor</h1>
        </span>
        <div className='grid grid-cols-1 items-start gap-y-10 xl:grid-cols-3 xl:gap-x-10 2xl:items-stretch'>
          <div className='col-auto lg:col-span-1'>
            <SystemStatus
              loadAverageDataPoints={loadAverageDataPoints}
              statusEvents={statusEvents}
            />
          </div>
          <div className='col-auto lg:col-span-2'>
            <EventLog statusEvents={statusEvents} />
          </div>
        </div>
        <Chart loadAverageDataPoints={loadAverageDataPoints} />
      </div>
      <AlertLayer statusEvents={statusEvents} />
    </div>
  )
}
