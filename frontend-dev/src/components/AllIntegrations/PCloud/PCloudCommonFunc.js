/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, pCloudConf, setPCloudConf) => {
  const newConf = { ...pCloudConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setPCloudConf({ ...newConf })
}

export const checkMappedFields = (pCloudConf) => {
  const mappedFields = pCloudConf?.field_map ? pCloudConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.pCloudFormField)) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const getAllPCloudFolders = (pCloudConf, setPCloudConf, type) => {
  const queryParams = { tokenDetails: pCloudConf.tokenDetails }
  const loadPostTypes = bitsFetch(queryParams, 'pCloud_get_all_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...pCloudConf }
        if (result.data) {
          newConf.foldersList = result.data
        }
        setPCloudConf(newConf)
        if (type === 'fetch') {
          return 'Folders fetched successfully'
        }
        return 'Folders refreshed successfully'
      } else {
        return 'Folders refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading PCloud Folders List...', 'bit-integrations'),
  })
}

export const handleAuthorization = (confTmp, setConf, setIsAuthorized, setIsLoading, setError) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client Id can\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Client Secret can\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  // eslint-disable-next-line no-undef
  const apiEndpoint = `https://my.pcloud.com/oauth2/authorize?client_id=${confTmp.clientId}&response_type=code&redirect_uri=${btcbi.api.base}/redirect&state=${encodeURIComponent(window.location.href)}/redirect`
  const authWindow = window.open(apiEndpoint, 'pCloud', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isAuthRedirectLocation = false
      const bitsPCloud = localStorage.getItem('__pCloud')
      if (bitsPCloud) {
        isAuthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsPCloud)
        localStorage.removeItem('__pCloud')
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

  bitsFetch(tokenRequestParams, 'pCloud_authorization')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setIsAuthorized(true)
        toast.success(__('Authorized Successfully', 'bit-integrations'))
      } else if ((result && result.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause:', 'bit-integrations')}${result.data}. ${__('please try again', 'bit-integrations')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bit-integrations'))
      }
      setIsLoading(false)
    })
}
