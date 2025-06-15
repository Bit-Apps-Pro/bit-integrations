/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import toast from 'react-hot-toast'
import { sprintf, __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, hubspotConf, setHubspotConf, setIsLoading) => {
  const newConf = { ...hubspotConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setHubspotConf({ ...newConf })
}

export const checkMappedFields = (hubspotConf) => {
  const mappedFields = hubspotConf?.field_map ? hubspotConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.hubspotField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []

  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (hubspotConf) => {
  const requiredFlds = hubspotConf?.hubSpotFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', hubspotField: field.key })) : [{ formField: '', hubspotField: '' }]
}

export const hubspotAuthorization = (confTmp, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.api_key) {
    setError({ api_key: !confTmp.api_key ? __('Access token can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = { api_key: confTmp.api_key }

  bitsFetch(requestParams, 'hubSpot_authorization')
    .then(result => {
      if (result && result.success) {
        setIsAuthorized(true)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid access token', 'bit-integrations'))
    })
}

export const getAllPipelines = (confTmp, setConf, setLoading, type, loading) => {
  setLoading({ ...setLoading, pipelines: true })
  const requestParams = { api_key: confTmp.api_key, type }

  bitsFetch(requestParams, 'hubspot_pipeline')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          if (!newConf.default) newConf.default = {}
          newConf.default.pipelines = result.data
          newConf.actionName = type
          getFields(newConf, setConf, setLoading, type, loading)
        }
        setConf(newConf)
        setLoading({ ...setLoading, pipelines: false })

        toast.success(__('pipelines fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, pipelines: false })
      toast.error(__('pipelines fetching failed', 'bit-integrations'))
    })
}

export const getAllOwners = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, owners: true, hubSpotFields: true })
  const requestParams = { api_key: confTmp.api_key }

  bitsFetch(requestParams, 'hubspot_owners')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          if (!newConf.default) newConf.default = {}
          newConf.default.owners = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, owners: false, hubSpotFields: true })

        toast.success(__('owners fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, owners: false, hubSpotFields: true })
      toast.error(__('owners fetching failed', 'bit-integrations'))
    })
}

export const getAllContacts = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, contacts: true, hubSpotFields: true })
  const requestParams = { api_key: confTmp.api_key }

  bitsFetch(requestParams, 'hubspot_contacts')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          if (!newConf.default) newConf.default = {}
          newConf.default.contacts = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, contacts: false, hubSpotFields: true })

        toast.success(__('contacts fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, contacts: false, hubSpotFields: true })
      toast.error(__('contacts fetching failed', 'bit-integrations'))
    })
}

export const getAllCompany = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companies: true, hubSpotFields: true })
  const requestParams = { api_key: confTmp.api_key }

  bitsFetch(requestParams, 'hubspot_company')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          if (!newConf.default) newConf.default = {}
          newConf.default.companies = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, companies: false, hubSpotFields: true })

        toast.success(__('companies fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, companies: false, hubSpotFields: true })
      toast.error(__('companies fetching failed', 'bit-integrations'))
    })
}

export const getFields = (confTmp, setConf, setLoading, type, loading, refreshCustomFields = false) => {
  if (refreshCustomFields) {
    setLoading({ ...loading, customFieldsRefresh: true })
  } else {
    setLoading({ ...setLoading, customFields: true })
  }
  const requestParams = { api_key: confTmp.api_key, type }

  bitsFetch(requestParams, 'getFields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.hubSpotFields = result.data
          newConf.actionName = type
        }
        setConf(newConf)
        setLoading({ ...setLoading, customFields: false })
        setLoading({ ...setLoading, hubSpotFields: true })

        toast.success(__('Fields fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, customFields: false })
      toast.error(__('Fields fetching failed', 'bit-integrations'))
    })
}
