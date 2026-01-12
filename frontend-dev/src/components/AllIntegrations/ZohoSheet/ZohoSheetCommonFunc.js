/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, zohoSheetConf, setZohoSheetConf) => {
  const newConf = { ...zohoSheetConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setZohoSheetConf({ ...newConf })
}

export const checkMappedFields = zohoSheetConf => {
  const mappedFields = zohoSheetConf?.field_map
    ? zohoSheetConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.zohoSheetFormField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const getAllWorkbooks = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, workbooks: true })
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter
  }

  bitsFetch(requestParams, 'zohoSheet_fetch_all_work_books').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data) {
        newConf.workbooks = result.data
      }
      setConf(newConf)
      setLoading({ ...loading, workbooks: false })
      toast.success(__('Workbooks fetched successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, workbooks: false })
    toast.error(__('Workbooks fetching failed', 'bit-integrations'))
  })
}

export const getAllWorksheets = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, worksheets: true })
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter,
    workbook: confTmp.selectedWorkbook
  }

  bitsFetch(requestParams, 'zohoSheet_fetch_all_work_sheets').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data) {
        newConf.worksheets = result.data
      }
      setConf(newConf)
      setLoading({ ...loading, worksheets: false })
      toast.success(__('Worksheets fetched successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, worksheets: false })
    toast.error(__('Worksheets fetching failed', 'bit-integrations'))
  })
}

export const getWorksheetHeader = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, header: true, workSheetHeaders: false })
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter,
    workbook: confTmp.selectedWorkbook,
    worksheet: confTmp.selectedWorksheet,
    headerRow: confTmp.headerRow
  }

  bitsFetch(requestParams, 'zohoSheet_fetch_all_work_sheet_header').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data) {
        newConf.workSheetHeaders = result.data
      }
      setConf(newConf)
      setLoading({ ...loading, header: false, workSheetHeaders: true })
      toast.success(__('Worksheet headers fetched successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, header: false, workSheetHeaders: false })
    toast.error(__(`${result.data}`, 'bit-integrations'))
  })
}

export const setGrantTokenResponse = integ => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation
    .replace(`${window.opener.location.href}/redirect`, '')
    .split('&')
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

export const handleAuthorization = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __("Data center can't be empty") : '',
      clientId: !confTmp.clientId ? __("Client ID can't be empty") : '',
      clientSecret: !confTmp.clientSecret ? __("Secret key can't be empty") : ''
    })
    return
  }
  setLoading({ ...loading, auth: true })
  const scopes = 'ZohoSheet.dataAPI.READ,ZohoSheet.dataAPI.UPDATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}/redirect`)}`
  const authWindow = window.open(apiEndpoint, '__zohoSheet', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const ZohoSheet = localStorage.getItem('__zohoSheet')
      if (ZohoSheet) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(ZohoSheet)
        localStorage.removeItem('__zohoSheet')
      }
      if (
        !grantTokenResponse.code ||
        grantTokenResponse.error ||
        !grantTokenResponse ||
        !isauthRedirectLocation
      ) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        toast.error(
          __(
            `${__('Authorization Failed')} ${errorCause}. ${__('please try again')}`,
            'bit-integrations'
          )
        )
        setLoading({ ...loading, auth: false })
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setisAuthorized, loading, setLoading)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setisAuthorized, loading, setLoading) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`
  bitsFetch(tokenRequestParams, 'zohoSheet_generate_token')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        toast.success(__('Authorized Successfully', 'bit-integrations'))
        getAllWorkbooks(newConf, setConf, loading, setLoading)
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        toast.error(
          __(
            `${__('Authorization failed Cause:')}${result.data.data || result.data}. ${__('please try again')}`,
            'bit-integrations'
          )
        )
      } else {
        toast.error(__('Authorization failed. please try again', 'bit-integrations'))
      }
      setLoading({ ...loading, auth: false })
    })
}
