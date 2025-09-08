/* eslint-disable no-unused-expressions */

export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  const fieldMap = Array.isArray(newConf.field_map) ? [...newConf.field_map] : []
  fieldMap.splice(i, 0, {})
  newConf.field_map = fieldMap
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  const fieldMap = Array.isArray(newConf.field_map) ? [...newConf.field_map] : []
  if (fieldMap.length > 1) {
    fieldMap.splice(i, 1)
  }
  newConf.field_map = fieldMap
  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  const fieldMap = Array.isArray(newConf.field_map) ? [...newConf.field_map] : []
  if (!fieldMap[index]) fieldMap[index] = {}
  fieldMap[index][event.target.name] = event.target.value
  if (event.target.value === 'custom') {
    fieldMap[index].customValue = ''
  }
  newConf.field_map = fieldMap
  setConf({ ...newConf })
}
