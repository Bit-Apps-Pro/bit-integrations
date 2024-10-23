// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, convertKitConf, setConvertKitConf) => {
  const newConf = { ...convertKitConf }
  newConf.name = e.target.value
  setConvertKitConf({ ...newConf })
}

export const refreshConvertKitForm = (convertKitConf, setConvertKitConf, setIsLoading, setSnackbar) => {
  const refreshFormsRequestParams = {
    api_secret: convertKitConf.api_secret
  }
  bitsFetch(refreshFormsRequestParams, 'convertKit_forms')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...convertKitConf }
        if (result.data.convertKitForms) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.convertKitForms = result.data.convertKitForms
          setSnackbar({
            show: true,
            msg: __('Convert Kit forms refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No Convert Kit forms found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }

        setConvertKitConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('%s forms refresh failed. please try again', 'bit-integrations'),
            'Kit(ConvertKit)'
          )
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
// refreshConvertKitTags
export const refreshConvertKitTags = (convertKitConf, setConvertKitConf, setIsLoading, setSnackbar) => {
  const refreshFormsRequestParams = {
    api_secret: convertKitConf.api_secret
  }
  bitsFetch(refreshFormsRequestParams, 'convertKit_tags')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...convertKitConf }
        if (result.data.convertKitTags) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.convertKitTags = result.data.convertKitTags
          setSnackbar({
            show: true,
            msg: sprintf(__('%s tags refreshed', 'bit-integrations'), 'Kit(ConvertKit)')
          })
        } else {
          setSnackbar({
            show: true,
            msg: sprintf(
              __(
                'No %s tags found. Try changing the header row number or try again',
                'bit-integrations'
              ),
              'Kit(ConvertKit)'
            )
          })
        }

        setConvertKitConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('%s tags refresh failed. please try again', 'bit-integrations'),
            'Kit(ConvertKit)'
          )
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
// refreshMappedFields
export const refreshConvertKitHeader = (
  convertKitConf,
  setConvertKitConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshFormsRequestParams = {
    api_secret: convertKitConf.api_secret
  }
  bitsFetch(refreshFormsRequestParams, 'convertKit_headers')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...convertKitConf }
        if (result.data.convertKitField) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.fields = result.data.convertKitField
          const { fields } = newConf.default
          newConf.field_map = Object.values(fields)
            .filter((f) => f.required)
            .map((f) => ({
              formField: '',
              convertKitField: f.fieldId,
              required: true
            }))
          setSnackbar({
            show: true,
            msg: sprintf(__('%s fields refreshed', 'bit-integrations'), 'Kit(ConvertKit)')
          })
        } else {
          setSnackbar({
            show: true,
            msg: sprintf(
              __(
                'No %s fields found. Try changing the header row number or try again',
                'bit-integrations'
              ),
              'Kit(ConvertKit)'
            )
          })
        }

        setConvertKitConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('%s fields refresh failed. please try again', 'bit-integrations'),
            'Kit(ConvertKit)'
          )
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = (convertKitConf) => {
  const mappedFields = convertKitConf?.field_map
    ? convertKitConf.field_map.filter(
        (mappedField) => !mappedField.formField && mappedField.convertKitField && mappedField.required
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
