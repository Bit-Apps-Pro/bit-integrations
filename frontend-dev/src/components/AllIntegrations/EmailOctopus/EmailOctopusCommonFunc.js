/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, emailOctopusConf, setEmailOctopusConf) => {
  const newConf = { ...emailOctopusConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setEmailOctopusConf({ ...newConf })
}

export const generateMappedField = (emailOctopusConf) => {
  const requiredFlds = emailOctopusConf?.emailOctopusFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', emailOctopusFormField: field.key })) : [{ formField: '', emailOctopusFormField: '' }]
}

export const checkMappedFields = (emailOctopusConf) => {
  const mappedFields = emailOctopusConf?.field_map ? emailOctopusConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.emailOctopusFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const emailOctopusAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
  if (!confTmp.auth_token) {
    setError({ auth_token: !confTmp.auth_token ? __('Api Key can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }
  if (type === 'refreshLists') {
    setLoading({ ...loading, lists: true })
  }
  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'emailOctopus_authentication')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setIsAuthorized(true)
        if (type === 'authentication') {
          if (result.data) {
            newConf.lists = result.data
          }
          setLoading({ ...loading, auth: false })
          toast.success(__('Authorized successfully', 'bit-integrations'))
        } else if (type === 'refreshLists') {
          if (result.data) {
            newConf.lists = result.data
          }
          setLoading({ ...loading, lists: false })
          toast.success(__('All lists fectched successfully', 'bit-integrations'))
        }
        setConf(newConf)
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid domain name & API key', 'bit-integrations'))
    })
}

export const getAllFields = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, customFields: true })
  const requestParams = { auth_token: confTmp.auth_token, listId: confTmp.selectedList }

  bitsFetch(requestParams, 'emailOctopus_fetch_all_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.emailOctopusFields = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, customFields: false })
        setLoading({ ...setLoading, emailOctopusFields: true })

        toast.success(__('Fields fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, customFields: false })
      toast.error(__('Fields fetching failed', 'bit-integrations'))
    })
}

export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ tags: true, emailOctopusFields: true })

  const requestParams = { auth_token: confTmp.auth_token, listId: confTmp.selectedList }

  bitsFetch(requestParams, 'emailOctopus_fetch_all_tags')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.tags = result.data
        }
        setConf(newConf)
        setLoading({ tags: false, emailOctopusFields: true })

        toast.success(__('Tags fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ tags: false, emailOctopusFields: true })
      toast.error(__('Tags fetching failed', 'bit-integrations'))
    })
}
