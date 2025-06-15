import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, learnDashConf, setLearnDashConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...learnDashConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }

  newConf[e.target.name] = e.target.value
  setLearnDashConf({ ...newConf })
}

export const fetchAllCourse = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: learnDashConf.domainName }
  bitsFetch(requestParams, 'learDash_fetch_all_course')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allCourse = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Course fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Course fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllGroup = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: learnDashConf.domainName }
  bitsFetch(requestParams, 'learDash_fetch_all_group')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allGroup = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Group fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Group fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}
export const fetchAllCourseOfLesson = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { courseId: learnDashConf.courseId }
  bitsFetch(requestParams, 'learDash_fetch_all_course_of_lesson')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.courseByLesson = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Lesson fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Lesson fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllTopicOfLesson = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { courseId: learnDashConf.courseId, lessonId: learnDashConf.lessonId }
  bitsFetch(requestParams, 'learDash_fetch_all_topic_of_lesson')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allTopics = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Topic fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Topic fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllQuiz = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { courseId: learnDashConf.courseId, lessonId: learnDashConf.lessonId }
  bitsFetch(requestParams, 'learDash_fetch_all_quiz')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allQuiz = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Quiz fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Quiz fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}
export const fetchAllCourseUnenroll = (learnDashConf, setLearnDashConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: learnDashConf.domainName }
  bitsFetch(requestParams, 'learDash_fetch_all_course_unenroll')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...learnDashConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allCourseUnenroll = result.data
        }
        setLearnDashConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Course fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Course fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  setError({})
  setIsLoading(true)

  const requestParams = { domainName: confTmp.domainName }

  bitsFetch(requestParams, 'learnDash_authorize')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setConf(newConf)
        setisAuthorized(true)
        setIsLoading(false)
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Authorized failed', 'bit-integrations'))
    })
}

export const generateMappedField = (learnDashConf) => {
  const requiredFlds = learnDashConf?.createGroupFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', learnDeshFormField: field.key })) : [{ formField: '', learnDeshFormField: '' }]
}

export const checkMappedFields = (learnDashConf) => {
  const mappedFleld = learnDashConf.field_map ? learnDashConf.field_map.filter(mapped => (!mapped.formField && !mapped.learnDeshFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
