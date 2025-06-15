import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

const getAllCommissionType = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_commission_type', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.AllCommissionType = result.data

      setFlow({ ...tmpFlow })
      return __('All SliceWp commission type fetched successfully', 'bit-integrations')
    }
    return __('SliceWp commission type fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading type...')
  })
}

export default getAllCommissionType
