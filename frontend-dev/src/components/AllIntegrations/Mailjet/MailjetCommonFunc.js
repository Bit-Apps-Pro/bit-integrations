/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (e, mailjetConf, setMailjetConf) => {
  const newConf = create(mailjetConf, draftConf => {
    const { name } = e.target
    if (e.target.value !== '') {
      draftConf[name] = e.target.value
    } else {
      delete draftConf[name]
    }
  })

  setMailjetConf(newConf)
}

export const generateMappedField = (mailjetConf) => {
  const requiredFlds = mailjetConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', mailjetFormField: field.key })) : [{ formField: '', mailjetFormField: '' }]
}

export const checkMappedFields = (mailjetConf) => {
  const mappedFields = mailjetConf?.field_map ? mailjetConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.mailjetFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const mailjetAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
  if (!confTmp.apiKey) {
    setError({ apiKey: !confTmp.apiKey ? __('API key can\'t be empty', 'bit-integrations') : '' })
    return
  }
  if (!confTmp.secretKey) {
    setError({ secretKey: !confTmp.secretKey ? __('Secret key can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }
  if (type === 'refreshLists') {
    setLoading({ ...loading, lists: true })
  }
  const requestParams = { apiKey: confTmp.apiKey, secretKey: confTmp.secretKey }

  bitsFetch(requestParams, 'mailjet_authentication')
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
          getCustomFields(newConf, setConf, setLoading)
        } else if (type === 'refreshLists') {
          if (result.data) {
            newConf.lists = result.data
            setConf(newConf)
          }
          setLoading({ ...loading, lists: false })
          toast.success(__('All lists fectched successfully', 'bit-integrations'))
        }
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed', 'bit-integrations'))
    })
}

export const getCustomFields = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, customFields: true })

  const requestParams = { apiKey: confTmp.apiKey, secretKey: confTmp.secretKey }

  bitsFetch(requestParams, 'mailjet_fetch_all_custom_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.customFields = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, customFields: false })

        toast.success(__('Custom fields fetch successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, customFields: false })
      toast.error(__('Custom fields fetch failed', 'bit-integrations'))
    })
}
