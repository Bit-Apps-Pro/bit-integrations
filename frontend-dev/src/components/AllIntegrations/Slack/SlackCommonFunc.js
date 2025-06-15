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

export const getAllChannels = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.accessToken) {
    setError({ accessToken: !confTmp.accessToken ? __('Access Token can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = { accessToken: confTmp.accessToken }

  bitsFetch(tokenRequestParams, 'slack_authorization')
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

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.accessToken) {
    setError({ accessToken: !confTmp.accessToken ? __('Access Token can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = { accessToken: confTmp.accessToken }

  bitsFetch(tokenRequestParams, 'slack_authorization_and_fetch_channels')
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
