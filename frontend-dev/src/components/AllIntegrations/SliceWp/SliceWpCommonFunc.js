import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, sliceWpConf, setSliceWpConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...sliceWpConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setSliceWpConf({ ...newConf })
}

export const generateMappedField = (sliceWpConf) => {
  const requiredFlds = sliceWpConf?.sliceWpFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', slicewpFormField: field.key })) : [{ formField: '', slicewpFormField: '' }]
}

export const checkMappedFields = (sliceWpConf) => {
  const mappedFleld = sliceWpConf.field_map ? sliceWpConf.field_map.filter((mapped) => !mapped.formField || !mapped.slicewpFormField) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
