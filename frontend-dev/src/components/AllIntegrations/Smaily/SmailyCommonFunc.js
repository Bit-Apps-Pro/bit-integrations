/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, smailyConf, setSmailyConf) => {
  const newConf = { ...smailyConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSmailyConf({ ...newConf })
}

export const generateMappedField = (smailyConf) => {
  const requiredFlds = smailyConf?.staticFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', smailyFormField: field.key })) : [{ formField: '', smailyFormField: '' }]
}

export const checkMappedFields = (smailyConf) => {
  const mappedFields = smailyConf?.field_map ? smailyConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.smailyFormField || (mappedField.formField === 'custom' && !mappedField.customValue) || (mappedField.smailyFormField === 'customFieldKey' && !mappedField.customFieldKey))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const smailyAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.name || !confTmp.subdomain || !confTmp.api_user_name || !confTmp.api_user_password) {
    setError({
      name: !confTmp.name ? __('Integration Name can\'t be empty', 'bit-integrations') : '',
      subdomain: !confTmp.subdomain ? __('Subdomain can\'t be empty', 'bit-integrations') : '',
      api_user_name: !confTmp.api_user_name ? __('Api user name can\'t be empty', 'bit-integrations') : '',
      api_user_password: !confTmp.api_user_password ? __('Api user password can\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = { subdomain: confTmp.subdomain, api_user_name: confTmp.api_user_name, api_user_password: confTmp.api_user_password }

  bitsFetch(requestParams, 'smaily_authentication')
    .then(result => {
      if (result && result.success) {
        setIsAuthorized(true)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid subdomain name & API credentials', 'bit-integrations'))
    })
}
