/* eslint-disable no-param-reassign */

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

  // const fldEmail = formFields?.find(f => f.key === event.target.value)

  // if (newConf[fldProp][index].userField === 'user_email' && fldEmail?.typ !== 'email') {
  //   setSnackbar({ show: true, msg: 'should be selected email field..' })
  //   return
  // }
  newConf[fldProp][index][event.target.name] = event.target.value
  setConf(newConf)
}

export const checkMappedUserFields = (data) => {
  const mappedFields = data ? data?.user_map?.filter(mappedField => !mappedField.formField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
