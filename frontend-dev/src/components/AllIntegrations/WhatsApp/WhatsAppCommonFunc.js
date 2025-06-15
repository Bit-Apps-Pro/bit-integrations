import { create } from 'mutative'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, whatsAppConf, setWhatsAppConf) => {
  const newConf = { ...whatsAppConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setWhatsAppConf({ ...newConf })
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.numberID || !confTmp.businessAccountID || !confTmp.token) {
    setError({
      numberID: !confTmp.numberID
        ? __("Phone number ID can't be empty or invalid", 'bit-integrations')
        : '',
      businessAccountID: !confTmp.businessAccountID
        ? __("WhatsApp Business Account ID can't be empty or invalid", 'bit-integrations')
        : '',
      token: !confTmp.token ? __("Access Token can't be empty or invalid", 'bit-integrations') : ''
    })
    return
  }

  const requestParams = {
    numberID: confTmp.numberID,
    businessAccountID: confTmp.businessAccountID,
    token: confTmp.token
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'whats_app_authorization').then((result) => {
    setIsLoading(false)
    if (result && result.success) {
      setIsAuthorized(true)
      setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      return
    }
    setSnackbar({ show: true, msg: result?.data || __('Authorized failed', 'bit-integrations') })
  })
}

export const getallTemplates = (confTmp, setConf, setIsLoading, setSnackbar) => {
  if (!confTmp.numberID || !confTmp.businessAccountID || !confTmp.token) {
    setError({
      numberID: !confTmp.numberID
        ? __("Phone number ID can't be empty or invalid", 'bit-integrations')
        : '',
      businessAccountID: !confTmp.businessAccountID
        ? __("WhatsApp Business Account ID can't be empty or invalid", 'bit-integrations')
        : '',
      token: !confTmp.token ? __("Access Token can't be empty or invalid", 'bit-integrations') : ''
    })
    return
  }

  const requestParams = {
    numberID: confTmp.numberID,
    businessAccountID: confTmp.businessAccountID,
    token: confTmp.token
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'whats_app_all_template').then((result) => {
    setIsLoading(false)
    if (result?.data?.error?.message) {
      console.log(result?.data?.error?.message)
      setSnackbar({
        show: true,
        msg: __(result?.data?.error?.message, 'bit-integrations')
      })
    } else if (result && result.success) {
      setConf((prevConf) =>
        create(prevConf, (draftConf) => {
          draftConf['allTemplates'] = result?.data || []
        })
      )
      setSnackbar({ show: true, msg: __('Template Fetched Successfully', 'bit-integrations') })
      return
    }
  })
}

export const generateMappedField = (whatsAppFields) => {
  const requiredFlds = whatsAppFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({ formField: '', whatsAppFormField: field.key }))
    : [{ formField: '', whatsAppFormField: '' }]
}

export const checkMappedFields = (whatsAppFields) => {
  const mappedFleld = whatsAppFields
    ? whatsAppFields.filter((mapped) => mapped.formField && mapped.whatsAppFormField)
    : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const checkDisabledButton = (whatsAppConf) => {
  let check = false

  if (whatsAppConf?.messageType === '') {
    check = true
  } else if (whatsAppConf?.messageType === 'template' && whatsAppConf.templateName === '') {
    check = true
  } else if (whatsAppConf?.messageType === 'text' && whatsAppConf.body === '') {
    check = true
  } else if (
    whatsAppConf?.messageType === 'media' &&
    (whatsAppConf.upload_field === '' || whatsAppConf.mediaType === '')
  ) {
    check = true
  } else if (
    whatsAppConf?.messageType === 'contact' &&
    checkMappedFields(whatsAppConf.contact_field_map)
  ) {
    check = true
  }

  return checkMappedFields(whatsAppConf.field_map) || check
}

export const addFieldMap = (i, confTmp, setConf, mapKey = 'field_map') => {
  const newConf = { ...confTmp }
  newConf[mapKey].splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, mapKey = 'field_map') => {
  const newConf = { ...confTmp }
  if (newConf[mapKey].length > 1) {
    newConf[mapKey].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, mapKey = 'field_map') => {
  const newConf = { ...conftTmp }
  newConf[mapKey][index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf[mapKey][index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab, mapKey = 'field_map') => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1][mapKey][index].customValue = event.target.value
  } else {
    newConf[mapKey][index].customValue = event
  }
  setConf({ ...newConf })
}
