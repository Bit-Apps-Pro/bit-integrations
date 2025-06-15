/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, twilioConf, setTwilioConf, setIsLoading, setSnackbar, isNew, error, setError) => {
  const newConf = { ...twilioConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setTwilioConf({ ...newConf })
}

export const checkMappedFields = (twilioConf) => {
  const mappedFields = twilioConf?.field_map ? twilioConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.twilioField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.sid || !confTmp.token || !confTmp.from_num) {
    setError({
      sid: !confTmp.sid ? __('Account SID can\'t be empty', 'bit-integrations') : '',
      token: !confTmp.token ? __('Auth Token can\'t be empty', 'bit-integrations') : '',
      from_num: !confTmp.from_num ? __('Phone number can\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = {
    sid: confTmp.sid,
    token: confTmp.token,
    from_num: confTmp.from_num,
  }

  bitsFetch(tokenRequestParams, 'twilio_authorization')
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
