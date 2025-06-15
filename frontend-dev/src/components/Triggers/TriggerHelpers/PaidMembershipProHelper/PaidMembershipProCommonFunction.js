import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export default function getAllPaidMembershipProLevel(data, setFlow) {
  const loadPostTypes = bitsFetch(null, 'get_all_paid_membership_pro_level', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.AllMembershipLevels = result.data
      setFlow({ ...tmpFlow })
      return 'All membership level fetched successfully'
    }
    return 'Membership level fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Membership level...'),
  })
}
