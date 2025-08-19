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
  setConf(prevConf => {
    const newConf = { ...prevConf }

    if (!Array.isArray(newConf[type])) {
      newConf[type] = []
    }

    if (!newConf[type][index]) {
      newConf[type][index] = {}
    }

    newConf[type][index][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf[type][index].customValue = ''
    }

    return newConf
  })
}

export const delFieldMap = (index, confTmp, setConf, type) => {
  setConf(prevConf => {
    const fieldMap = prevConf[type] || []
    if (fieldMap.length <= 1) return prevConf

    const target = fieldMap[index]
    let updatedFieldMap

    if (target?.groupId) {
      updatedFieldMap = fieldMap.filter(f => f.groupId !== target.groupId)
    } else {
      updatedFieldMap = fieldMap.filter((_, i) => i !== index)
    }

    return {
      ...prevConf,
      [type]: updatedFieldMap
    }
  })
}

export const handleCustomValue = (event, index, conftTmp, setConf, type) => {
  setConf(prevConf => {
    const newConf = { ...prevConf }
    newConf[type][index].customValue = event?.target?.value || event
    return newConf
  })
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

  const groupId = Date.now() + Math.random()
  const newFieldMap = FieldMappings.map(field => ({
    formField: '',
    lineFormField: field.value,
    groupId
  }))
  newConf[mapKey].splice(i, 0, ...newFieldMap)
  setConf({ ...newConf })
}

export const validateLineConfiguration = lineConf => {
  const isMessageFieldConfigured = () => {
    if (!lineConf.message_field_map || lineConf.message_field_map.length === 0) {
      return false
    }

    const messageField = lineConf.message_field_map[0]
    if (!messageField) return false

    if (messageField.formField === 'custom') {
      return messageField.customValue && messageField.customValue.trim() !== ''
    }
    return messageField.formField && messageField.formField.trim() !== ''
  }

  switch (lineConf.messageType) {
    case 'sendPushMessage':
      const hasRecipientId = lineConf.recipientId && lineConf.recipientId.trim() !== ''
      const hasMessageField = isMessageFieldConfigured()
      return hasRecipientId && hasMessageField

    case 'sendReplyMessage':
      const hasReplyToken = lineConf.replyToken && lineConf.replyToken.trim() !== ''
      const hasReplyMessageField = isMessageFieldConfigured()
      return hasReplyToken && hasReplyMessageField

    case 'sendBroadcastMessage':
      const hasBroadcastMessageField = isMessageFieldConfigured()
      return hasBroadcastMessageField

    default:
      return false
  }
}

export const getLineValidationMessages = lineConf => {
  const messages = []

  const isMessageFieldConfigured = () => {
    if (!lineConf.message_field_map || lineConf.message_field_map.length === 0) {
      return false
    }

    const messageField = lineConf.message_field_map[0]
    if (!messageField) return false

    if (messageField.formField === 'custom') {
      return messageField.customValue && messageField.customValue.trim() !== ''
    }
    return messageField.formField && messageField.formField.trim() !== ''
  }

  switch (lineConf.messageType) {
    case 'sendPushMessage':
      if (!lineConf.recipientId || lineConf.recipientId.trim() === '') {
        messages.push('Recipient ID is required')
      }
      if (!isMessageFieldConfigured()) {
        messages.push('Message field mapping is required')
      }
      break

    case 'sendReplyMessage':
      if (!lineConf.replyToken || lineConf.replyToken.trim() === '') {
        messages.push('Reply Token is required')
      }
      if (!isMessageFieldConfigured()) {
        messages.push('Message field mapping is required')
      }
      break

    case 'sendBroadcastMessage':
      if (!isMessageFieldConfigured()) {
        messages.push('Message field mapping is required')
      }
      break

    default:
      messages.push('Please select a message type')
  }

  return messages
}
