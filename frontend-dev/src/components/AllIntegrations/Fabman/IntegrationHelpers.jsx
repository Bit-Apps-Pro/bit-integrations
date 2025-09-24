import { create } from 'mutative'

export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = create(confTmp, draft => {
    const fieldMap = Array.isArray(draft.field_map) ? [...draft.field_map] : []
    fieldMap.splice(i, 0, {})
    draft.field_map = fieldMap
  })
  setConf(newConf)
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = create(confTmp, draft => {
    const fieldMap = Array.isArray(draft.field_map) ? [...draft.field_map] : []
    if (fieldMap.length > 1) {
      fieldMap.splice(i, 1)
    }
    draft.field_map = fieldMap
  })
  setConf(newConf)
}

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = create(conftTmp, draft => {
    const fieldMap = Array.isArray(draft.field_map) ? [...draft.field_map] : []
    if (!fieldMap[index]) fieldMap[index] = {}
    fieldMap[index][event.target.name] = event.target.value
    if (event.target.value === 'custom') {
      fieldMap[index].customValue = ''
    }
    draft.field_map = fieldMap
  })
  setConf(newConf)
}
