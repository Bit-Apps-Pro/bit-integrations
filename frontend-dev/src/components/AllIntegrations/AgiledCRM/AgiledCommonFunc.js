/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, agiledConf, setAgiledConf) => {
  const newConf = { ...agiledConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setAgiledConf({ ...newConf })
}

export const generateMappedField = (agiledConf) => {
  let allRequiredFields = []
  if (agiledConf.actionName === 'account') {
    allRequiredFields = agiledConf?.accountFields
  } else if (agiledConf.actionName === 'contact') {
    allRequiredFields = agiledConf?.contactFields
  } else {
    allRequiredFields = agiledConf?.dealFields
  }
  const requiredFlds = allRequiredFields?.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', agiledFormField: field.key })) : [{ formField: '', agiledFormField: '' }]
}

export const checkMappedFields = (agiledConf) => {
  const mappedFields = agiledConf?.field_map ? agiledConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.agiledFormField || (mappedField.formField === 'custom' && !mappedField.customValue) || (mappedField.agiledFormField === 'customFieldKey' && !mappedField.customFieldKey))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const agiledAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.brand || !confTmp.auth_token) {
    setError({
      brand: !confTmp.brand ? __('Brand Name (Account URL) can\'t be empty', 'bit-integrations') : '',
      auth_token: !confTmp.auth_token ? __('Api Key can\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_authentication')
    .then(result => {
      if (result && result.success) {
        setIsAuthorized(true)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed, Please enter valid brand name & API key', 'bit-integrations'))
    })
}

export const getAllOwners = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, owners: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_owners')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.owners = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, owners: false })

        toast.success(__('Owners fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, owners: false })
      toast.error(__('Owners fetching failed', 'bit-integrations'))
    })
}

export const getAllAccounts = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, accounts: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_accounts')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.accounts = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, accounts: false })

        toast.success(__('Accounts fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, accounts: false })
      toast.error(__('Accounts fetching failed', 'bit-integrations'))
    })
}

export const getAllSources = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, sources: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_sources')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.sources = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, sources: false })

        toast.success(__('Sources fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, sources: false })
      toast.error(__('Sources fetching failed', 'bit-integrations'))
    })
}

export const getAllStatuses = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, statuses: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_statuses')
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

export const getAllLifeCycleStage = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, lifeCycleStages: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_lifeCycleStages')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.lifeCycleStages = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, lifeCycleStages: false })

        toast.success(__('Life cycle stages fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, lifeCycleStages: false })
      toast.error(__('Life cycle stages fetching failed', 'bit-integrations'))
    })
}

export const getAllCRMPipelines = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, CRMPipelines: true })

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand }

  bitsFetch(requestParams, 'agiled_fetch_all_CRMPipelines')
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

  const requestParams = { auth_token: confTmp.auth_token, brand: confTmp.brand, selectedCRMPipeline: confTmp.selectedCRMPipeline }

  bitsFetch(requestParams, 'agiled_fetch_all_CRMPipelineStages')
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
