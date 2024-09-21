import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { type LoadAverageDataPoint } from '../../hooks/useSystemStatus'
import { Card } from '../card'

/**
 * Chart Props Type.
 *
 * @typedef {Object} ChartProps
 * @property {LoadAverageDataPoint[]} loadAverageDataPoints - The list of load average data points.
 */
export type ChartProps = {
  loadAverageDataPoints: LoadAverageDataPoint[]
}

/**
 * Component for displaying a chart of the system's load average over time.
 * Utilizes the Recharts library for rendering an area chart.
 *
 * @param {ChartProps} props - An object containing the list of load average data points.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const Chart = (props: ChartProps) => {
  const { loadAverageDataPoints } = props

  // Create a chart data array from the load average data points
  // This array is utilized by the Recharts library to render the chart
  // The purpose of this array is to convert the timestamp and value propertiees to more human-readable strings
  const chartData = useMemo(() => {
    return loadAverageDataPoints.map(loadAverageDataPoints => ({
      timestamp: new Date(loadAverageDataPoints.timestamp).toLocaleTimeString(),
      value: loadAverageDataPoints.value.toFixed(2),
    }))
  }, [loadAverageDataPoints])

  return (
    <Card title='Load Average Over Time'>
      <div className='flex h-[300px] w-full flex-col px-5 py-10'>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <YAxis dx={-5} tick={{ fontSize: 12, color: '#000000' }} />
            <XAxis
              dataKey='timestamp'
              tickLine={true}
              dy={10}
              tick={{ fontSize: 12, color: '#000000' }}
            />
            <Tooltip
              separator=': '
              formatter={(value: string, name: string) => {
                if (name === 'value') return [value, 'Load Average']
                return [value, name]
              }}
              cursor={{
                stroke: '#000000',
                strokeWidth: 2,
              }}
            />
            <Area type='monotone' dataKey='value' stroke={'#ef4444'} fill={'#ef4444'} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
