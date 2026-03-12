import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const refreshNewsLetter = (formID, mailPoetConf, setMailPoetConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'refresh_news_letter')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...mailPoetConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.newsletterList) {
          newConf.default.newsletterList = result.data.newsletterList
        }
        setSnackbar({ show: true, msg: __('Newsletter list refreshed', 'bit-integrations') })
        setMailPoetConf({ ...newConf })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Newsletter list refresh failed Cause:', 'bit-integrations')}${
            result.data.data || result.data
          }. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Newsletter list refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshMailpoetHeader = (mailPoetConf, setMailPoetConf, setIsLoading, setSnackbar) => {
  bitsFetch({}, 'mail_poet_list_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...mailPoetConf }
        if (result.data.mailPoetFields) {
          newConf.default.fields = result.data.mailPoetFields
          const { fields } = newConf.default
          newConf.field_map = Object.values(fields)
            .filter(f => f.required)
            .map(f => ({ formField: '', mailPoetField: f.id, required: true }))
          setSnackbar({ show: true, msg: __('Mailpoet fields refreshed', 'bit-integrations') })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No Mailpoet fields found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setMailPoetConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: __('Mailpoet fields refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleInput = (e, mailPoetConf, setMailPoetConf) => {
  const newConf = { ...mailPoetConf }
  newConf.name = e.target.value
  setMailPoetConf({ ...newConf })
}
export const checkMappedFields = mailPoetConf => {
  const mappedFields = mailPoetConf?.field_map
    ? mailPoetConf.field_map.filter(
        mappedField => !mappedField.formField && mappedField.mailPoetField && mappedField.required
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
