import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'

export const handleInput = (e, zoomWebinarConf, setZoomWebinarConf, formID, setIsLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...zoomWebinarConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value
  setZoomWebinarConf({ ...newConf })
}
export const zoomAllWebinar = (formID, zoomWebinarConf, setZoomWebinarConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const fetchWebinarModulesRequestParams = {
    formID,
    clientId: zoomWebinarConf.clientId,
    accessToken: zoomWebinarConf.tokenDetails.access_token,
    clientSecret: zoomWebinarConf.clientSecret,
    refreshToken: zoomWebinarConf.tokenDetails.refresh_token,
    tokenDetails: zoomWebinarConf.tokenDetails,
  }
  bitsFetch(fetchWebinarModulesRequestParams, 'zoom_webinar_fetch_all_webinar')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...zoomWebinarConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.allWebinar) {
          newConf.default.allWebinar = result.data.allWebinar
        }
        // if (result.data.tokenDetails) {
        //   newConf.tokenDetails = result.data.tokenDetails
        // }
        setSnackbar({ show: true, msg: __('Webinar list refreshed', 'bit-integrations') })
        setZoomWebinarConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('All Webinar list refresh failed Cause: %s. please try again', 'bit-integrations'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('All Webinar list failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  const apiEndpoint = `https://zoom.us/oauth/authorize?response_type=code&client_id=${confTmp.clientId}&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}/redirect`)}`
  const authWindow = window.open(apiEndpoint, 'zoom', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitsGoogleSheet = localStorage.getItem('__zoom')
      if (bitsGoogleSheet) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsGoogleSheet)
        localStorage.removeItem('__zoom')
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // eslint-disable-next-line no-undef
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`
  bitsFetch(tokenRequestParams, 'zoom_webinar_generate_token')
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

export const checkMappedFields = (zoomWebinarConf) => {
  const mappedFleld = zoomWebinarConf.field_map ? zoomWebinarConf.field_map.filter(mapped => (!mapped.formField && !mapped.zoomWebinarConf)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (zoomWebinarConf) => {
  const requiredFlds = zoomWebinarConf?.zoomWebinarFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', zoomField: field.key })) : [{ formField: '', zoomField: '' }]
}
