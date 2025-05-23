import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { create } from 'mutative'

export const handleInput = (
  e,
  zoomConf,
  setZoomConf,
  formID,
  setIsLoading,
  setSnackbar,
  isNew,
  error,
  setError
) => {
  let newConf = { ...zoomConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  if (e.target.name === 'id') {
    refreshFields(newConf, setZoomConf, setIsLoading, setSnackbar)
  }
  switch (e.target.name) {
    case 'spreadsheetId':
      newConf = spreadSheetChange(newConf, formID, setZoomConf, setIsLoading, setSnackbar)
      break
    case 'worksheetName':
      newConf = worksheetChange(newConf, formID, setZoomConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setZoomConf({ ...newConf })
}
export const zoomAllMeeting = (formID, zoomConf, setZoomConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const fetchMeetingModulesRequestParams = {
    formID,
    clientId: zoomConf.clientId,
    accessToken: zoomConf.tokenDetails.access_token,
    clientSecret: zoomConf.clientSecret,
    refreshToken: zoomConf.tokenDetails.refresh_token,
    tokenDetails: zoomConf.tokenDetails
  }
  bitsFetch(fetchMeetingModulesRequestParams, 'zoom_fetch_all_meetings')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...zoomConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.allMeeting) {
          newConf.default.allMeeting = result.data.allMeeting
        }

        setSnackbar({
          show: true,
          msg: __('Meeting list refreshed', 'bit-integrations')
        })
        setZoomConf({ ...newConf })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('All Meeting list refresh failed Cause: %s. please try again', 'bit-integrations'),
            result.data.data || result.data
          )
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('All Meeting list failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshFields = (zoomConf, setZoomConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const fetchMeetingModulesRequestParams = {
    meetingId: zoomConf.id,
    clientId: zoomConf.clientId,
    accessToken: zoomConf.tokenDetails.access_token,
    clientSecret: zoomConf.clientSecret,
    refreshToken: zoomConf.tokenDetails.refresh_token,
    tokenDetails: zoomConf.tokenDetails
  }
  bitsFetch(fetchMeetingModulesRequestParams, 'zoom_fetch_all_fields')
    .then((result) => {
      setIsLoading(false)
      if (result && result.success) {
        setZoomConf((prevConf) =>
          create(prevConf, (draftConf) => {
            draftConf.zoomFields = result.data
            draftConf.field_map = generateMappedField(draftConf.zoomFields)
          })
        )
        setSnackbar({
          show: true,
          msg: __('Zoom fields refreshed', 'bit-integrations')
        })
      }
      setSnackbar({
        show: true,
        msg: result?.data ? result?.data : __('Zoom fields refreshed failed!', 'bit-integrations')
      })
    })
    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __("Client Id can't be empty", 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __("Secret key can't be empty", 'bit-integrations') : ''
    })
    return
  }
  setIsLoading(true)
  const apiEndpoint = `https://zoom.us/oauth/authorize?response_type=code&client_id=${confTmp.clientId
    }&state=${encodeURIComponent(
      window.location.href
    )}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}/redirect`)}`
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
      if (
        !grantTokenResponse.code ||
        grantTokenResponse.error ||
        !grantTokenResponse ||
        !isauthRedirectLocation
      ) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({
          show: true,
          msg: `${__(
            'Authorization failed',
            'bit-integrations'
          )} ${errorCause}. ${__('please try again', 'bit-integrations')}`
        })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(
          grantTokenResponse,
          newConf,
          setConf,
          setisAuthorized,
          setIsLoading,
          setSnackbar
        )
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
  bitsFetch(tokenRequestParams, 'zoom_generate_token')
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
          msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data
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

export const checkMappedFields = (zoomConf) => {
  const mappedFleld = zoomConf.field_map
    ? zoomConf.field_map.filter((mapped) => !mapped.formField && !mapped.zoomConf)
    : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (zoomFields = []) => {
  const requiredFlds = zoomFields?.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({ formField: '', zoomField: field.key }))
    : [{ formField: '', zoomField: '' }]
}
