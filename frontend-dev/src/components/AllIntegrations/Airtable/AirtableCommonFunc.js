/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, airtableConf, setAirtableConf) => {
  const newConf = { ...airtableConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setAirtableConf({ ...newConf })
}

export const generateMappedField = (airtableConf) => {
  const requiredFlds = airtableConf?.airtableFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', airtableFormField: field.key })) : [{ formField: '', airtableFormField: '' }]
}

export const checkMappedFields = (airtableConf) => {
  const mappedFields = airtableConf?.field_map ? airtableConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.airtableFormField || (mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const airtableAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading, type) => {
  if (!confTmp.auth_token) {
    setError({ auth_token: !confTmp.auth_token ? __('Personal access token can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})

  if (type === 'authentication') {
    setLoading({ ...loading, auth: true })
  }
  if (type === 'refreshBases') {
    setLoading({ ...loading, bases: true })
  }
  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'airtable_authentication')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setIsAuthorized(true)
        if (type === 'authentication') {
          if (result.data) {
            newConf.bases = result.data
          }
          setLoading({ ...loading, auth: false })
          toast.success(__('Authorized successfully', 'bit-integrations'))
        } else if (type === 'refreshBases') {
          if (result.data) {
            newConf.bases = result.data
          }
          setLoading({ ...loading, bases: false })
          toast.success(__('All bases fectched successfully', 'bit-integrations'))
        }
        setConf(newConf)
        return
      }
      setLoading({ ...loading, auth: false, bases: false })
      toast.error(__('Authorized failed!', 'bit-integrations'))
    })
}

export const getAllTables = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, tables: true })
  const requestParams = { auth_token: confTmp.auth_token, baseId: confTmp.selectedBase }

  bitsFetch(requestParams, 'airtable_fetch_all_tables')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.tables = result.data
        }
        setConf(newConf)
        setLoading({ ...loading, tables: false })
        toast.success(__('Tables fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, tables: false })
      toast.error(__('Tables fetching failed', 'bit-integrations'))
    })
}

export const getAllFields = (confTmp, setConf, loading, setLoading, type) => {
  if (type === 'fetch') {
    setLoading({ ...loading, customFields: true, airtableFields: false })
  } else if (type === 'refresh') {
    setLoading({ ...loading, customFields: true })
  }
  const requestParams = { auth_token: confTmp.auth_token, baseId: confTmp.selectedBase, tableId: confTmp.selectedTable }

  bitsFetch(requestParams, 'airtable_fetch_all_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.airtableFields = result.data
        }
        setConf(newConf)
        setLoading({ ...loading, customFields: false, airtableFields: true })
        toast.success(__('Table fields fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, customFields: false, airtableFields: false })
      toast.error(__('Table fields fetching failed', 'bit-integrations'))
    })
}
