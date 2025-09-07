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
  const mappedFields = fabmanConf?.field_map
    ? fabmanConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.fabmanFormField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
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
        if (result.data) {
          newConf.customFields = result.data

          if (result.data && result.data.length > 0) {
            newConf.accountId = result.data[0].id
          }
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
      // Fix: Check for result.data.workspaces instead of result.data
      if (result.data && result.data.workspaces && Array.isArray(result.data.workspaces)) {
        newConf.workspaces = result.data.workspaces
        // Auto-select if only one workspace
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
