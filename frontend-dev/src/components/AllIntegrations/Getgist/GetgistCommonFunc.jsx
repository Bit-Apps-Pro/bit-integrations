// eslint-disable-next-line import/no-extraneous-dependencies
export const handleInput = (e, getgistConf, setGetgistConf, setIsLoading) => {
  const newConf = { ...getgistConf }
  newConf.name = e.target.value
  setGetgistConf({ ...newConf })
}

export const checkMappedFields = (getgistConf) => {
  const mappedFields = getgistConf?.field_map ? getgistConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.getgistFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (getgistConf) => {
  const requiredFlds = getgistConf?.gistFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', getgistFormField: field.key })) : [{ formField: '', getgistFormField: '' }]
}
