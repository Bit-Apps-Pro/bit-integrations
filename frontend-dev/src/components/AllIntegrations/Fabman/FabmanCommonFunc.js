/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

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
  const requiredFlds = fabmanConf?.staticFields.filter(fld => !!fld.required)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', fabmanFormField: field.key }))
    : [{ formField: '', fabmanFormField: '' }]
}

export const checkMappedFields = fabmanConf => {
  const rows = Array.isArray(fabmanConf?.field_map) ? fabmanConf.field_map : []
  const invalid = rows.filter(r => {
    const hasAnySide =
      (r?.formField && r.formField !== '') || (r?.fabmanFormField && r.fabmanFormField !== '')
    if (!hasAnySide) return false
    if (!r.formField || !r.fabmanFormField) return true
    if (r.formField === 'custom' && !r.customValue) return true
    return false
  })
  return invalid.length === 0
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
      const newConf = { ...confTmp }
      setIsAuthorized(true)
      if (type === 'authentication') {
        if (result.data && result.data.accountId) {
          newConf.accountId = result.data.accountId
        }
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

  if (type === 'fetch') {
    setLoading({ ...loading, workspaces: true })
  } else if (type === 'refresh') {
    setLoading({ ...loading, workspaces: true })
  }

  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'fabman_fetch_workspaces').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }

      if (result.data && result.data.workspaces && Array.isArray(result.data.workspaces)) {
        newConf.workspaces = result.data.workspaces

        if (result.data.workspaces.length === 1) {
          newConf.selectedWorkspace = result.data.workspaces[0].id
        }
      }
      setConf(newConf)
      setLoading({ ...loading, workspaces: false })
      if (type === 'refresh') {
        toast.success(__('Workspaces refreshed successfully', 'bit-integrations'))
      } else {
        toast.success(__('Workspaces fetched successfully', 'bit-integrations'))
      }
      return
    }
    setLoading({ ...loading, workspaces: false })
    toast.error(__('Failed to fetch workspaces', 'bit-integrations'))
  })
}

export const fetchFabmanMembers = (confTmp, setConf, loading, setLoading, type = 'fetch') => {
  if (!confTmp.apiKey || !confTmp.selectedWorkspace) {
    toast.error(__('API key and workspace are required to fetch members', 'bit-integrations'))
    return
  }

  if (type === 'fetch') {
    setLoading({ ...loading, members: true })
  } else if (type === 'refresh') {
    setLoading({ ...loading, members: true })
  }

  const requestParams = {
    apiKey: confTmp.apiKey,
    workspaceId: confTmp.selectedWorkspace
  }

  bitsFetch(requestParams, 'fabman_fetch_members').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data && result.data.members && Array.isArray(result.data.members)) {
        newConf.members = result.data.members
      }
      setConf(newConf)
      setLoading({ ...loading, members: false })
      if (type === 'refresh') {
        toast.success(__('Members refreshed successfully', 'bit-integrations'))
      } else {
        toast.success(__('Members fetched successfully', 'bit-integrations'))
      }
      return
    }
    setLoading({ ...loading, members: false })
    toast.error(__('Failed to fetch members', 'bit-integrations'))
  })
}
