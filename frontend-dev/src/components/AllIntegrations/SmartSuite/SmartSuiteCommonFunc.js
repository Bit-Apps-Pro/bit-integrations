/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, salesmateConf, setSalesmateConf) => {
  const newConf = { ...salesmateConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSalesmateConf({ ...newConf })
}

export const generateMappedField = (smartSuiteFields) => {
  const requiredFlds = smartSuiteFields.filter((fld) => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      smartSuiteFormField: field.key
    }))
    : [{ formField: '', smartSuiteFormField: '' }]
}

export const checkMappedFields = (smartSuiteConf) => {
  const mappedFields = smartSuiteConf?.field_map
    ? smartSuiteConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.smartSuiteFormField ||
        (mappedField.formField === 'custom' && !mappedField.customValue) ||
        (mappedField.smartSuiteFormField === 'customFieldKey' && !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const smartSuiteAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key || !confTmp.api_secret) {
    setError({
      api_key: !confTmp.api_key ? __("Workspace ID can't be empty", 'bit-integrations') : '',
      api_secret: !confTmp.api_secret ? __("API Token can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'smartSuite_authentication').then((result) => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      __('Authorized failed, ' + result.data, 'bit-integrations')
    )
  })
}

export const getAllEvents = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, event: true })

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_events').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.events = result.data
          return prevConf
        })

        setLoading({ ...setLoading, event: false })
        toast.success(__('Solution fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, event: false })
      toast.error(__('Solution Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, event: false })
    toast.error(__('Solution fetching failed', 'bit-integrations'))
  })
}

export const getAllSessions = (confTmp, setConf, event_id, setLoading) => {
  setLoading({ ...setLoading, session: true })

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
    event_id: event_id
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_sessions').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.sessions = result.data
          return prevConf
        })

        setLoading({ ...setLoading, session: false })
        toast.success(__('Table fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, session: false })
      toast.error(__('Table Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, session: false })
    toast.error(__('Table fetching failed', 'bit-integrations'))
  })
}
