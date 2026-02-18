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

export const generateMappedField = acptFields => {
  const requiredFlds = acptFields.filter(fld => fld?.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        acptFormField: field.key
      }))
    : [{ formField: '', acptFormField: '' }]
}

export const checkMappedFields = acptConf => {
  const mappedFields = acptConf?.field_map
    ? acptConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.acptFormField ||
          (mappedField.formField === 'custom' && !mappedField.customValue) ||
          (mappedField.acptFormField === 'customFieldKey' && !mappedField.customFieldKey)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const acptAuthentication = (confTmp, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.api_key || !confTmp.base_url) {
    setError({
      base_url: !confTmp.base_url ? __("Homepage URL can't be empty", 'bit-integrations') : '',
      api_key: !confTmp.api_key ? __("Api Key-Secret can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key
  }

  bitsFetch(requestParams, 'acpt_authentication').then(result => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })

      toast.success(__('Authorized Successfully', 'bit-integrations'))

      return
    }

    setLoading({ ...loading, auth: false })

    toast.error(
      result?.data && typeof result.data === 'string'
        ? result.data
        : __('Authorized failed, Please enter valid Api Key-Secret', 'bit-integrations')
    )
  })
}
