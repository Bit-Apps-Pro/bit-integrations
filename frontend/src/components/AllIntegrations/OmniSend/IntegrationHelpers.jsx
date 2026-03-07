/* eslint-disable no-unused-expressions */
import { __ } from '../../../Utils/i18nwrap'

export const addFieldMap = (i, confTmp, setConf, type = 'field_map') => {
  const newConf = { ...confTmp }
  if (!newConf[type]) {
    newConf[type] = []
  }

  newConf[type].splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, type = 'field_map') => {
  const newConf = { ...confTmp }
  if (newConf[type].length > 1) {
    newConf[type].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, type = 'field_map') => {
  const newConf = { ...conftTmp }
  newConf[type][index].customValue = event?.target?.value || event

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, type = 'field_map') => {
  const newConf = { ...conftTmp }
  newConf[type][index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf[type][index].customValue = ''
  }
  setConf({ ...newConf })
}
