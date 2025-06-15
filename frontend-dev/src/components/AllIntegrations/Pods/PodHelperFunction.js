export const addFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf[fldProp].splice(i, 0, {})

  setConf({ ...newConf })
}

export const delFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf[fldProp].length > 1) {
    newConf[fldProp].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (fldProp, event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf[fldProp][index][event.target.name] = event.target.value

  setConf({ ...newConf })
}

export const checkMappedPostFields = data => {
  const mappedFields = data?.post_map ? data.post_map.filter(mappedField => !mappedField.formField && mappedField.postFormField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}
export const checkMappedPodFields = data => {
  const mappedFields = data?.pod_map ? data.pod_map.filter(mappedField => !mappedField.formField && mappedField.podFormField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}
