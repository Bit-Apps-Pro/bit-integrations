export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf.field_map.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }
  setConf({ ...newConf })
}
