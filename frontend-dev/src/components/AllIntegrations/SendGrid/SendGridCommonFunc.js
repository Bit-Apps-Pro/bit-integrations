/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, sendGridConf, setSendGridConf) => {
  const newConf = { ...sendGridConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSendGridConf({ ...newConf })
}

export const generateMappedField = (sendGridConf) => {
  const requiredFlds = sendGridConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', sendGridFormField: field.key })) : [{ formField: '', sendGridFormField: '' }]
}

export const checkMappedFields = (sendGridConf) => {
  const mappedFields = sendGridConf?.field_map ? sendGridConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.sendGridFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const sendGridAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
  if (!confTmp.apiKey) {
    setError({ apiKey: !confTmp.apiKey ? __('API key can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }
  if (type === 'refreshLists') {
    setLoading({ ...loading, customFields: true })
  }
  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'sendGrid_authentication')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setIsAuthorized(true)
        if (type === 'authentication') {
          if (result.data) {
            newConf.customFields = result.data
          }
          setConf(newConf)
          setLoading({ ...loading, auth: false })
          toast.success(__('Authorized successfully', 'bit-integrations'))
        } else if (type === 'refreshLists') {
          if (result.data) {
            newConf.customFields = result.data
            setConf(newConf)
          }
          setLoading({ ...loading, customFields: false })
          toast.success(__('Custom fields fetched successfully', 'bit-integrations'))
        }
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorization failed', 'bit-integrations'))
    })
}

export const getLists = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, lists: true })

  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'sendGrid_fetch_all_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.lists = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, lists: false })

        toast.success(__('Lists fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, lists: false })
      toast.error(__('Lists fetching failed', 'bit-integrations'))
    })
}
