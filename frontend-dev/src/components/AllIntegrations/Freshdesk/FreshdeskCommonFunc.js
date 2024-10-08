/* eslint-disable no-else-return */
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, slackConf, setSlackConf) => {
  const newConf = { ...slackConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSlackConf({ ...newConf })
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key ? __("API Key can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = {
    app_domain: confTmp.app_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(tokenRequestParams, 'freshdesk_authorization_and_fetch_tickets')
    .then((result) => result)
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({
          show: true,
          msg: __('Authorized Successfully', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Authorization failed Cause:', 'bit-integrations')}${
            result.data.data || result.data
          }. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Authorization failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
}

export const getAllTicketFields = (confTmp, setConf, setIsLoading, setSnackbar) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key ? __("API Key can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setIsLoading(true)
  const tokenRequestParams = {
    app_domain: confTmp.app_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(tokenRequestParams, 'freshdesk_fetch_ticket_fields')
    .then((result) => result)
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.ticketFields = result.data.ticketFields
        newConf.agents = result.data.agents
        newConf.groups = result.data.groups
        newConf.products = result.data.products
        newConf.sources = result.data.sources
        newConf.ticketType = result.data.ticketType
        newConf.field_map = generateMappedField(newConf)
        setConf(newConf)
        setSnackbar({
          show: true,
          msg: __('Ticket fields fetch Successfully', 'bit-integrations')
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Ticket field fetch failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
}

export const getAllContactFields = (confTmp, setConf, setIsLoading, setSnackbar) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key ? __("API Key can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setIsLoading(true)
  const tokenRequestParams = {
    app_domain: confTmp.app_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(tokenRequestParams, 'freshdesk_fetch_Contact_fields')
    .then((result) => result)
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.contactFields = result.data
        newConf.field_map_contact = generateContactMappedField(newConf)
        setConf(newConf)
        setSnackbar({
          show: true,
          msg: __('Contacts fields fetch Successfully', 'bit-integrations')
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Contacts field fetch failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
}

export const checkMappedFields = (fieldsMapped) => {
  const checkedField = fieldsMapped
    ? fieldsMapped?.filter((item) => !item.formField || !item.freshdeskFormField)
    : []
  if (checkedField.length > 0) return false
  return true
}

export const checkMappedFieldsContact = (fieldsMapped) => {
  const checkedField = fieldsMapped
    ? fieldsMapped?.filter((item) => !item.formField || !item.contactFreshdeskFormField)
    : []
  if (checkedField.length > 0) return false
  return true
}

export const generateMappedField = (freshdeskConf) => {
  const requiredFlds = freshdeskConf?.ticketFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: '',
        freshdeskFormField: field.key
      }))
    : [{ formField: '', freshdeskFormField: '' }]
}

export const generateContactMappedField = (freshdeskConf) => {
  const requiredFlds = freshdeskConf?.contactFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: '',
        contactFreshdeskFormField: field.key
      }))
    : [{ formField: '', contactFreshdeskFormField: '' }]
}
