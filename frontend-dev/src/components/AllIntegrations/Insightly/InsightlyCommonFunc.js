/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, insightlyConf, setInsightlyConf) => {
  const newConf = { ...insightlyConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setInsightlyConf({ ...newConf })
}

export const generateMappedField = (insightlyConf) => {
  let allRequiredFields = []
  if (insightlyConf.actionName === 'organisation') {
    allRequiredFields = insightlyConf?.organisationFields
  } else if (insightlyConf.actionName === 'contact') {
    allRequiredFields = insightlyConf?.contactFields
  } else if (insightlyConf.actionName === 'opportunity') {
    allRequiredFields = insightlyConf?.opportunityFields
  } else if (insightlyConf.actionName === 'project') {
    allRequiredFields = insightlyConf?.projectFields
  } else if (insightlyConf.actionName === 'task') {
    allRequiredFields = insightlyConf?.taskFields
  } else if (insightlyConf.actionName === 'lead') {
    allRequiredFields = insightlyConf?.leadFields
  }
  const requiredFlds = allRequiredFields?.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', insightlyFormField: field.key })) : [{ formField: '', insightlyFormField: '' }]
}

export const checkMappedFields = (insightlyConf) => {
  const mappedFields = insightlyConf?.field_map ? insightlyConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.insightlyFormField || (mappedField.formField === 'custom' && !mappedField.customValue) || (mappedField.insightlyFormField === 'customFieldKey' && !mappedField.customFieldKey))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const checkRequiredFields = (insightlyConf) => {
  const leadStatus = insightlyConf?.selectedLeadSource ? insightlyConf?.selectedLeadSource : ''
  const leadSource = insightlyConf?.selectedLeadStatus ? insightlyConf?.selectedLeadStatus : ''
  if (leadStatus != '' && leadSource != '') { 
    return true;
  }
  return false;
}

export const insightlyAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.api_url || !confTmp.api_key) {
    setError({
      api_url: !confTmp.api_url ? __('API URL can\'t be empty', 'bit-integrations') : '',
      api_key: !confTmp.api_key ? __('Api Key can\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url }

  bitsFetch(requestParams, 'insightly_authentication')
    .then(result => {
      if (result && result.success) {
        setIsAuthorized(true)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid api_url name & API key', 'bit-integrations'))
    })
}

export const getAllOrganisations = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, organisations: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url }

  bitsFetch(requestParams, 'insightly_fetch_all_organisations')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.organisations = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, organisations: false })

        toast.success(__('Organisations fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, organisations: false })
      toast.error(__('Organisations fetching failed', 'bit-integrations'))
    })
}

export const getAllCategories = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, categories: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url , action_name: confTmp.actionName}

  bitsFetch(requestParams, 'insightly_fetch_all_categories')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.categories = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, categories: false })

        toast.success(__('Categories fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, categories: false })
      toast.error(__('Categories fetching failed', 'bit-integrations'))
    })
}

export const getAllStatuses = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, statuses: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url }

  bitsFetch(requestParams, 'insightly_fetch_all_statuses')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.statuses = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, statuses: false })

        toast.success(__('statuses fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, statuses: false })
      toast.error(__('statuses fetching failed', 'bit-integrations'))
    })
}

export const getLeadSources = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, LeadSources: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url }

  bitsFetch(requestParams, 'insightly_fetch_all_LeadSources')
    .then(result => {
      if (result && result.success) {

        setConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.LeadSources = result.data
          }
          return newConf
        })

        setLoading({ ...setLoading, LeadSources: false })

        toast.success(__('Lead Statuses fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, LeadSources: false })
      toast.error(__('Lead Statuses fetching failed', 'bit-integrations'))
    })
}
export const getLeadStatuses = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, LeadStatues: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url }

  bitsFetch(requestParams, 'insightly_fetch_all_LeadStatuses')
    .then(result => {
      if (result && result.success) {

        setConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.LeadStatuses = result.data
          }
          return newConf
        })
        
        setLoading({ ...setLoading, LeadStatuses: false })

        toast.success(__('Lead Statuses fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, LeadStatuses: false })
      toast.error(__('Lead Statuses fetching failed', 'bit-integrations'))
    })
}

export const getAllCRMPipelines = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, CRMPipelines: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url ,action_name :confTmp.actionName  }

  bitsFetch(requestParams, 'insightly_fetch_all_CRMPipelines')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.CRMPipelines = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, CRMPipelines: false })

        toast.success(__('Pipelines fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, CRMPipelines: false })
      toast.error(__('Pipelines fetching failed', 'bit-integrations'))
    })
}

export const getAllCRMPipelineStages = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, CRMPipelineStages: true })

  const requestParams = { api_key: confTmp.api_key, api_url: confTmp.api_url, selectedCRMPipeline: confTmp.selectedCRMPipeline }

  bitsFetch(requestParams, 'insightly_fetch_all_CRMPipelineStages')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.CRMPipelineStages = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, CRMPipelineStages: false })

        toast.success(__('Pipeline stages fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, CRMPipelineStages: false })
      toast.error(__('Pipeline stages fetching failed', 'bit-integrations'))
    })
}
