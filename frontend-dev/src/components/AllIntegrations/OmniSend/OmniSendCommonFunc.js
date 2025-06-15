/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (
  e,
  omniSendConf,
  setOmniSendConf,
  setLoading,
  setSnackbar,
  isNew,
  error,
  setError,
) => {
  const newConf = { ...omniSendConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setOmniSendConf({ ...newConf })
}

export const generateMappedField = (omniSendConf) => {
  const requiredFlds = omniSendConf?.omniSend_fields.filter(
    (fld) => fld.required === true,
  )
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      omniSendFormField: field.key,
    }))
    : [{ formField: '', omniSendFormField: '' }]
}

export const checkMappedFields = (omniSendConf) => {
  const mappedFields = omniSendConf?.field_map
    ? omniSendConf.field_map.filter(
      (mappedField) => !mappedField.formField
          || !mappedField.omniSendFormField
          || (!mappedField.formField === 'custom' && !mappedField.customValue),
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const handleOmniSendAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  loading,
  setLoading,
) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key
        ? __("Api Key can't be empty", 'bit-integrations')
        : '',
    })
    return
  }
  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = { api_key: confTmp.api_key }

  bitsFetch(requestParams, 'Omnisend_authorization').then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      setConf(newConf)
      setisAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__('Authorized successfully', 'bit-integrations'))
      return
    }

    setLoading({ ...loading, auth: false })
    toast.error(__('Authorized failed', 'bit-integrations'))
  })
}
