/* eslint-disable no-unused-expressions */

import { create } from 'mutative'

export const addFieldMap = (i, confTmp, setConf, fieldMappingKey) => {
  const newConf = { ...confTmp }
  newConf[fieldMappingKey].splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, fieldMappingKey) => {
  const newConf = { ...confTmp }
  if (newConf[fieldMappingKey].length > 1) {
    newConf[fieldMappingKey].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, fieldMappingKey) => {
  const newConf = { ...conftTmp }
  newConf[fieldMappingKey][index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf[fieldMappingKey][index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, fieldMappingKey) => {
  setConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[fieldMappingKey][index].customValue = event?.target?.value || event
    })
  )
}
