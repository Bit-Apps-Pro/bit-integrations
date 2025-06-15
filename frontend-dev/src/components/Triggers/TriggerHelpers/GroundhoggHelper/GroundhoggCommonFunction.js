import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'
import { create } from 'mutative'

export const getAllGroundhoggTags = (data, setFlow) => {
  const loadPostTypes = bitsFetch({}, `${data.triggered_entity.toLowerCase()}/get/tags`, null, 'GET').then((result) => {
    if (result && result.success) {
      setFlow(prevFlow => create(prevFlow, (draftFlow) => {
        draftFlow.flow_details['allTag'] = result.data
      }))
      return 'All Groundhogg tags fetched successfully'
    }
    return 'Groundhogg tags fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Tags...'),
  })
}