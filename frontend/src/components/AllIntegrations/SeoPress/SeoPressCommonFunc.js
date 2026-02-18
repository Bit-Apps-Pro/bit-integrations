import { create } from 'mutative'

export const handleInput = (e, seoPressConf, setSeoPressConf) => {
  const { name, value } = e.target

  setSeoPressConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = seoPressConf => {
  const mappedFields = seoPressConf?.field_map
    ? seoPressConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.seoPressField ||
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
        seoPressField: field.key
      }))
    : [{ formField: '', seoPressField: '' }]
}
