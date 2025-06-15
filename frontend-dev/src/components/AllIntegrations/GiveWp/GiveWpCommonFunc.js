import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, giveWpConf, setGiveWpConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...giveWpConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setGiveWpConf({ ...newConf })
}

export const generateMappedField = (giveWpConf) => {
  const requiredFlds = giveWpConf?.giveWpFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', giveWpFormField: field.key })) : [{ formField: '', giveWpFormField: '' }]
}

export const checkMappedFields = (giveWpConf) => {
  const mappedFleld = giveWpConf.field_map ? giveWpConf.field_map.filter((mapped) => !mapped.formField || !mapped.giveWpFormField) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
