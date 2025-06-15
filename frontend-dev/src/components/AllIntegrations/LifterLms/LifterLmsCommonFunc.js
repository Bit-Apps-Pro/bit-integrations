import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...lifterLmsConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setLifterLmsConf({ ...newConf })
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

export const generateMappedField = (lifterLmsConf) => {
  const requiredFlds = lifterLmsConf?.createGroupFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', lifterLmsFormField: field.key })) : [{ formField: '', lifterLmsFormField: '' }]
}

export const checkMappedFields = (lifterLmsConf) => {
  const mappedFleld = lifterLmsConf.field_map ? lifterLmsConf.field_map.filter(mapped => (!mapped.formField && !mapped.lifterLmsFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const fetchAllLesson = (lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'lifterLms_fetch_all_lesson')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...lifterLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLesson = result.data
        }
        setLifterLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Lesson fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Lesson fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllSection = (lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'lifterLms_fetch_all_section')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...lifterLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allSection = result.data
        }
        setLifterLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Section fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Section fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllCourse = (lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'lifterLms_fetch_all_course')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...lifterLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allCourse = result.data
        }
        setLifterLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Course fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Course fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllMembership = (lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'lifterLms_fetch_all_membership')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...lifterLmsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          if(newConf.mainAction === '7') {
            const allMembership = { ID : 'All', post_title : 'All membership' }
            newConf.default.allMembership = [allMembership, ...result.data]
          } else {
            newConf.default.allMembership = result.data
          }
      }
        setLifterLmsConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Membership fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Membership fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}