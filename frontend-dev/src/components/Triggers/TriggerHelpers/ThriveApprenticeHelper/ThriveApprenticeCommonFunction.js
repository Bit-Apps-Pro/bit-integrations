import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllThriveApprenticeCourse = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_thriveapprentice_all_course', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allCourse = result.data

      setFlow({ ...tmpFlow })
      return 'All ThriveApprentice course fetched successfully'
    }
    return 'ThriveApprentice course fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading course...'),
  })
}

export const getAllThriveApprenticeLesson = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_thriveapprentice_all_lesson', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allLesson = result.data

      setFlow({ ...tmpFlow })
      return 'All ThriveApprentice lesson fetched successfully'
    }
    return 'ThriveApprentice lesson fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading lesson...'),
  })
}

export const getAllThriveApprenticeModule = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_thriveapprentice_all_module', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allModule = result.data

      setFlow({ ...tmpFlow })
      return 'All ThriveApprentice module fetched successfully'
    }
    return 'ThriveApprentice module fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading module...'),
  })
}


