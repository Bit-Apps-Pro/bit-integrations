import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, whatsAppConf, setWhatsAppConf) => {
  const newConf = { ...whatsAppConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setWhatsAppConf({ ...newConf })
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.numberID || !confTmp.businessAccountID || !confTmp.token) {
    setError({ clientId: !confTmp.clientId ? __('Number Id, Bussness Id and Access Token can\'t be empty or invalid', 'bit-integrations') : '' })
    return
  }

  setError({})
  setIsLoading(true)
  setisAuthorized(true)
  setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
  setIsLoading(false)
}

export const generateMappedField = (whatsAppConf) => {
  const requiredFlds = whatsAppConf?.whatsAppFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', whatsAppFormField: field.key })) : [{ formField: '', whatsAppFormField: '' }]
}

export const checkMappedFields = (whatsAppConf) => {
  const mappedFleld = whatsAppConf.field_map ? whatsAppConf.field_map.filter(mapped => (mapped.formField && mapped.whatsAppFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
