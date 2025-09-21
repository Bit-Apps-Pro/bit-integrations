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

  setLoading({ ...loading, workspaces: true })

  const requestParams = { apiKey: confTmp.apiKey }

  bitsFetch(requestParams, 'fabman_fetch_workspaces').then(result => {
    setLoading({ ...loading, workspaces: false })
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data && result.data.workspaces && Array.isArray(result.data.workspaces)) {
        newConf.workspaces = result.data.workspaces
        if (result.data.workspaces.length === 1) {
          newConf.selectedWorkspace = result.data.workspaces[0].id
        }
      }
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

export const fetchMemberByEmail = (confTmp, setConf, loading, setLoading, type = 'fetch') => {
  if (!confTmp.apiKey) {
    toast.error(__('API key is required to fetch member by email', 'bit-integrations'))
    return
  }

  let email = null
  if (Array.isArray(confTmp.field_map)) {
    const emailField = confTmp.field_map.find(field => field.fabmanFormField === 'emailAddress')
    if (emailField) {
      if (emailField.formField === 'custom' && emailField.customValue) {
        email = emailField.customValue
      } else if (emailField.formField && emailField.formField !== 'custom') {
        email = emailField.formField
      }
    }
  }

  if (!email) {
    toast.error(__('Email field not found in field map', 'bit-integrations'))
    return
  }

  setLoading({ ...loading, members: true })

  const requestParams = {
    apiKey: confTmp.apiKey,
    email: email
  }

  bitsFetch(requestParams, 'fabman_fetch_member_by_email')
    .then(result => {
      setLoading({ ...loading, members: false })
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data.memberId) {
          newConf.selectedMember = result.data.memberId
        }
        if (result.data.lockVersion) {
          newConf.selectedLockVersion = result.data.lockVersion
        }
        setConf(newConf)
        toast.success(
          type === 'refresh'
            ? __('Member found and selected successfully', 'bit-integrations')
            : __('Member found and selected successfully', 'bit-integrations')
        )
        return
      }
      toast.error(__('Failed to fetch member by email', 'bit-integrations'))
    })
    .catch(error => {
      setLoading({ ...loading, members: false })
      toast.error(__('Failed to fetch member by email', 'bit-integrations'))
    })
}
