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

export const generateMappedField = (bentoFields) => {
  const requiredFlds = bentoFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      bentoFormField: field.key
    }))
    : [{ formField: '', bentoFormField: '' }]
}

export const checkMappedFields = (bentoConf) => {
  const mappedFields = bentoConf?.field_map
    ? bentoConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.bentoFormField ||
        (mappedField.formField === 'custom' && !mappedField.customValue) ||
        (mappedField.bentoFormField === 'customFieldKey' && !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const bentoAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.publishable_key || !confTmp.secret_key || !confTmp.site_uuid) {
    setError({
      publishable_key: !confTmp.publishable_key ? __("Publishable Key can't be empty", 'bit-integrations') : '',
      secret_key: !confTmp.secret_key ? __("Secret Key can't be empty", 'bit-integrations') : '',
      site_uuid: !confTmp.site_uuid ? __("Site UUID can't be empty", 'bit-integrations') : ''
    })

    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    publishable_key: confTmp.publishable_key,
    secret_key: confTmp.secret_key,
    site_uuid: confTmp.site_uuid,
  }

  bitsFetch(requestParams, 'bento_authentication').then((result) => {
    setLoading({ ...loading, auth: false })

    if (result && result.success) {
      setIsAuthorized(true)
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }

    toast.error(
      result?.data ? result?.data : __('Authorized failed, Please enter valid Publishable Key, Secret Key & Site UUID', 'bit-integrations')
    )
  })
}

export const getAllEvents = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, event: true })

  const requestParams = {
    publishable_key: confTmp.publishable_key,
    secret_key: confTmp.secret_key
  }

  bitsFetch(requestParams, 'bento_fetch_all_events').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.events = result.data
          return prevConf
        })

        setLoading({ ...setLoading, event: false })
        toast.success(__('Events fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, event: false })
      toast.error(__('Events Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, event: false })
    toast.error(__('Events fetching failed', 'bit-integrations'))
  })
}

export const getAllSessions = (confTmp, setConf, event_id, setLoading) => {
  setLoading({ ...setLoading, session: true })

  const requestParams = {
    publishable_key: confTmp.publishable_key,
    secret_key: confTmp.secret_key,
    event_id: event_id
  }

  bitsFetch(requestParams, 'bento_fetch_all_sessions').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.sessions = result.data
          return prevConf
        })

        setLoading({ ...setLoading, session: false })
        toast.success(__('Sessions fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, session: false })
      toast.error(__('Sessions Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, session: false })
    toast.error(__('Sessions fetching failed', 'bit-integrations'))
  })
}
