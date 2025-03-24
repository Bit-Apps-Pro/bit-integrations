/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

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

const setRequestParams = (config, customs = {}) => {
  return {
    ...customs,
    publishable_key: config.publishable_key,
    secret_key: config.secret_key,
    site_uuid: config.site_uuid,
  }
}

export const bentoAuthentication = (
  confTmp,
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

  bitsFetch(setRequestParams(confTmp), 'bento_authentication').then((result) => {
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

export const getFields = (confTmp, setConf, action, setIsLoading) => {
  setIsLoading(true)

  bitsFetch(setRequestParams(confTmp, { action: action }), 'bento_get_fields').then((result) => {
    setIsLoading(false)

    if (result?.success && result?.data) {
      setConf((prevConf) => create(prevConf, draftConf => {
        draftConf.bentoFields = result.data
        draftConf.field_map = generateMappedField(result.data)
      }))

      toast.success(__('Fields fetched successfully', 'bit-integrations'))
      return
    }

    toast.error(result?.data ? result?.data : __('Fields fetching failed', 'bit-integrations'))
  })
}

export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, tags: true })

  bitsFetch(setRequestParams(confTmp), 'bento_get_all_tags').then((result) => {
    setLoading({ ...setLoading, tags: false })

    if (result?.success && result?.data) {
      setConf((prevConf) => create(prevConf, draftConf => {
        draftConf.tags = result.data
      }))

      toast.success(__('Fields fetched successfully', 'bit-integrations'))
      return
    }

    toast.error(result?.data ? result?.data : __('Fields fetching failed', 'bit-integrations'))
  })
}
