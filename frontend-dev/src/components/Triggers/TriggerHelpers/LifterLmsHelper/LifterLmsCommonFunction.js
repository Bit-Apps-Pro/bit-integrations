import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllLifterLmsQuiz = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_lifterLms_all_quiz', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allQuiz = result.data

      setFlow({ ...tmpFlow })
      return __('All LifterLms quiz fetched successfully', 'bit-integrations')
    }
    return __('LifterLms quiz fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading quiz...')
  })
}

export const getAllLifterLmsLesson = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_lifterLms_all_lesson', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allQuiz = result.data

      setFlow({ ...tmpFlow })
      return __('All LifterLms lesson fetched successfully', 'bit-integrations')
    }
    return __('LifterLms lesson fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading lesson...')
  })
}

export const getAllLifterLmsCourse = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_lifterLms_all_course', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allCourse = result.data

      setFlow({ ...tmpFlow })
      return __('All LifterLms course fetched successfully', 'bit-integrations')
    }
    return __('LifterLms course fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading course...')
  })
}

export const getAllLifterLmsMembership = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_lifterLms_all_membership', null, 'GET').then(
    (result) => {
      if (result && result.success) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.allMembership = result.data

        setFlow({ ...tmpFlow })
        return __('All LifterLms membership fetched successfully', 'bit-integrations')
      }
      return __('LifterLms membership fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading membership...')
  })
}
