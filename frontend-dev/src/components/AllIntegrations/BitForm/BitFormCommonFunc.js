import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, bitFormConf, setBitFormConf, formID, setIsLoading, setSnackbar) => {
  let newConf = { ...bitFormConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  switch (e.target.name) {
    case 'id':
      newConf = listChange(newConf, formID, setBitFormConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setBitFormConf({ ...newConf })
}

export const listChange = (bitFormConf, formID, setBitFormConf, setIsLoading, setSnackbar) => {
  const newConf = deepCopy(bitFormConf)
  newConf.field_map = [{ formField: '', BitFormMapField: '' }]

  if (!newConf?.default?.fields?.[newConf.id]) {
    fetchSingleFormFeilds(formID, newConf, setBitFormConf, setIsLoading, setSnackbar)
  }
  return newConf
}

export const checkAddressFieldMapRequired = sheetConf => {
  const requiredFleld = sheetConf?.address_field ? sheetConf.address_field.filter(field => !field.formField && field.mailChimpAddressField && field.required) : []
  if (requiredFleld.length > 0) {
    return false
  }
  return true
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.api_key) {
    setError({ api_key: !confTmp.api_key ? __('Api Key can\'t be empty', 'bit-integrations') : '' })
    return
  }
  setError({})
  setIsLoading(true)

  const requestParams = { app_domain: confTmp.domainName, api_key: confTmp.api_key }

  bitsFetch(requestParams, 'bitForm_authorization_and_fetch_form_list')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setConf(newConf)
        setisAuthorized(true)
        setIsLoading(false)
        toast.success(__('Authorization Successful', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Authorization Failed', 'bit-integrations'))
    })
}

export const fetchAllForm = (bitFormConf, setBitFormConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { app_domain: bitFormConf.domainName, api_key: bitFormConf.api_key }

  bitsFetch(requestParams, 'bitForm_all_form_list')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...bitFormConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.forms) {
          newConf.default.forms = result.data.forms
        }
        setBitFormConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('BitForm list fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Failed to fetch BitForm list', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const fetchSingleFormFeilds = (formID, bitFormConf, setBitFormConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { app_domain: bitFormConf.domainName, api_key: bitFormConf.api_key, id: bitFormConf.id }

  bitsFetch(requestParams, 'bitForm_fetch_single_form_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...bitFormConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.fields) {
          newConf.default.fields = result.data.fields
        }
        setBitFormConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('BitForm fields fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Failed to fetch BitForm fields. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const generateMappedField = (bitFormConf) => {
  const requiredFlds = bitFormConf?.BitFormFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', BitFormMapField: field.key })) : [{ formField: '', BitFormMapField: '' }]
}

export const checkMappedFields = (bitFormConf) => {
  const mappedFleld = bitFormConf.field_map ? bitFormConf.field_map.filter(mapped => (!mapped.formField && !mapped.BitFormMapField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
