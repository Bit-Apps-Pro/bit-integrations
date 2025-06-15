export const addFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    uploadFields ? newConf.relatedlists[tab - 1].upload_field_map.splice(i, 0, {}) : newConf.relatedlists[tab - 1].field_map.splice(i, 0, {})
  } else {
    uploadFields ? newConf.upload_field_map.splice(i, 0, {}) : newConf.field_map.splice(i, 0, {})
  }

  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    if (uploadFields) {
      if (newConf.relatedlists[tab - 1].upload_field_map.length > 1) {
        newConf.relatedlists[tab - 1].upload_field_map.splice(i, 1)
      }
    } else if (newConf.relatedlists[tab - 1].field_map.length > 1) {
      newConf.relatedlists[tab - 1].field_map.splice(i, 1)
    }
  } else if (uploadFields) {
    if (newConf.upload_field_map.length > 1) {
      newConf.upload_field_map.splice(i, 1)
    }
  } else if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, uploadFields, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    if (uploadFields) newConf.relatedlists[tab - 1].upload_field_map[index][event.target.name] = event.target.value
    else newConf.relatedlists[tab - 1].field_map[index][event.target.name] = event.target.value
  } else if (uploadFields) newConf.upload_field_map[index][event.target.name] = event.target.value
  else newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    if (tab) {
      newConf.relatedlists[tab - 1].field_map[index].customValue = ''
    } else newConf.field_map[index].customValue = ''
  }

  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1].field_map[index].customValue = event.target.value
  } else {
    newConf.field_map[index].customValue = event.target.value
  }
  setConf({ ...newConf })
}
export const handleAddress = (event, index, confTmp, setConf, addressField, tab) => {
  const newConf = { ...confTmp }
  newConf.address_field[index][event.target.name] = event.target.value
  setConf({ ...newConf })
}

export const addAddressFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (!newConf.address_field) newConf.address_field = []
  newConf.address_field.push({})
  setConf({ ...newConf })
}

export const delAddressFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.address_field && newConf.address_field.length > 1) newConf.address_field.splice(i, 1)
  setConf({ ...newConf })
}
