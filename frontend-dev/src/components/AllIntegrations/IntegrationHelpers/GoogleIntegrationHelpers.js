import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

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

export const handleGoogleAuthorize = (integ, ajaxInteg, scopes, confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  // eslint-disable-next-line no-undef
  const apiEndpoint = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scopes}&access_type=offline&prompt=consent&response_type=code&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}/redirect`)}&client_id=${confTmp.clientId}`
  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitsGoogleSheet = localStorage.getItem(`__${integ}`)
      if (bitsGoogleSheet) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsGoogleSheet)
        localStorage.removeItem(`__${integ}`)
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(ajaxInteg, grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (ajaxInteg, grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // eslint-disable-next-line no-undef
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

export const addFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    uploadFields ? newConf.relatedlists[tab - 1].upload_field_map.splice(i, 0, {}) : newConf.relatedlists[tab - 1].field_map.splice(i, 0, {})
  } else {
    uploadFields ? newConf.upload_field_map.splice(i, 0, {}) : newConf.field_map.splice(i, 0, {})
  }

  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    if (uploadFields) {
      if (newConf.relatedlists[tab - 1].upload_field_map.length > 1) {
        newConf.relatedlists[tab - 1].upload_field_map.splice(i, 1)
      }
    } else if (newConf.relatedlists[tab - 1].field_map.length > 1) {
      newConf.relatedlists[tab - 1].field_map.splice(i, 1)
    }
  } else if (uploadFields) {
    if (newConf.upload_field_map.length > 1) {
      newConf.upload_field_map.splice(i, 1)
    }
  } else if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, uploadFields, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    if (uploadFields) newConf.relatedlists[tab - 1].upload_field_map[index][event.target.name] = event.target.value
    else newConf.relatedlists[tab - 1].field_map[index][event.target.name] = event.target.value
  } else if (uploadFields) newConf.upload_field_map[index][event.target.name] = event.target.value
  else newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    if (tab) {
      newConf.relatedlists[tab - 1].field_map[index].customValue = ''
    } else newConf.field_map[index].customValue = ''
  }

  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1].field_map[index].customValue = event?.target?.value || event
  } else {
    newConf.field_map[index].customValue = event?.target?.value || event
  }
  setConf({ ...newConf })
}
