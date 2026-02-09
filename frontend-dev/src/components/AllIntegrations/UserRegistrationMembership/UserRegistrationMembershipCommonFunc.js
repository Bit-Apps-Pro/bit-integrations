import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, userRegistrationConf, setUserRegistrationConf) => {
  const { name, value } = e.target
  const newConf = { ...userRegistrationConf }
  newConf[name] = value
  setUserRegistrationConf(newConf)
}

export const userRegistrationAuthorize = (
  setIsAuthorized,
  setShowAuthMsg,
  setIsLoading,
  setSnackbar,
  nextPage
) => {
  setIsLoading(true)
  bitsFetch({}, 'user_registration_authorize')
    .then(result => {
      if (result?.success) {
        setIsAuthorized(true)
        setShowAuthMsg(true)
        setSnackbar({
          show: true,
          msg: __('Connected Successfully', 'bit-integrations')
        })
        nextPage(2)
      } else {
        setSnackbar({
          show: true,
          msg: __(
            result?.data ||
              'Connection failed. Please make sure User Registration and Membership plugin is installed and activated.',
            'bit-integrations'
          )
        })
      }
      setIsLoading(false)
    })
    .catch(error => {
      setSnackbar({
        show: true,
        msg: __('Connection failed', 'bit-integrations')
      })
      setIsLoading(false)
    })
}

export const refreshForms = (
  userRegistrationConf,
  setUserRegistrationConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  bitsFetch({}, 'refresh_user_registration_forms')
    .then(result => {
      if (result?.success && result?.data) {
        const newConf = { ...userRegistrationConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        newConf.default.forms = result.data.forms || []
        setUserRegistrationConf(newConf)
        setSnackbar({
          show: true,
          msg: __('Forms refreshed successfully', 'bit-integrations')
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Failed to refresh forms', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => {
      setSnackbar({
        show: true,
        msg: __('Failed to refresh forms', 'bit-integrations')
      })
      setIsLoading(false)
    })
}

export const refreshFormFields = (
  formId,
  userRegistrationConf,
  setUserRegistrationConf,
  setIsLoading,
  setSnackbar
) => {
  if (!formId) {
    return
  }

  setIsLoading(true)
  bitsFetch({ form_id: formId }, 'refresh_user_registration_form_fields')
    .then(result => {
      if (result?.success && result?.data) {
        const newConf = { ...userRegistrationConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        newConf.default.formFields = result.data.fields || []
        newConf.field_map = generateMappedField(newConf.default.formFields)
        setUserRegistrationConf(newConf)
        setSnackbar({
          show: true,
          msg: __('Form fields refreshed successfully', 'bit-integrations')
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Failed to refresh form fields', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => {
      setSnackbar({
        show: true,
        msg: __('Failed to refresh form fields', 'bit-integrations')
      })
      setIsLoading(false)
    })
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        userRegistrationField: field.value || field.key
      }))
    : [{ formField: '', userRegistrationField: '' }]
}

export const checkMappedFields = userRegistrationConf => {
  const { mainAction, field_map, selectedForm } = userRegistrationConf

  if (!mainAction || mainAction !== 'create_user') {
    return false
  }

  if (!selectedForm) {
    return false
  }

  const formFields = userRegistrationConf?.default?.formFields || []
  const requiredFields = formFields.filter(fld => fld.required === true || fld.required === 'true')

  if (requiredFields.length === 0) {
    return field_map.length > 0
  }

  const mappedFields = field_map.map(field => field.userRegistrationField).filter(f => f)

  return requiredFields.every(reqField => mappedFields.includes(reqField.value))
}
