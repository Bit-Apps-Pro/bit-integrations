import { create } from 'mutative'

export const handleInput = (e, wpDataTablesConf, setWpDataTablesConf) => {
  const { name, value } = e.target

  setWpDataTablesConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = wpDataTablesConf => {
  const mappedFields = wpDataTablesConf?.field_map
    ? wpDataTablesConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.wpDataTablesField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []

  return mappedFields.length === 0
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', wpDataTablesField: field.key }))
    : [{ formField: '', wpDataTablesField: '' }]
}
