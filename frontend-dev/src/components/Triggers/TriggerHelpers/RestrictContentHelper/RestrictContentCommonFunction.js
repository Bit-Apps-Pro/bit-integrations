import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllLevels = (data, setFlow) => {
  const loadPostTypes = bitsFetch(
    null,
    'restrictContent_Get_All_Levels',
    null,
    'GET',
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allMembership = result.data
      setFlow({ ...tmpFlow })
      return 'Fetched allMembership successfully'
    }
    return 'allMembership fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading allMembership...'),
  })
}

export default getAllLevels
