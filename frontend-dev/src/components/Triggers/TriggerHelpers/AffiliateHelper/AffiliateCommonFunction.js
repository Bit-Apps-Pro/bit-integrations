import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllType = (data, setFlow) => {
  const loadPostTypes = bitsFetch(
    null,
    'affiliate_get_all_type',
    null,
    'GET',
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allType = result.data
      setFlow({ ...tmpFlow })
      return 'Fetched All Type successfully'
    }
    return 'All Type fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading All Type...'),
  })
}

export default getAllType
