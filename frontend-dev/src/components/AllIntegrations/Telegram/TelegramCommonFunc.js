import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const refreshGetUpdates = (telegramConf, setTelegramConf, setIsLoading, setSnackbar) => {
  const newConf = { ...telegramConf }
  const requestParams = { bot_api_key: newConf.bot_api_key }
  setIsLoading(true)
  bitsFetch(requestParams, 'refresh_get_updates')
    .then(result => {
      if (result && result.success) {
        if (!newConf.default) {
          newConf.default = {}
        }

        if (result.data.telegramChatLists) {
          newConf.default.telegramChatLists = result.data.telegramChatLists
        }
        setSnackbar({ show: true, msg: __('Chat list refreshed', 'bit-integrations') })
        setTelegramConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Chat list refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Chat list refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleInput = (e, telegramConf, setTelegramConf) => {
  const newConf = { ...telegramConf }
  newConf.name = e.target.value
  setTelegramConf({ ...newConf })
}
// export const checkMappedFields = telegramConf => {
//   const mappedFields = telegramConf?.field_map ? telegramConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.mailPoetField && mappedField.required)) : []
//   if (mappedFields.length > 0) {
//     return false
//   }
//   return true
// }
