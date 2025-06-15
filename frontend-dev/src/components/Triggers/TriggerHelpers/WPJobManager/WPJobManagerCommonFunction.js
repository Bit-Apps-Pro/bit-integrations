import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getWPJobManagerJobTypes = (data, setFlow) => {
  const loadJobTypes = bitsFetch(null, 'wpjobmanager/get/job-types', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.jobTypes = result.data
      setFlow({ ...tmpFlow })
      return __('Types fetched successfully', 'bit-integrations')
    }
    return __('Types fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadJobTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Types...')
  })
}

export const getWPJobManagerJobs = (data, setFlow) => {
  const loadJobs = bitsFetch(null, 'wpjobmanager/get/jobs', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.jobList = result.data
      setFlow({ ...tmpFlow })
      return __('Jobs fetched successfully', 'bit-integrations')
    }
    return __('Jobs fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadJobs, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Jobs...')
  })
}

export const getApplicationStatuses = (data, setFlow) => {
  const loadStatuses = bitsFetch(null, 'wpjobmanager/get/application-statuses', null, 'GET')
    .then((result) => {
      if (result && result.data) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.statusList = result.data
        setFlow({ ...tmpFlow })
        return 'Application statuses fetched successfully'
      }
      return 'Application statuses fetching failed. please try again'
    })
  toast.promise(loadStatuses, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading application statuses...'),
  })
}