import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'

export const handleInput = (e, tutorlmsConf, setTutorlmsConf, setIsLoading, setSnackbar) => {
  let newConf = deepCopy(tutorlmsConf)
  const { name, value } = e.target
  newConf[name] = value

  switch (name) {
    case 'module':
      newConf = moduleChange(newConf, setTutorlmsConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setTutorlmsConf(newConf)
}

export const moduleChange = (tutorlmsConf, setTutorlmsConf, setIsLoading, setSnackbar) => {
  let newConf = deepCopy(tutorlmsConf)
  newConf.field_map = []

  if (!newConf?.default?.fields?.[tutorlmsConf.module]) {
    refreshFields(newConf, setTutorlmsConf, setIsLoading, setSnackbar)
  } else {
    newConf = generateMappedFields(newConf)
  }

  return newConf
}

export const getAllCourses = (tutorlmsConf, setTutorlmsConf, setIsLoading, value = null) => {
  setIsLoading(true)
  const queryParams = { type: value }
  const loadPostTypes = bitsFetch(null, 'tutor_all_course', queryParams, 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...tutorlmsConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.courses = result.data
        setTutorlmsConf({ ...newConf })
        setIsLoading(false)
        return 'Courses fetched successfully'
      }
      setIsLoading(false)
      return 'Courses fetch failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Courses...'),
  })
}

export const getAllLesson = (tutorlmsConf, setTutorlmsConf, setIsLoading) => {
  setIsLoading(true)
  const loadPostTypes = bitsFetch(null, 'tutor_all_lesson', '', 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...tutorlmsConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.lessons = result.data
        setTutorlmsConf({ ...newConf })
        setIsLoading(false)
        return 'Lessons fetched successfully'
      }
      setIsLoading(false)
      return 'Lessons fetch failed, please try again...'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Lessons...'),
  })
}

const generateMappedFields = tutorlmsConf => {
  const newConf = deepCopy(tutorlmsConf)
  newConf.default.fields[newConf.module].required.forEach(reqFld => {
    if (!newConf.field_map.find(fld => fld.wcField === reqFld)) {
      newConf.field_map.unshift({ formField: '', wcField: reqFld, required: true })
    }
  })
  if (!newConf.field_map.length) newConf.field_map = [{ formField: '', wcField: '' }]
  return newConf
}
