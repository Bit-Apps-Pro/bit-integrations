/* eslint-disable no-else-return */
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, lineConf, setLineConf) => {
  const { name, value } = e.target
  setLineConf(prev => ({ ...prev, [name]: value }))
}

export const handleAuthorize = async (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.accessToken) {
    setError({ accessToken: __("Access Token can't be empty", 'bit-integrations') })
    return
  }

  setError({})
  setIsLoading(true)

  try {
    const result = await bitsFetch({ accessToken: confTmp.accessToken }, 'line_authorization')

    if (result?.success) {
      setConf({ ...confTmp, tokenDetails: result.data })
      setisAuthorized(true)
      setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
    } else {
      const msg = result?.data?.data
        ? `${__('Authorization failed Cause:', 'bit-integrations')} ${result.data.data}. ${__('Please try again', 'bit-integrations')}`
        : typeof result?.data === 'string'
          ? `${__('Authorization failed Cause:', 'bit-integrations')} ${result.data}. ${__('Please try again', 'bit-integrations')}`
          : __('Authorization failed. Please try again', 'bit-integrations')

      setSnackbar({ show: true, msg })
    }

    setIsLoading(false)
  } catch (error) {
    setSnackbar({
      show: true,
      msg: `${__('An error occurred during authorization:', 'bit-integrations')} ${error?.message || error}`
    })

    setIsLoading(false)
  }
}

const updateFieldMap = (prevConf, type, index, updater) => {
  const newConf = { ...prevConf }

  if (!Array.isArray(newConf[type])) newConf[type] = []

  if (!newConf[type][index]) newConf[type][index] = {}
  newConf[type][index] = { ...newConf[type][index], ...updater(newConf[type][index]) }
  return newConf
}

export const handleFieldMapping = (event, index, setConf, type) => {
  setConf(prev =>
    updateFieldMap(prev, type, index, () => ({
      [event.target.name]: event.target.value,
      ...(event.target.value === 'custom' ? { customValue: '' } : { customValue: undefined })
    }))
  )
}

export const handleCustomValue = (event, index, _, setConf, type) => {
  const value = event?.target?.value ?? event
  setConf(prev => updateFieldMap(prev, type, index, () => ({ customValue: value })))
}

export const delFieldMap = (index, _, setConf, type) => {
  setConf(prev => {
    const fieldMap = prev[type] || []

    if (fieldMap.length <= 1) return prev

    const updatedFieldMap = fieldMap[index]?.groupId
      ? fieldMap.filter(f => f.groupId !== fieldMap[index].groupId)
      : fieldMap.filter((_, i) => i !== index)

    return { ...prev, [type]: updatedFieldMap }
  })
}

const FIELD_TYPE_GROUPS = {
  sticker: ['sticker_id', 'package_id'],
  image: ['originalContentUrl', 'previewImageUrl'],
  audio: ['originalContentUrl', 'duration'],
  video: ['originalContentUrl', 'previewImageUrl'],
  location: ['title', 'address', 'latitude', 'longitude'],
  emoji: ['emojis_id', 'product_id', 'index']
}

const getFieldTypeGroup = lineFormField => {
  for (const [type, fields] of Object.entries(FIELD_TYPE_GROUPS)) {
    if (fields.includes(lineFormField)) {
      return type
    }
  }
  return 'default'
}

const generateGroupId = (fieldType, existingFieldMap) => {
  const existingGroups = [
    ...new Set(
      existingFieldMap
        .filter(field => getFieldTypeGroup(field.lineFormField) === fieldType)
        .map(field => field.groupId)
    )
  ]

  return `${fieldType}_${existingGroups.length + 1}`
}

export const addFieldMap = (i, confTmp, setConf, FieldMappings, mapKey) => {
  setConf(prev => {
    const newConf = { ...prev }
    if (!Array.isArray(newConf[mapKey])) newConf[mapKey] = []

    const newFieldMap = FieldMappings.map(field => {
      const fieldType = getFieldTypeGroup(field.value)
      const groupId = generateGroupId(fieldType, newConf[mapKey])

      return {
        formField: '',
        lineFormField: field.value,
        groupId,
        fieldType
      }
    })

    newConf[mapKey].splice(i, 0, ...newFieldMap)
    return newConf
  })
}

