import { create } from 'mutative'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, notificationXConf, setNotificationXConf) => {
  const newConf = create(notificationXConf, draftConf => {
    draftConf[e.target.name] = e.target.value
  })
  setNotificationXConf(newConf)
}

export const generateMappedField = allFields => {
  const requiredFlds = allFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', notificationXField: field.key }))
    : [{ formField: '', notificationXField: '' }]
}

export const checkMappedFields = notificationXConf => {
  const unmapped = notificationXConf?.field_map
    ? notificationXConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.notificationXField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []

  return unmapped.length === 0
}

export const notificationXAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  setIsLoading
) => {
  if (!confTmp.name) {
    setError({
      name: !confTmp.name ? __("Integration name can't be empty", 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setIsLoading(true)

  const requestParams = { name: confTmp.name }

  bitsFetch(requestParams, 'notificationx_authorize').then(result => {
    if (result && result.success) {
      setIsAuthorized(true)
    }

    setIsLoading(false)
  })
}

