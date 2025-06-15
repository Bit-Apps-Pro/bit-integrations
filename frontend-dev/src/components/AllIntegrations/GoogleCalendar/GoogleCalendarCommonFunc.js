/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, googleCalendarConf, setGoogleCalendarConf) => {
  const newConf = { ...googleCalendarConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setGoogleCalendarConf({ ...newConf })
}

export const checkMappedFields = fieldsMapped => {
  const checkedField = fieldsMapped
    ? fieldsMapped.filter(item => (!item.formField || !item.googleCalendarFormField))
    : []
  if (checkedField.length > 0) return false
  return true
}

export const getAllGoogleCalendarLists = (flowID, googleCalendarConf, setGoogleCalendarConf) => {
  const queryParams = {
    flowID: flowID ?? null,
    clientId: googleCalendarConf.clientId,
    clientSecret: googleCalendarConf.clientSecret,
    tokenDetails: googleCalendarConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(queryParams, 'googleCalendar_get_all_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...googleCalendarConf }
        if (result.data.googleCalendarLists) {
          newConf.calendarLists = result.data.googleCalendarLists
          newConf.tokenDetails = result.data.tokenDetails
        }

        setGoogleCalendarConf(newConf)
        return 'Google Calendar List refreshed successfully'
      } else {
        return 'Google Calendar List refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Google Calendar List...', 'bit-integrations'),
  })
}

export const handleAuthorize = (confTmp, setConf, setIsAuthorized, setIsLoading, setError) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client Id can\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Client Secret can\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  const scopes = 'https://www.googleapis.com/auth/calendar'
  // eslint-disable-next-line no-undef
  const apiEndpoint = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scopes}&access_type=offline&prompt=consent&response_type=code&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}/redirect`)}&client_id=${confTmp.clientId}`
  const authWindow = window.open(apiEndpoint, 'googleCalendar', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isAuthRedirectLocation = false
      const bitsGoogleCalendar = localStorage.getItem('__googleCalendar')
      if (bitsGoogleCalendar) {
        isAuthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsGoogleCalendar)
        localStorage.removeItem('__googleCalendar')
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isAuthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        toast.error(`${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}`)
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setIsAuthorized, setIsLoading)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setIsAuthorized, setIsLoading) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // eslint-disable-next-line no-undef
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`

  bitsFetch(tokenRequestParams, 'googleCalendar_authorization')
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
