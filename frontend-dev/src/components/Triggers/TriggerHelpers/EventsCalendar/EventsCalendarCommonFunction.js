import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getEventsCalendarEvents = (data, setFlow) => {
  const loadEvents = bitsFetch(null, 'eventscalendar/get/events', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.events = result.data
      setFlow({ ...tmpFlow })
      return __('Events fetched successfully', 'bit-integrations')
    }
    return __('Events fetching failed. please try again', 'bit-integrations')
  })

  toast.promise(loadEvents, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Events...')
  })
}
