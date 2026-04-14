import { create } from 'mutative'

export const handleInput = (e, ultimateAffiliateProConf, setUltimateAffiliateProConf) => {
  const { name, value } = e.target

  setUltimateAffiliateProConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = ultimateAffiliateProConf => {
  const mappedFields = ultimateAffiliateProConf?.field_map
    ? ultimateAffiliateProConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.ultimateAffiliateProField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []

  return mappedFields.length === 0
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        ultimateAffiliateProField: field.key
      }))
    : [{ formField: '', ultimateAffiliateProField: '' }]
}
