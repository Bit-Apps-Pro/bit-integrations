import toast from 'react-hot-toast'
import { deepCopy } from '../../../Utils/Helpers'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, academyLmsConf, setAcademyLmsConf, setIsLoading, setSnackbar) => {
  let newConf = deepCopy(academyLmsConf)
  const { name, value } = e.target
  newConf[name] = value

  switch (name) {
    case 'module':
      newConf = moduleChange(newConf, setAcademyLmsConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setAcademyLmsConf(newConf)
}

export const moduleChange = (academyLmsConf, setAcademyLmsConf, setIsLoading, setSnackbar) => {
  let newConf = deepCopy(academyLmsConf)
  newConf.field_map = []

  if (!newConf?.default?.fields?.[academyLmsConf.module]) {
    refreshFields(newConf, setAcademyLmsConf, setIsLoading, setSnackbar)
  } else {
    newConf = generateMappedFields(newConf)
  }

  return newConf
}

export const getAllCourses = (academyLmsConf, setAcademyLmsConf, setIsLoading, value = null) => {
  setIsLoading(true)
  const queryParams = { type: value }
  const loadPostTypes = bitsFetch(null, 'academy_lms_all_course', queryParams, 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...academyLmsConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.courses = result.data
        setAcademyLmsConf({ ...newConf })
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

export const getAllLesson = (academyLmsConf, setAcademyLmsConf, setIsLoading) => {
  setIsLoading(true)
  const loadPostTypes = bitsFetch(null, 'academy_lms_all_lesson', '', 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...academyLmsConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.lessons = result.data
        setAcademyLmsConf({ ...newConf })
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

const generateMappedFields = academyLmsConf => {
  const newConf = deepCopy(academyLmsConf)
  newConf.default.fields[newConf.module].required.forEach(reqFld => {
    if (!newConf.field_map.find(fld => fld.wcField === reqFld)) {
      newConf.field_map.unshift({ formField: '', wcField: reqFld, required: true })
    }
  })
  if (!newConf.field_map.length) newConf.field_map = [{ formField: '', wcField: '' }]
  return newConf
}
