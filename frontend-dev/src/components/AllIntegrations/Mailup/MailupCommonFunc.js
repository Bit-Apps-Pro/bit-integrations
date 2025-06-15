/* eslint-disable no-console */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, mailupConf, setMailupConf) => {
  const newConf = { ...mailupConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setMailupConf({ ...newConf })
}

export const fetchAllList = (mailupConf, setMailupConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = {
    tokenDetails: mailupConf.tokenDetails,
    clientId: mailupConf.clientId,
    clientSecret: mailupConf.clientSecret,
  }
  bitsFetch(requestParams, 'mailup_fetch_all_list')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...mailupConf }
        if (result.data) {
          newConf.allList = result.data
        }
        setSnackbar({ show: true, msg: __('Mailup all lists fetched successfully', 'bit-integrations') })
        setMailupConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Mailup lists fetching failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const fetchAllGroup = (mailupConf, setMailupConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = {
    tokenDetails: mailupConf.tokenDetails,
    clientId: mailupConf.clientId,
    clientSecret: mailupConf.clientSecret,
    listId: mailupConf.listId,
  }
  bitsFetch(requestParams, 'mailup_fetch_all_group')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...mailupConf }
        if (result.data) {
          newConf.allGroup = result.data
        }
        setSnackbar({ show: true, msg: __('All groups fetched successfully', 'bit-integrations') })
        setMailupConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Groups fetching failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleMailupAuthorize = (integ, confTmp, setConf, setError, setIsAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.clientId) {
    setError({ clientId: !confTmp.clientId ? __('Client ID can\'t be empty', 'bit-integrations') : '' })
    return
  }
  if (!confTmp.clientSecret) {
    setError({ clientSecret: !confTmp.clientSecret ? __('Client secret can\'t be empty', 'bit-integrations') : '' })
    return
  }
  setIsLoading(true)

  const apiEndpoint = `https://services.mailup.com/Authorization/OAuth/LogOn?client_id=${confTmp.clientId}&response_type=code&redirect_uri=${encodeURIComponent(window.location.href)}`

  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitsMailup = localStorage.getItem(`__${integ}`)

      if (bitsMailup) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsMailup)
        localStorage.removeItem(`__${integ}`)

        if (grantTokenResponse.token) {
          grantTokenResponse.code = grantTokenResponse.token
        }
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        tokenHelper(grantTokenResponse, newConf, setConf, setIsAuthorized, setIsLoading)
      }
    }
    setIsLoading(false)
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setIsAuthorized, setIsLoading) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // eslint-disable-next-line no-undef

  bitsFetch(tokenRequestParams, 'mailup_authorization')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setIsAuthorized(true)
        toast.success(__('Authorized Successfully', 'bit-integrations'))
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bit-integrations'))
      }
      setIsLoading(false)
    })
}

export const generateMappedField = (mailupConf) => {
  const requiredFlds = mailupConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', mailupFormField: field.key })) : [{ formField: '', mailupFormField: '' }]
}

export const checkMappedFields = (mailupConf) => {
  const mappedFields = mailupConf?.field_map ? mailupConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.mailupFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
