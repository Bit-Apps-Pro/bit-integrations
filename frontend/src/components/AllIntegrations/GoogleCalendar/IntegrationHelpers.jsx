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

export const addReminderFieldMap = (i, confTmp, setConf) => {
  if (confTmp.reminder_field_map.length >= 5) return
  const newConf = { ...confTmp }
  newConf.reminder_field_map.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delReminderFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.reminder_field_map.length > 1) {
    newConf.reminder_field_map.splice(i, 1)
  }
  setConf({ ...newConf })
}
