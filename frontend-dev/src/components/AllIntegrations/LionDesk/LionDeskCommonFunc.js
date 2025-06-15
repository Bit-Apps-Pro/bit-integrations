/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, lionDeskConf, setLionDeskConf) => {
  const newConf = { ...lionDeskConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setLionDeskConf({ ...newConf })
}

export const generateMappedField = (lionDeskConf) => {
  let allFields = []
  if (lionDeskConf.actionName === 'campaign') {
    allFields = lionDeskConf?.campaignFields
  } else if (lionDeskConf.actionName === 'contact') {
    allFields = lionDeskConf?.contactFields
  }
  const requiredFlds = allFields && allFields.filter(
    (fld) => fld.required === true,
  )
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      lionDeskFormField: field.key,
    }))
    : [{ formField: '', lionDeskFormField: '' }]
}

export const checkMappedFields = (lionDeskConf) => {
  const mappedFields = lionDeskConf?.field_map
    ? lionDeskConf.field_map.filter(
      (mappedField) => !mappedField.formField
        || !mappedField.lionDeskFormField
        || (mappedField.formField === 'custom' && !mappedField.customValue)
        || (mappedField.lionDeskFormField === 'customFieldKey'
          && !mappedField.customFieldKey),
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
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

export const handleAuthorize = (integ, ajaxInteg, confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar, btcbi) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setIsLoading(true)
  const apiEndpoint = `https://api-v2.liondesk.com/oauth2/authorize?response_type=code&client_id=${confTmp.clientId}&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}`)}/redirect&scope=['write','read']`
  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitintegrationLionDesk = localStorage.getItem(`__${integ}`)

      if (bitintegrationLionDesk) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitintegrationLionDesk)
        localStorage.removeItem(`__${integ}`)
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(ajaxInteg, grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar, btcbi)
      }
    }
  }, 500)
}

const tokenHelper = (ajaxInteg, grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar, btcbi) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`

  bitsFetch(tokenRequestParams, `${ajaxInteg}_generate_token`)
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
}

export const getCustomFields = (confTmp, setConf, setIsLoading, btcbi) => {
  setIsLoading(true)
  const requestParams = {
    token_details: confTmp.tokenDetails,
    client_id: confTmp.clientId,
    client_secret: confTmp.clientSecret,
    redirect_uri: `${btcbi.api.base}/redirect`,
  }

  bitsFetch(requestParams, 'lionDesk_fetch_custom_fields').then((result) => {
    if (result && result.success) {
      setIsLoading(false)
      if (result.data) {
        setConf(prevConf => {
          const newConf = { ...prevConf }
          newConf.customFields = result.data
          return newConf
        })
        toast.success(
          __('Custom fields also fetched successfully', 'bit-integrations'),
        )
      } else {
        toast.error(__('No custom fields found', 'bit-integrations'))
      }
      return
    }
    setIsLoading(false)
    toast.error(__(`Custom fields fetching failed ${result.data}`, 'bit-integrations'))
  })
}

export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, tags: true })
  const requestParams = {
    token_details: confTmp.tokenDetails,
    client_id: confTmp.clientId,
    client_secret: confTmp.clientSecret,
    redirect_uri: confTmp.redirectURI,
  }

  bitsFetch(requestParams, 'lionDesk_fetch_all_tags').then(
    (result) => {
      if (result && result.success) {
        setLoading({ ...setLoading, tags: false })
        if (result.data) {
          setConf(prevConf => {
            const newConf = { ...prevConf }
            newConf.tags = result.data
            return newConf
          })
          toast.success(
            __('Tags fetched successfully', 'bit-integrations'),
          )
        } else {
          toast.error(__('No Tags found', 'bit-integrations'))
        }
        return
      }
      setLoading({ ...setLoading, tags: false })
      toast.error(
        __(`Tags fetching failed ${result.data}`, 'bit-integrations'),
      )
    },
  )
}