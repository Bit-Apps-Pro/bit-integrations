/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (e, fabmanConf, setFabmanConf) => {
  const newConf = { ...fabmanConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setFabmanConf({ ...newConf })
}

export const generateMappedField = fabmanConf => {
  // The double exclamation mark (!!) is used to convert any value to a boolean.
  // This ensures only fields with a truthy 'required' property are included.
  const requiredFlds = fabmanConf?.staticFields.filter(fld => !!fld.required)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', fabmanFormField: field.key }))
    : [{ formField: '', fabmanFormField: '' }]
}

export const checkMappedFields = fabmanConf => {
  const rows = Array.isArray(fabmanConf?.field_map) ? fabmanConf.field_map : []
  const mappedFieldPresent = rows.filter(r => {
    const hasAnySide =
      (r?.formField && r.formField !== '') || (r?.fabmanFormField && r.fabmanFormField !== '')
    if (!hasAnySide) return false
    if (!r.formField || !r.fabmanFormField) return true
    if (r.formField === 'custom' && !r.customValue) return true
    return false
  })
  return mappedFieldPresent.length === 0
}

export const fabmanAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading,
  type
) => {
  if (!confTmp.apiKey) {
    setError({ apiKey: !confTmp.apiKey ? __("API key can't be empty", 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }

  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'fabman_authorization').then(result => {
    if (result && result.success) {
      // Use mutative's produce for state update
      const newConf = create(confTmp, draft => {
        if (type === 'authentication' && result.data && result.data.accountId) {
          draft.accountId = result.data.accountId
        }
      })
      setIsAuthorized(true)
      if (type === 'authentication') {
        setConf(newConf)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized Successfully', 'bit-integrations'))

        fetchFabmanWorkspaces(newConf, setConf, loading, setLoading, 'fetch')
      }
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(__('Authorization Failed', 'bit-integrations'))
  })
}

export const fetchFabmanWorkspaces = (confTmp, setConf, loading, setLoading, type = 'fetch') => {
  if (!confTmp.apiKey) {
    toast.error(__('API key is required to fetch workspaces', 'bit-integrations'))
    return
  }

  setLoading({ ...loading, workspaces: true })

  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'fabman_fetch_workspaces').then(result => {
    setLoading({ ...loading, workspaces: false })
    if (result && result.success) {
      // Use mutative's produce for state update
      const newConf = create(confTmp, draft => {
        if (result.data && result.data.workspaces && Array.isArray(result.data.workspaces)) {
          draft.workspaces = result.data.workspaces
          if (result.data.workspaces.length === 1) {
            draft.selectedWorkspace = result.data.workspaces[0].id
          }
        }
      })
      setConf(newConf)
      toast.success(
        type === 'refresh'
          ? __('Workspaces refreshed successfully', 'bit-integrations')
          : __('Workspaces fetched successfully', 'bit-integrations')
      )
      return
    }
    toast.error(__('Failed to fetch workspaces', 'bit-integrations'))
  })
}

export const isConfigInvalid = (fabmanConf, formField) => {
  if (!fabmanConf.actionName) return true

  if (['update_member', 'delete_member'].includes(fabmanConf.actionName)) {
    // isEmailMappingInvalid needs to be passed or imported
    if (isEmailMappingInvalid(fabmanConf, formField)) return true
    if (!checkMappedFields(fabmanConf)) return true
    return false
  }
  if (
    ['update_spaces', 'delete_spaces'].includes(fabmanConf.actionName) &&
    !fabmanConf.selectedWorkspace
  )
    return true
  if (!checkMappedFields(fabmanConf)) return true
  return false
}

export const hasEmailFieldMapped = fabmanConf => {
  return fabmanConf.field_map?.some(field => field.fabmanFormField === 'emailAddress' && field.formField)
}

export const getEmailMappingRow = fabmanConf => {
  const rows = Array.isArray(fabmanConf?.field_map) ? fabmanConf.field_map : []
  return rows.find(r => r?.fabmanFormField === 'emailAddress')
}

export const isEmailMappingInvalid = (fabmanConf, formFields, checkValidEmail) => {
  const emailRow = getEmailMappingRow(fabmanConf)
  if (!emailRow) return true
  if (emailRow.formField === 'custom') {
    const customValue = (emailRow.customValue || '').trim()
    return !customValue || !checkValidEmail(customValue)
  }
  const selectedField = (formFields || []).find(f => f.name === emailRow.formField)
  if (!selectedField) return false
  const hasEmailType = selectedField.type && String(selectedField.type).toLowerCase() === 'email'
  const looksLikeEmailField =
    /email/i.test(selectedField.name || '') || /email/i.test(selectedField.label || '')
  return !(hasEmailType || !selectedField.type || looksLikeEmailField)
}