const isFieldMapConfigured = fieldMap =>
  Array.isArray(fieldMap) &&
  fieldMap.length > 0 &&
  fieldMap.every(f => f && (f.formField !== 'custom' ? f.formField?.trim() : f.customValue?.trim()))

const isMessageFieldConfigured = lineConf =>
  lineConf.message_field_map?.[0] &&
  (lineConf.message_field_map[0].formField !== 'custom'
    ? lineConf.message_field_map[0].formField?.trim()
    : lineConf.message_field_map[0].customValue?.trim())

export const validateLineConfiguration = lineConf => {
  let baseTypeValid = false

  switch (lineConf.messageType) {
    case 'sendPushMessage':
      baseTypeValid = lineConf.recipientId?.trim() && isMessageFieldConfigured(lineConf)
      break
    case 'sendReplyMessage':
      baseTypeValid = lineConf.replyToken?.trim() && isMessageFieldConfigured(lineConf)
      break
    case 'sendBroadcastMessage':
      baseTypeValid = isMessageFieldConfigured(lineConf)
      break
  }

  const attachmentsValid = [
    !lineConf.sendEmojis || isFieldMapConfigured(lineConf.emojis_field_map),
    !lineConf.sendSticker || isFieldMapConfigured(lineConf.sticker_field_map),
    !lineConf.sendImage || isFieldMapConfigured(lineConf.image_field_map),
    !lineConf.sendAudio || isFieldMapConfigured(lineConf.audio_field_map),
    !lineConf.sendVideo || isFieldMapConfigured(lineConf.video_field_map),
    !lineConf.sendLocation || isFieldMapConfigured(lineConf.location_field_map)
  ].every(Boolean)

  return baseTypeValid && attachmentsValid
}

export const getLineValidationMessages = lineConf => {
  const messages = []

  const fieldMappingChecks = [
    ['sendEmojis', 'emojis_field_map', 'Emojis'],
    ['sendSticker', 'sticker_field_map', 'Sticker'],
    ['sendImage', 'image_field_map', 'Image'],
    ['sendAudio', 'audio_field_map', 'Audio'],
    ['sendVideo', 'video_field_map', 'Video'],
    ['sendLocation', 'location_field_map', 'Location']
  ]

  switch (lineConf.messageType) {
    case 'sendPushMessage':
      if (!lineConf.recipientId?.trim())
        messages.push(__('Recipient ID is required', 'bit-integrations'))

      if (!isMessageFieldConfigured(lineConf))
        messages.push(__('Message field mapping is required', 'bit-integrations'))
      break
    case 'sendReplyMessage':
      if (!lineConf.replyToken?.trim()) messages.push(__('Reply Token is required', 'bit-integrations'))

      if (!isMessageFieldConfigured(lineConf))
        messages.push(__('Message field mapping is required', 'bit-integrations'))
      break
    case 'sendBroadcastMessage':
      if (!isMessageFieldConfigured(lineConf))
        messages.push(__('Message field mapping is required', 'bit-integrations'))
      break
    default:
      messages.push(__('Please select a message type', 'bit-integrations'))
  }

  fieldMappingChecks.forEach(([flag, mapKey, name]) => {
    if (lineConf[flag] && !isFieldMapConfigured(lineConf[mapKey])) {
      messages.push(`${name} field mapping is required`)
    }
  })

  return messages
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(f => f.required)
  if (requiredFlds.length) {
    const typeToGroupId = {}
    return requiredFlds.map(f => {
      const fieldType = getFieldTypeGroup(f.value)
      if (!typeToGroupId[fieldType]) {
        typeToGroupId[fieldType] = `${fieldType}_1`
      }
      return {
        formField: '',
        lineFormField: f.value,
        groupId: typeToGroupId[fieldType],
        fieldType
      }
    })
  }
  return [{ formField: '', lineFormField: '' }]
}
