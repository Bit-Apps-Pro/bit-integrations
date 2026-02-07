import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { create } from 'mutative'
import { actionFields, memberRoles } from './staticData'

export const refreshCommunityList = (
  formID,
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCommunityList: true })
  bitsFetch({}, 'refresh_fluent_community_lists')
    .then(result => {
      if (result && result.success) {
        setFluentCommunityConf(prevConf =>
          create(prevConf, newConf => {
            newConf.fluentCommunityList = result.data.fluentCommunityList
          })
        )
        setSnackbar({
          show: true,
          msg: __('FluentCommunity spaces refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            'FluentCommunity spaces refresh failed Cause:',
            'bit-integrations'
          )}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('FluentCommunity spaces refresh failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, fluentCommunityList: false })
    })
    .catch(() => setLoading({ ...loading, fluentCommunityList: false }))
}

export const refreshFluentCommunityHeader = (
  fluentCommunityConf,
  setFluentCommunityConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)

  // Get fields from static data based on action
  const actionName = fluentCommunityConf?.actionName || ''
  const fields = actionFields[actionName] || []

  if (fields.length > 0) {
    // Convert static data to the format expected by the UI
    const fluentCommunityFields = {}
    fields.forEach(field => {
      fluentCommunityFields[field.key] = {
        key: field.key,
        label: field.label,
        type: 'primary',
        required: field.required
      }
    })

    setFluentCommunityConf(prevConf =>
      create(prevConf, newConf => {
        newConf.fluentCommunityFields = fluentCommunityFields
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
      msg: __('No Fluent Community fields found for this action', 'bit-integrations')
    })
  }

  setIsLoading(false)
}

export const refreshMemberRoles = (
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, memberRoles: true })

  // Use static member roles data
  setFluentCommunityConf(prevConf =>
    create(prevConf, newConf => {
      newConf.memberRoles = memberRoles
    })
  )

  setSnackbar({
    show: true,
    msg: __('FluentCommunity member roles refreshed', 'bit-integrations')
  })

  setLoading({ ...loading, memberRoles: false })
}

export const refreshCourseList = (
  formID,
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCommunityCourses: true })
  bitsFetch({}, 'refresh_fluent_community_courses')
    .then(result => {
      if (result && result.success) {
        setFluentCommunityConf(prevConf =>
          create(prevConf, newConf => {
            newConf.fluentCommunityCourses = result.data.fluentCommunityCourses
          })
        )
        setSnackbar({
          show: true,
          msg: __('FluentCommunity courses refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            'FluentCommunity courses refresh failed Cause:',
            'bit-integrations'
          )}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('FluentCommunity courses refresh failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, fluentCommunityCourses: false })
    })
    .catch(() => setLoading({ ...loading, fluentCommunityCourses: false }))
}

export const refreshUserList = (
  formID,
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCommunityUsers: true })
  bitsFetch({}, 'refresh_fluent_community_users')
    .then(result => {
      if (result && result.success) {
        setFluentCommunityConf(prevConf =>
          create(prevConf, newConf => {
            newConf.fluentCommunityUsers = result.data.fluentCommunityUsers
          })
        )
        setSnackbar({
          show: true,
          msg: __('FluentCommunity users refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            'FluentCommunity users refresh failed Cause:',
            'bit-integrations'
          )}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('FluentCommunity users refresh failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, fluentCommunityUsers: false })
    })
    .catch(() => setLoading({ ...loading, fluentCommunityUsers: false }))
}

export const getAllCompanies = (
  fluentCommunityConf,
  setFluentCommunityConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, company: true })
  bitsFetch({}, 'fluent_community_get_all_company').then(result => {
    setLoading({ ...loading, company: false })

    if (result.success && result?.data) {
      setFluentCommunityConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf.companies = result.data
        })
      )
      setSnackbar({ show: true, msg: __('Fluent Community Companies refreshed', 'bit-integrations') })

      return
    }

    setSnackbar({
      show: true,
      msg: __('Fluent Community Companies refresh failed. please try again', 'bit-integrations')
    })
  })
}

export const mapNewRequiredFields = fluentCommunityConf => {
  const { field_map } = fluentCommunityConf
  const { fluentCommunityFields } = fluentCommunityConf
  const required = Object.values(fluentCommunityFields)
    .filter(f => f.required)
    .map(f => ({ formField: '', fluentCommunityField: f.key, required: true }))
  const requiredFieldNotInFieldMap = required.filter(
    f => !field_map.find(m => m.fluentCommunityField === f.fluentCommunityField)
  )
  const notEmptyFieldMap = field_map.filter(f => f.fluentCommunityField || f.formField)
  const newFieldMap = notEmptyFieldMap.map(f => {
    const field = fluentCommunityFields[f.fluentCommunityField]
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
export const checkMappedFields = fluentCommunityConf => {
  const mappedFields = fluentCommunityConf?.field_map
    ? fluentCommunityConf.field_map.filter(
        mappedField => !mappedField.formField && mappedField.fluentCommunityField && mappedField.required
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
