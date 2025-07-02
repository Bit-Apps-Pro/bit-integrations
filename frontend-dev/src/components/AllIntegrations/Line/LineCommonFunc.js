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

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf.video_field_map.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.video_field_map.length > 1) {
    newConf.video_field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1].field_map[index].customValue = event?.target?.value || event
  } else {
    newConf.field_map[index].customValue = event?.target?.value || event
  }
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

export const addVideoFieldMap = (i, confTmp, setConf, videoFields) => {
  const newConf = { ...confTmp }

 
  const newFieldMaps = videoFields.map(field => ({
    formField: '',
    lineFormField: field.value
  }))
  console.log('value', newFieldMaps)


  newConf.video_field_map.splice(i, 0, ...newFieldMaps)
  console.log('good', newConf.video_field_map)

  setConf({ ...newConf })
}
