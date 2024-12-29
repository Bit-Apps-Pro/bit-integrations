/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, salesmateConf, setSalesmateConf) => {
  const newConf = { ...salesmateConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSalesmateConf({ ...newConf })
}

export const generateMappedField = (smartSuiteFields) => {
  const requiredFlds = smartSuiteFields?.filter((fld) => fld.required === true)

  return requiredFlds?.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      smartSuiteFormField: field.key
    }))
    : [{ formField: '', smartSuiteFormField: '' }]
}

export const checkMappedFields = (smartSuiteConf) => {
  const mappedFields = smartSuiteConf?.field_map
    ? smartSuiteConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.smartSuiteFormField ||
        (mappedField.formField === 'custom' && !mappedField.customValue) ||
        (mappedField.smartSuiteFormField === 'customFieldKey' && !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const smartSuiteAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.workspaceId || !confTmp.apiToken) {
    setError({
      workspaceId: !confTmp.workspaceId ? __("Workspace ID can't be empty", 'bit-integrations') : '',
      apiToken: !confTmp.apiToken ? __("API Token can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    workspaceId: confTmp.workspaceId,
    apiToken: confTmp.apiToken
  }

  bitsFetch(requestParams, 'smartSuite_authentication').then((result) => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      __('Authorized failed, ' + result.data, 'bit-integrations')
    )
  })
}

export const getAllSolutions = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, solution: true })

  if (confTmp?.selectedSolution)
    delete confTmp?.selectedSolution

  const requestParams = {
    workspaceId: confTmp.workspaceId,
    apiToken: confTmp.apiToken
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_solutions').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.solutions = result.data
          return prevConf
        })

        setLoading({ ...setLoading, solution: false })
        toast.success(__('Solution fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, solution: false })
      toast.error(__('Solution Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, solution: false })
    toast.error(__('Solution fetching failed', 'bit-integrations'))
  })
}

export const getAllTables = (confTmp, setConf, solution_id, setLoading) => {

  if (confTmp?.selectedTable)
    delete confTmp?.selectedTable

  setLoading({ ...setLoading, table: true })
  const requestParams = {
    workspaceId: confTmp.workspaceId,
    apiToken: confTmp.apiToken,
    solution_id: solution_id
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_tables').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.tables = result.data
          return prevConf
        })

        setLoading({ ...setLoading, table: false })
        toast.success(__('Table fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, table: false })
      toast.error(__('Table Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, table: false })
    toast.error(__('Table fetching failed', 'bit-integrations'))
  })
}

export const getAllUser = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, assignedUser: true })

  const requestParams = {
    workspaceId: confTmp.workspaceId,
    apiToken: confTmp.apiToken
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_user').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.assignedUser = result.data
          return prevConf
        })

        setLoading({ ...setLoading, solution: false })
        toast.success(__('User fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, solution: false })
      toast.error(__('User Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, solution: false })
    toast.error(__('User fetching failed', 'bit-integrations'))
  })
}

