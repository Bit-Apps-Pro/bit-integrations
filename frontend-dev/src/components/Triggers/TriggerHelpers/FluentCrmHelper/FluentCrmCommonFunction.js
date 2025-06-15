import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getFluentCrmTags = (data, setFlow) => {
  const loadTags = bitsFetch(null, 'get_fluentCrm_tags', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.tags = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched tags successfully', 'bit-integrations')
    }
    return __('Tags fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadTags, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Tags...')
  })
}

export const getFluentCrmLists = (data, setFlow) => {
  const loadLists = bitsFetch(null, 'get_fluentCrm_lists', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.lists = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched List successfully', 'bit-integrations')
    }
    return __('List fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadLists, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading List...')
  })
}

export const getFluentCrmStatus = (data, setFlow) => {
  const loadStatus = bitsFetch(null, 'get_fluentCrm_status', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.status = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched Status successfully', 'bit-integrations')
    }
    return __('Status fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadStatus, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Status...')
  })
}
