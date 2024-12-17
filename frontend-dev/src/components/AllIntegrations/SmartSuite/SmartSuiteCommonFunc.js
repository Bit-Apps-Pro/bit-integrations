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
  const requiredFlds = smartSuiteFields.filter((fld) => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: '',
      smartSuiteFormField: field.key
    }))
    : [{ formField: '', smartSuiteFormField: '' }]
}
export const getCustomFields = (confTmp, setConf, setIsLoading, val = '') => {
  setIsLoading(true)
  console.error('time')
  console.error(confTmp.selectedTable)
  let tempVal = (val == '' ? confTmp.selectedTable : val)
  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
    solution_id: tempVal
  }

  bitsFetch(requestParams, 'smartSuite_fetch_custom_fields').then((result) => {
    if (result && result.success) {
      setIsLoading(false)
      if (result.data) {
        setConf((prevConf) => {
          const newConf = { ...prevConf }
          newConf.customFields = result.data
          return newConf
        })
        toast.success(__('Custom fields also fetched successfully', 'bit-integrations'))
      } else {
        toast.error(__('No custom fields found', 'bit-integrations'))
      }
      return
    }
    setIsLoading(false)
    toast.error(__(`Custom fields fetching failed ${result.data}`, 'bit-integrations'))
  })
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
  if (!confTmp.api_key || !confTmp.api_secret) {
    setError({
      api_key: !confTmp.api_key ? __("Workspace ID can't be empty", 'bit-integrations') : '',
      api_secret: !confTmp.api_secret ? __("API Token can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
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

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
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
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
    solution_id: solution_id
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_tables').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.tables = result.data
          console.error('check it error')
          console.error(result.data[0].customFields)
          if (result.data.length > 0 && result.data[0].customFields)
            prevConf.customFields = result.data[0].customFields;
          else
            prevConf.customFields = null
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
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'smartSuite_fetch_all_user').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.assignedUser = result.data
          console.error('show user')
          console.error(result.data)
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
