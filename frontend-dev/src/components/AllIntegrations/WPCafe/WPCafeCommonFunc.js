import { create } from 'mutative'
import { sprintf, __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, wpcafeConf, setWpcafeConf, formID) => {
  const newConf = create(wpcafeConf, draftConf => {
    draftConf[e.target.name] = e.target.value
  })
  setWpcafeConf(newConf)
}

export const generateMappedField = allFields => {
  const requiredFlds = allFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', wpcafeField: field.key }))
    : [{ formField: '', wpcafeField: '' }]
}

export const checkMappedFields = wpcafeConf => {
  const mappedFields = wpcafeConf?.field_map
    ? wpcafeConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.wpcafeField ||
          (!mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const wpcafeAuthentication = (confTmp, setConf, setError, setIsAuthorized, setIsLoading) => {
  if (!confTmp.name) {
    setError({ name: !confTmp.name ? __("Integration name cann't be empty", 'bit-integrations') : '' })
    return
  }

  setError({})
  setIsLoading(true)

  const requestParams = { name: confTmp.name }

  bitsFetch(requestParams, 'wpcafe_authorize').then(result => {
    if (result && result.success) {
      setIsAuthorized(true)
    }

    setIsLoading(false)
  })
}
