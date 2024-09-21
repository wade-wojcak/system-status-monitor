/**
 * User Interface string values.
 */
export const UIStrings = {
  cpuLoadStatus: {
    normal: {
      text: 'Normal Load',
      textColor: 'text-green-700',
    },
    high: {
      text: 'High Load',
      textColor: 'text-red-600',
    },
  },
  statusEvent: {
    alert: {
      title: 'New Status Event',
      message: 'Please check the event log for more details.',
    },
    fallback: 'No status events recorded yet',
    high: {
      title: 'High Load',
      message: 'Caution! The CPU has been under high load for an extended period of time.',
      textColor: 'text-red-600',
    },
    recovered: {
      title: 'Recovered',
      message: 'The CPU has recovered from a period of high load and has returned to normal.',
      textColor: 'text-green-700',
    },
  },
}
