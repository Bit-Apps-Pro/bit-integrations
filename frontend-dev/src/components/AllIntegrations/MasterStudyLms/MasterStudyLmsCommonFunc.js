import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, msLmsConf, setMsLmsConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...msLmsConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setMsLmsConf({ ...newConf })
}

export const generateMappedField = (msLmsConf) => {
  const requiredFlds = msLmsConf?.createGroupFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', msLmsFormField: field.key })) : [{ formField: '', msLmsFormField: '' }]
}

export const checkMappedFields = (msLmsConf) => {
  const mappedFleld = msLmsConf.field_map ? msLmsConf.field_map.filter(mapped => (!mapped.formField && !mapped.msLmsFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const fetchAllMsLmsCourse = (msLmsConf, setMsLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const queryPrarms = { courseId: msLmsConf.courseId }
  bitsFetch({}, 'mslms_fetch_all_course')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...msLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allCourse = result.data
        }
        setMsLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Course fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Course fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllLesson = (msLmsConf, setMsLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const queryPrarms = { courseId: msLmsConf.courseId }
  bitsFetch(queryPrarms, 'msLms_fetch_all_lesson')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...msLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLesson = result.data
        }
        setMsLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Lesson fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Lesson fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const fetchAllQuiz = (msLmsConf, setMsLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const queryPrarms = { courseId: msLmsConf.courseId }
  bitsFetch(queryPrarms, 'msLms_fetch_all_quiz')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...msLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allQuiz = result.data
        }
        setMsLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Quiz fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Quiz fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}