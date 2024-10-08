import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllMasterStudyLmsCourse = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_masterStudyLms_all_course', null, 'GET').then(
    (result) => {
      if (result && result.success) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.allCourse = result.data

        setFlow({ ...tmpFlow })
        return __('All MasterStudyLms course fetched successfully', 'bit-integrations')
      }
      return __('MasterStudyLms course fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading course...')
  })
}

export const getAllMasterStudyLmsLesson = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_masterStudyLms_all_lesson', null, 'GET').then(
    (result) => {
      if (result && result.success) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.allLesson = result.data

        setFlow({ ...tmpFlow })
        return __('All MasterStudyLms lesson fetched successfully', 'bit-integrations')
      }
      return __('MasterStudyLms lesson fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading lesson...')
  })
}

export const getAllMasterStudyLmsDistribution = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_masterStudyLms_all_distribution', null, 'GET').then(
    (result) => {
      if (result && result.success) {
        const tmpFlow = { ...data }
        tmpFlow.flow_details.allDistribution = result.data

        setFlow({ ...tmpFlow })
        return __('All MasterStudyLms Point Distribution fetched successfully', 'bit-integrations')
      }
      return __(
        'MasterStudyLms Point Distribution fetching failed. please try again',
        'bit-integrations'
      )
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading lesson...')
  })
}

export const getQuizByCourse = (val, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = { course_id: val }
  const loadPostTypes = bitsFetch(null, 'get_mslms_all_quiz_by_course', queryParams, 'GET').then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...tmpNewFlow }
        if (!edit) {
          newConf.triggerData.allQuiz = result.data
        } else {
          newConf.flow_details.allQuiz = result.data
        }
        setNewFlow({ ...newConf })
        return __('Fetched Quiz successfully', 'bit-integrations')
      }
      return __('Quiz fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Lesson...')
  })
}
