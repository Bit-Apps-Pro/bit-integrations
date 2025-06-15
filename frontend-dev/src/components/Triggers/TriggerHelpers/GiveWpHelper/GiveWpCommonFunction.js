import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

const getAllDonationForms = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_donation_form', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allDonationForms = result.data

      setFlow({ ...tmpFlow })
      return 'All donation forms fetched successfully'
    }
    return 'Donation forms fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading donation from...'),
  })
}

export function getAllRecurringDonationForms (data, setFlow) {
  const loadPostTypes = bitsFetch(null, 'get_all_recurring_donation_form', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allRecurringForms = result.data
      setFlow({ ...tmpFlow })
      return 'All recurring donation forms fetched successfully'
    }
    return 'Recurring donation forms fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading recurring donation from...'),
  })
}

export default getAllDonationForms
