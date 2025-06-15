/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, mailRelayConf, setMailRelayConf) => {
  const newConf = { ...mailRelayConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setMailRelayConf({ ...newConf })
}

export const generateMappedField = (mailRelayConf) => {
  const requiredFlds = mailRelayConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', mailRelayFormField: field.key })) : [{ formField: '', mailRelayFormField: '' }]
}

export const checkMappedFields = (mailRelayConf) => {
  const mappedFields = mailRelayConf?.field_map ? mailRelayConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.mailRelayFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const mailRelayAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
  if (!confTmp.domain) {
    setError({ domain: !confTmp.domain ? __('Account Name can\'t be empty', 'bit-integrations') : '' })
    return
  }
  if (!confTmp.auth_token) {
    setError({ auth_token: !confTmp.auth_token ? __('Api Key can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }
  if (type === 'refreshCustomFields') {
    setLoading({ ...loading, customFields: true })
  }
  const requestParams = { auth_token: confTmp.auth_token, domain: confTmp.domain }

  bitsFetch(requestParams, 'mailRelay_authentication')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.campaigns = result.data
        }
        setConf(newConf)
        setIsAuthorized(true)
        if (type === 'authentication') {
          if (result.data) {
            newConf.customFields = result.data
          }
          setLoading({ ...loading, auth: false })
          toast.success(__('Authorized successfully', 'bit-integrations'))
        } else if (type === 'refreshCustomFields') {
          if (result.data) {
            newConf.customFields = result.data
          }
          setLoading({ ...loading, customFields: false })
          toast.success(__('Custom fields fectched successfully', 'bit-integrations'))
        }
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid domain name & API key', 'bit-integrations'))
    })
}

export const getAllGroups = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, groups: true })

  const requestParams = { auth_token: confTmp.auth_token, domain: confTmp.domain }

  bitsFetch(requestParams, 'mailRelay_fetch_all_groups')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.groups = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, groups: false })

        toast.success(__('Groups fetch successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, groups: false })
      toast.error(__('Groups fetch failed', 'bit-integrations'))
    })
}
