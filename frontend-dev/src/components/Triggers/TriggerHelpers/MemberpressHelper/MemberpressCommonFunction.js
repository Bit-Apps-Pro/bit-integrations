import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllMembership = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_membership', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allMemberships = result.data

      setFlow({ ...tmpFlow })
      return 'All membership fetched successfully'
    }
    return 'Membership fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Membership...'),
  })
}

export const getAllOneTimeMembership = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_onetime_membership', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.oneTimeMembership = result.data

      setFlow({ ...tmpFlow })
      return 'Fetched one time membership successfully'
    }
    return 'One time membership fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading one time membership...'),
  })
}

export const getAllRecurringMembership = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    'get_all_recurring_membership',
    null,
    'GET',
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.recurringMembership = result.data
      setFlow({ ...tmpFlow })
      return 'Fetched recurring membership successfully'
    }
    return 'Recurring membership fetching failed. please try again'
  })
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading recurring membership...'),
  })
}
