/* eslint-disable no-unused-expressions */
import { __ } from '../../../Utils/i18nwrap'

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

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleListFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map_list[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map_list[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleListCustomValue = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }

  newConf.field_map_list[index].customValue = event.target.value
  setConf({ ...newConf })
}

export const addListFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf.field_map_list.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delListFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.field_map_list.length > 1) {
    newConf.field_map_list.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleUnsubscribeFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map_unsubscribe[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map_unsubscribe[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleUnsubscribeCustomValue = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }

  newConf.field_map_unsubscribe[index].customValue = event.target.value
  setConf({ ...newConf })
}