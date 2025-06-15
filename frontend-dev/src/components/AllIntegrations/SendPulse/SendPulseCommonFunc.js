// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, sendPulseConf, setSendPulseConf) => {
  const newConf = { ...sendPulseConf }
  newConf.name = e.target.value
  setSendPulseConf({ ...newConf })
}

// refreshMappedLists
export const refreshSendPulseList = (sendPulseConf, setSendPulseConf, setIsLoading, setSnackbar) => {

  const refreshListsRequestParams = {
    client_id: sendPulseConf.client_id,
    client_secret: sendPulseConf.client_secret,
    tokenDetails: sendPulseConf.tokenDetails
  }
  bitsFetch(refreshListsRequestParams, 'sendPulse_lists')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...sendPulseConf }
        if (result.data) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.sendPulseLists = result.data
          setSnackbar({
            show: true,
            msg: __('SendPulse lists refreshed', 'bit-integrations'),
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No SendPulse lists found. Try changing the header row number or try again',
              'bit-integrations',
            ),
          })
        }

        setSendPulseConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: __(
            'SendPulse lists refresh failed. please try again',
            'bit-integrations',
          ),
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

// refreshMappedFields
export const refreshSendPulseHeader = (sendPulseConf, setSendPulseConf, setIsLoading, setSnackbar) => {

  const refreshListsRequestParams = {
    client_id: sendPulseConf.client_id,
    client_secret: sendPulseConf.client_secret,
    list_id: sendPulseConf.listId,
    tokenDetails: sendPulseConf.tokenDetails
  }

  bitsFetch(refreshListsRequestParams, 'sendPulse_headers')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...sendPulseConf }
        if (result.data.sendPulseField) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.fields = result.data.sendPulseField
          const { fields } = newConf.default
          newConf.field_map = Object.values(fields)
            .filter((f) => f.required)
            .map((f) => ({
              formField: '',
              sendPulseField: f.fieldValue,
              required: true,
            }))
          setSnackbar({
            show: true,
            msg: __('SendPulse fields refreshed', 'bit-integrations'),
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No SendPulse fields found. Try changing the header row number or try again',
              'bit-integrations',
            ),
          })
        }
        setSendPulseConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: __(
            'SendPulse fields refresh failed. please try again',
            'bit-integrations',
          ),
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = (sendPulseConf) => {
  const mappedFields = sendPulseConf?.field_map
    ? sendPulseConf.field_map.filter(
      (mappedField) => !mappedField.formField
          && mappedField.sendPulseField
          && mappedField.required,
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
