import { create } from 'mutative'
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, peepSoConf, setPeepSoConf) => {
  const { name, value } = e.target

  setPeepSoConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = peepSoConf => {
  const mappedFields = peepSoConf?.field_map
    ? peepSoConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.peepSoField ||
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
        peepSoField: field.key
      }))
    : [{ formField: '', peepSoField: '' }]
}
