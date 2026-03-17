import { create } from 'mutative'
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, creatorLmsConf, setCreatorLmsConf) => {
  const { name, value } = e.target
  setCreatorLmsConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = creatorLmsConf => {
  const mappedFields = creatorLmsConf?.field_map
    ? creatorLmsConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.creatorLmsField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        creatorLmsField: field.key
      }))
    : [{ formField: '', creatorLmsField: '' }]
}
