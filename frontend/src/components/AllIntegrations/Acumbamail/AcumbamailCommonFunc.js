import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar, formID) => {
  let newConf = { ...acumbamailConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }

  newConf[e.target.name] = e.target.value
  switch (e.target.name) {
    case 'listId':
      if (newConf.listId && !newConf.default?.allFields?.[newConf.listId]) {
        newConf = refreshFields(formID, newConf, setAcumbamailConf, setIsLoading, setSnackbar)
      }
      break
    default:
      break
  }
  setAcumbamailConf({ ...newConf })
}

export const refreshFields = (formID, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar) => {
  const { listId } = acumbamailConf
  if (!listId) {
    return
  }
  setIsLoading(true)
  const refreshFieldsRequestParams = { auth_token: acumbamailConf.auth_token, list_id: listId }
  bitsFetch(refreshFieldsRequestParams, 'acumbamail_refresh_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...acumbamailConf }
        if (result.data) {
          if (!newConf.default?.allFields) {
            newConf.default.allFields = {}
          }
          if (!newConf.default.allFields?.[listId]) {
            newConf.default.allFields[listId] = {}
          }
          newConf.default.allFields[listId].fields = result.data
          newConf.default.allFields[listId].required = ['EMAIL']

          setAcumbamailConf({ ...newConf })
          setIsLoading(false)
          toast.success(__('All list field fetched successfully', 'bit-integrations'))
          return
        }
        setIsLoading(false)
        toast.error(__('Failed to fetch list fields', 'bit-integrations'))
      }
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllList = (acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { auth_token: acumbamailConf.auth_token }

  bitsFetch(requestParams, 'acumbamail_fetch_all_list')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...acumbamailConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allLists = result.data
        }
        setAcumbamailConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Lists fetched successfully.', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Lists fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.auth_token) {
    setError({
      auth_token: !confTmp.auth_token ? __("Api Key can't be empty", 'bit-integrations') : ''
    })
    return
  }
  setError({})
  setIsLoading(true)

  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'acumbamail_authorization_and_fetch_subscriber_list').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      setConf(newConf)
      setisAuthorized(true)
      setIsLoading(false)
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }
    setIsLoading(false)
    toast.error(__(result.data, 'bit-integrations'))
  })
}

export const checkMappedFields = acumbamailConf => {
  const mappedFields = acumbamailConf?.field_map
    ? acumbamailConf.field_map.filter(
        mappedField =>
          !mappedField.formField &&
          mappedField.acumbamailFormField &&
          acumbamailConf?.default?.allFields?.[acumbamailConf.listId]?.required.indexOf(
            mappedField.acumbamailFormField
          ) !== -1
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}
