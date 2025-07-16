/* eslint-disable no-else-return */
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, lineConf, setLineConf) => {
  const newConf = { ...lineConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setLineConf({ ...newConf })
}

export const getAllChannels = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.accessToken) {
    setError({
      accessToken: !confTmp.accessToken ? __("Access Token can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = { accessToken: confTmp.accessToken }

  bitsFetch(tokenRequestParams, 'line_authorization')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Authorization failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.accessToken) {
    setError({
      accessToken: !confTmp.accessToken ? __("Access Token can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = { accessToken: confTmp.accessToken }

  bitsFetch(tokenRequestParams, 'line_authorization')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Authorization failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, type) => {
  const newConf = { ...conftTmp }
  newConf[type][index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf[type][index].customValue = ''
  }
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, type) => {
  const newConf = { ...confTmp }
  const fieldMap = newConf[type]
  if (fieldMap.length > 1) {
    const groupId = fieldMap[i]?.groupId
    if (groupId) {
      newConf[type] = fieldMap.filter(f => f.groupId !== groupId)
    } else {
      fieldMap.splice(i, 1)
      newConf[type] = fieldMap
    }
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, type) => {
  const newConf = { ...conftTmp }

  newConf[type][index].customValue = event?.target?.value || event

  setConf({ ...newConf })
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        lineFormField: field.value
      }))
    : [{ formField: '', lineFormField: '' }]
}

export const addFieldMap = (i, confTmp, setConf, FieldMappings, mapKey) => {
  const newConf = { ...confTmp }
  // Generate a unique groupId for this batch
  const groupId = Date.now() + Math.random()
  const newFieldMap = FieldMappings.map(field => ({
    formField: '',
    lineFormField: field.value,
    groupId
  }))
  newConf[mapKey].splice(i, 0, ...newFieldMap)
  setConf({ ...newConf })
}
