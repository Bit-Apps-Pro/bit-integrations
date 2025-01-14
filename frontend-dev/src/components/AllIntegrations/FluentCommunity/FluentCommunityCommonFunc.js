import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { create } from 'mutative'

export const refreshCrmList = (
  formID,
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCommunityList: true })
  bitsFetch({}, 'refresh_fluent_crm_lists')
    .then((result) => {
      if (result && result.success) {
        setFluentCommunityConf((prevConf) =>
          create(prevConf, (newConf) => {
            newConf.fluentCommunityList = result.data.fluentCommunityList
            newConf.fluentCommunityTags = result.data.fluentCommunityTags
          })
        )
        setSnackbar({
          show: true,
          msg: __('FluentCRM list refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            'FluentCRM list refresh failed Cause:',
            'bit-integrations'
          )}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('FluentCRM list refresh failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, fluentCommunityList: false })
    })
    .catch(() => setLoading({ ...loading, fluentCommunityTags: true }))
}

export const refreshCrmTag = (
  formID,
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCommunityTags: true })
  bitsFetch({}, 'refresh_fluent_crm_tags')
    .then((result) => {
      if (result && result.success) {
        setFluentCommunityConf((prevConf) =>
          create(prevConf, (newConf) => {
            if (!newConf.default) {
              newConf.default = {}
            }
            if (result.data.fluentCommunityTags) {
              newConf.fluentCommunityTags = result.data.fluentCommunityTags
            }
          })
        )
        setSnackbar({
          show: true,
          msg: __('FluentCRM Tags refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            'FluentCRM tags refresh failed Cause:',
            'bit-integrations'
          )}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('FluentCRM tags refresh failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, fluentCommunityTags: false })
    })
    .catch(() => setLoading({ ...loading, fluentCommunityTags: false }))
}

export const refreshfluentCommunityHeader = (
  fluentCommunityConf,
  setFluentCommunityConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  bitsFetch({}, 'fluent_crm_headers')
    .then((result) => {
      if (result && result.success) {
        if (result.data.fluentCommunityFlelds) {
          setFluentCommunityConf((prevConf) =>
            create(prevConf, (newConf) => {
              newConf.fluentCommunityFlelds = result.data.fluentCommunityFlelds
              newConf.field_map = mapNewRequiredFields(newConf)
            })
          )
          setSnackbar({
            show: true,
            msg: __('Fluent Community fields refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No Fluent Community fields found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }
      } else {
        setSnackbar({
          show: true,
          msg: __('Fluent Community fields refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const getAllCompanies = (
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, company: true })
  bitsFetch({}, 'fluent_crm_get_all_company')
    .then((result) => {
      setLoading({ ...loading, company: false })

      if (result.success && result?.data) {
        setFluentCommunityConf((prevConf) =>
          create(prevConf, (draftConf) => {
            draftConf.companies = result.data
          })
        )
        setSnackbar({ show: true, msg: __('Fluent Community Companies refreshed', 'bit-integrations') })

        return
      }

      setSnackbar({ show: true, msg: __('Fluent Community Companies refresh failed. please try again', 'bit-integrations') })
    })
}

export const mapNewRequiredFields = (fluentCommunityConf) => {
  const { field_map } = fluentCommunityConf
  const { fluentCommunityFlelds } = fluentCommunityConf
  const required = Object.values(fluentCommunityFlelds)
    .filter((f) => f.required)
    .map((f) => ({ formField: '', fluentCRMField: f.key, required: true }))
  const requiredFieldNotInFieldMap = required.filter(
    (f) => !field_map.find((m) => m.fluentCRMField === f.fluentCRMField)
  )
  const notEmptyFieldMap = field_map.filter((f) => f.fluentCRMField || f.formField)
  const newFieldMap = notEmptyFieldMap.map((f) => {
    const field = fluentCommunityFlelds[f.fluentCRMField]
    if (field) {
      return { ...f, formField: field.label }
    }
    return f
  })
  return [...requiredFieldNotInFieldMap, ...newFieldMap]
}

export const handleInput = (e, fluentCommunityConf, setFluentCommunityConf) => {
  const newConf = { ...fluentCommunityConf }
  newConf.name = e.target.value
  setFluentCommunityConf({ ...newConf })
}
export const checkMappedFields = (fluentCommunityConf) => {
  const mappedFields = fluentCommunityConf?.field_map
    ? fluentCommunityConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField && mappedField.fluentCRMField && mappedField.required
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
