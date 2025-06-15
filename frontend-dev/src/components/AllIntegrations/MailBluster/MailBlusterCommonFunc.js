/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, mailBlusterConf, setMailBlusterConf) => {
  const newConf = { ...mailBlusterConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setMailBlusterConf({ ...newConf })
}

export const generateMappedField = (mailBlusterConf) => {
  const requiredFlds = mailBlusterConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', mailBlusterFormField: field.key })) : [{ formField: '', mailBlusterFormField: '' }]
}

export const checkMappedFields = (mailBlusterConf) => {
  const mappedFields = mailBlusterConf?.field_map ? mailBlusterConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.mailBlusterFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const mailBlusterAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
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
  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'mailBluster_authentication')
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
      toast.error(__('Authorized failed', 'bit-integrations'))
    })
}
