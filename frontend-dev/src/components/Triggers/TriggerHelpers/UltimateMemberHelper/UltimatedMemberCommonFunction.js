import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllUMrole = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_um_all_role', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allRole = result.data

      setFlow({ ...tmpFlow })
      return 'All Ultimate member role fetched successfully'
    }
    return 'Ultimate member fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading role...'),
  })
}



