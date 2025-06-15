/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
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

export const handleAuthorize = (confTmp, setConf, setError, setIsAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.api_key) {
    setError({ api_key: !confTmp.api_key ? __('Api Key can\'t be empty', 'bit-integrations') : '' })
    return
  }
  setError({})
  setIsLoading(true)

  const tokenRequestParams = { username: confTmp.userName, api_key: confTmp.api_key }

  bitsFetch(tokenRequestParams, 'kirimEmail_authorization')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLists = result.data
        }
        setConf(newConf)
        setIsAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
}

export const getAllList = (kirimEmailConf, setKirimEmailConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const tokenRequestParams = { username: kirimEmailConf.userName, api_key: kirimEmailConf.api_key }

  bitsFetch(tokenRequestParams, 'kirimEmail_fetch_all_list')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...kirimEmailConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLists = result.data
        }
        setKirimEmailConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All list fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Kirim Email list fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const checkMappedFields = fieldsMapped => {
  const checkedField = fieldsMapped
    ? fieldsMapped?.filter(item => (!item.formField || !item.kirimEmailFormField))
    : []
  if (checkedField.length > 0) return false
  return true
}

// export const checkMappedFields = (kirimEmailConf) => {
//   const mappedFleld = kirimEmailConf.field_map ? kirimEmailConf.field_map.filter(mapped => (!mapped.formField && !mapped.kirimEmailFormField)) : []
//   if (mappedFleld.length > 0) {
//     return false
//   }
//   return true
// }

export const generateMappedField = (kirimEmailConf) => {
  const requiredFlds = kirimEmailConf?.subscriberFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', kirimEmailFormField: field.key })) : [{ formField: '', kirimEmailFormField: '' }]
}
