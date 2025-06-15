import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getLessonByCourse = (val, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = { course_id: val }
  const loadPostTypes = bitsFetch(null, 'get_all_lessons_by_course', queryParams, 'GET').then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...tmpNewFlow }
        if (!edit) {
          newConf.triggerData.lessons = result.data
        } else {
          newConf.flow_details.lessons = result.data
        }
        setNewFlow({ ...newConf })
        return __('Fetched Lesson successfully', 'bit-integrations')
      }
      return __('Lessons fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Lesson...')
  })
}

export const getTopicByLesson = (val, course_id, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = {
    lesson_id: val,
    course_id
  }
  const loadPostTypes = bitsFetch(null, 'get_all_topic_by_lesson', queryParams, 'GET').then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...tmpNewFlow }
        if (!edit) {
          newConf.triggerData.topics = result.data
        } else {
          newConf.flow_details.topics = result.data
        }
        setNewFlow({ ...newConf })
        return __('Fetched Topic successfully', 'bit-integrations')
      }
      return __('Topics fetching failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Topic...')
  })
}

export const getAllCourses = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_courses', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.courses = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched courses successfully', 'bit-integrations')
    }
    return __('Courses fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Courses...')
  })
}

export const getAllQuizes = (data, setFlow) => {
  const loadQuizType = bitsFetch(null, 'get_all_quizes', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.quizes = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched quizes successfully', 'bit-integrations')
    }
    return __('Quizes fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Quizes...')
  })
}

export const getAllGroups = (data, setFlow) => {
  const loadQuizType = bitsFetch(null, 'get_all_groups', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.groups = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched groups successfully', 'bit-integrations')
    }
    return __('groups fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Groups...')
  })
}
