import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, sendFoxConf, setSendFoxConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...sendFoxConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  if (newConf.mainAction === '2') {
    fetchAllList(newConf, setSendFoxConf, setIsLoading, setSnackbar)
  }
  setSendFoxConf({ ...newConf })
}

export const checkAddressFieldMapRequired = sendFoxConf => {
  const requiredFleld = sendFoxConf?.address_field ? sendFoxConf.default?.fields.filter(field => !field.formField && field.acumbamailFormField && field.required) : []
  if (requiredFleld.length > 0) {
    return false
  }
  return true
}

export const fetchAllList = (sendFoxConf, setSendFoxConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { access_token: sendFoxConf.access_token }

  bitsFetch(requestParams, 'sendfox_fetch_all_list')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...sendFoxConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLists = result.data.data
        }
        setSendFoxConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Lists fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Lists fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.access_token) {
    setError({ access_token: !confTmp.access_token ? __('Access Token can\'t be empty', 'bit-integrations') : '' })
    return
  }
  setError({})
  setIsLoading(true)

  const requestParams = { access_token: confTmp.access_token }

  bitsFetch(requestParams, 'sendFox_authorize')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setConf(newConf)
        setisAuthorized(true)
        setIsLoading(false)
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Authorized failed', 'bit-integrations'))
    })
}

export const generateMappedField = (sendFoxConf) => {
  const requiredFlds = sendFoxConf?.contactFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', sendFoxFormField: field.key })) : [{ formField: '', sendFoxFormField: '' }]
}

export const checkMappedFields = sendFoxConf => {
  const mappedFields = sendFoxConf?.field_map ? sendFoxConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.sendFoxFormField && sendFoxConf?.default?.allFields?.[sendFoxConf.listId]?.required.indexOf(mappedField.sendFoxFormField) !== -1)) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

// another

export const generateListMappedField = (sendFoxConf) => {
  const requiredFlds = sendFoxConf?.listFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', sendFoxListFormField: field.key })) : [{ formField: '', sendFoxListFormField: '' }]
}

export const checkMappedListFields = sendFoxConf => {
  const mappedFields = sendFoxConf?.field_map_list ? sendFoxConf.field_map_list.filter(mappedField => (!mappedField.formField && mappedField.sendFoxListFormField && sendFoxConf?.default?.allFields?.[sendFoxConf.listId]?.required.indexOf(mappedField.sendFoxListFormField) !== -1)) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

export const generateunsubscribeMappedField = (sendFoxConf) => {
  const requiredFlds = sendFoxConf?.unsubscribeFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', sendFoxUnsubscribeFormField: field.key })) : [{ formField: '', sendFoxUnsubscribeFormField: '' }]
}

export const checkMappedSubscribeFields = sendFoxConf => {
  const mappedFields = sendFoxConf?.field_map_unsubscribe ? sendFoxConf.field_map_unsubscribe.filter(mappedField => (!mappedField.formField && mappedField.sendFoxUnsubscribeFormField && sendFoxConf?.default?.allFields?.[sendFoxConf.listId]?.required.indexOf(mappedField.sendFoxUnsubscribeFormField) !== -1)) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

// eslint-disable-next-line no-nested-ternary
export const isDisabled = sendFoxConf => (sendFoxConf.mainAction === '1' ? !checkMappedListFields(sendFoxConf) : (sendFoxConf.mainAction === '2' ? (!checkMappedFields(sendFoxConf) || sendFoxConf.listId === undefined || sendFoxConf.listId === '') : !checkMappedSubscribeFields(sendFoxConf)))
