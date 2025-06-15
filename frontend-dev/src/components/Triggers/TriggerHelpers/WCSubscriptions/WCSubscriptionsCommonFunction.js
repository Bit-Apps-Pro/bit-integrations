import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getWCSubscriptionsAllSubscriptions = (data, setFlow) => {
  const loadJobTypes = bitsFetch(null, 'wcsubscriptions/get/subscriptions', null, 'GET').then(
    (result) => {
      if (result && result.data) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.allSubscriptions = result.data
        setFlow({ ...tmpFlow })
        return __('Subscriptions fetched successfully', 'bit-integrations')
      }
      return __('Subscriptions fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadJobTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Subscriptions...')
  })
}
export const getWCSubscriptionsAllSubscriptionProducts = (data, setFlow) => {
  const loadJobTypes = bitsFetch(
    { id: data.triggered_entity_id },
    'wcsubscriptions/get/subscription-products',
    null,
    'POST'
  ).then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allSubscriptionProducts = result.data
      setFlow({ ...tmpFlow })
      return __('Subscription Products fetched successfully', 'bit-integrations')
    }
    return __('Subscription Products fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadJobTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Subscription Products...')
  })
}
