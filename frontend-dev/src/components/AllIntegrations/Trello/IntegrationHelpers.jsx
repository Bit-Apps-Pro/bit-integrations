/* eslint-disable no-unused-expressions */
import { create } from 'mutative'
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

export const handleFieldMapping = (event, index, setConf, mapKey) => {
  setConf((prevConf) =>
    create(prevConf, (draftConf) => {
      const name = event.target.name
      const value = event.target.value

      draftConf[mapKey][index][name] = value

      if (value === 'custom') {
        draftConf[mapKey][index].customValue = ''
      }

      if (name === 'trelloFormField' && mapKey === 'custom_field_map') {
        const field = draftConf.customFields?.filter((fld) => fld.key === value)[0] || {}

        draftConf[mapKey][index].type = field?.type
        draftConf[mapKey][index].options = field?.options
      }
    })
  )
}

export const handleCustomValue = (event, index, setConf, mapKey) => {
  setConf((prevConf) =>
    create(prevConf, (draftConf) => {
      draftConf[mapKey][index].customValue = event
    })
  )
}
