/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (
  e,
  freshSalesConf,
  setFreshSalesConf,
  formID,
  setIsLoading,
  setSnackbar,
  isNew,
  error,
  setError
) => {
  const inputName = e.target.name
  const inputValue = e.target.value

  if (isNew) {
    const rmError = { ...error }
    rmError[inputName] = ''
    setError({ ...rmError })
  }

  setFreshSalesConf(prevConf =>
    create(prevConf, draftConf => {
      if (inputValue === '') {
        delete draftConf.moduleData[inputName]
        return
      }

      if (inputName !== 'module') {
        draftConf.moduleData[inputName] = parseInt(inputValue)
      } else {
        draftConf.moduleData = {}
        draftConf.moduleData[inputName] = inputValue
      }
    })
  )

  switch (inputName) {
    case 'module':
      moduleChange(inputValue, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      break
    case 'contact_view_id':
      contactViewChange(inputValue, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      break
    case 'account_view_id':
      accountViewChange(inputValue, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
}

const moduleChange = (module, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar) => {
  setFreshSalesConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf.actions = {}
      draftConf.field_map = [{ formField: '', freshSalesFormField: '' }]

      if (['Contact'].includes(module)) {
        accountRefreshViews(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      }
      if (['Deal'].includes(module)) {
        contactRefreshViews(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      }
      if (module) {
        refreshFields(module, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
      }
    })
  )
}

const accountViewChange = (
  accountViewId,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const module = freshSalesConf.moduleData.module

  if (['Deal', 'Contact'].includes(module)) {
    refreshAccounts(accountViewId, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
  }

  if (['Deal', 'Contact'].includes(module) && !freshSalesConf.default.modules[module]?.fields) {
    refreshFields(module, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
  }
}

const contactViewChange = (
  contactViewId,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const module = freshSalesConf.moduleData.module

  if (['Deal'].includes(module)) {
    refreshContacts(contactViewId, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
  }

  if (['Deal'].includes(module) && !freshSalesConf.default.modules[module]?.fields) {
    refreshFields(module, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
  }
}

const refreshFields = (module, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'FreshSales_refresh_fields').then(result => {
    setIsLoading(false)

    if (!result || !result.success) {
      setSnackbar({
        show: false,
        msg: __('Fields refresh failed. please try again', 'bit-integrations')
      })
      return
    }

    setFreshSalesConf(prevConf =>
      create(prevConf, draftConf => {
        if (!draftConf.default.modules[module].fields) {
          draftConf.default.modules[module].fields = []
        }

        draftConf.default.modules[module].fields = result?.data || []
        draftConf.field_map = generateMappedField(draftConf)

        setSnackbar({ show: true, msg: __('Fields refreshed', 'bit-integrations') })
      })
    )
  })
}

export const accountRefreshViews = (freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: 'filters',
    type: 'sales_accounts'
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'FreshSales_fetch_meta_data')
    .then(result => {
      setIsLoading(false)

      if (!result || !result.success) {
        setSnackbar({
          show: false,
          msg: __('Account views refresh failed. please try again', 'bit-integrations')
        })
        return
      }

      setFreshSalesConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf.default.accountViews = result.data || []
        })
      )
    })
    .catch(() => setIsLoading(false))
}

export const contactRefreshViews = (freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: 'filters',
    type: 'contacts'
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'FreshSales_fetch_meta_data')
    .then(result => {
      setIsLoading(false)

      if (!result || !result.success) {
        setSnackbar({
          show: false,
          msg: __('Contact views refresh failed. please try again', 'bit-integrations')
        })
        return
      }

      setFreshSalesConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf.default.contactViews = result.data || []
        })
      )
    })
    .catch(() => setIsLoading(false))
}

export const refreshAccounts = (
  accountViewId,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    account_view_id: accountViewId,
    contact_view_id: freshSalesConf.moduleData.contact_view_id,
    module: 'sales_accounts'
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'FreshSales_fetch_meta_data')
    .then(result => {
      setIsLoading(false)

      if (!result || !result.success) {
        setSnackbar({
          show: false,
          msg: __('Accounts refresh failed. please try again', 'bit-integrations')
        })
        return
      }

      setFreshSalesConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf.default.accounts = result.data || []
        })
      )
    })
    .catch(() => setIsLoading(false))
}

export const refreshContacts = (
  contactViewId,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    contact_view_id: contactViewId,
    account_view_id: freshSalesConf.moduleData.account_view_id,
    module: 'contacts'
  }

  setIsLoading(true)
  bitsFetch(requestParams, 'FreshSales_fetch_meta_data')
    .then(result => {
      setIsLoading(false)

      if (!result || !result.success) {
        setSnackbar({
          show: false,
          msg: __('Contacts refresh failed. please try again', 'bit-integrations')
        })
        return
      }

      setFreshSalesConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf.default.contacts = result.data || []
        })
      )
    })
    .catch(() => setIsLoading(false))
}

const generateMappedField = freshSalesConf => {
  const module = freshSalesConf.moduleData.module

  const requiredFlds = freshSalesConf?.default?.modules?.[module]?.fields?.filter(
    fld => fld.required === true
  )
  return requiredFlds?.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        freshSalesFormField: field.key
      }))
    : [{ formField: '', freshSalesFormField: '' }]
}

export const checkMappedFields = freshSalesConf => {
  const mappedFields = freshSalesConf?.field_map
    ? freshSalesConf.field_map.filter(
        mappedField =>
          !mappedField.formField &&
          mappedField.freshSalesFormField &&
          freshSalesConf?.default?.modules?.[freshSalesConf.moduleData.module]?.requiredFields?.indexOf(
            mappedField.freshSalesFormField
          ) !== -1
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

export const checkRequired = freshSalesConf => {
  if (
    freshSalesConf.moduleData?.module !== '' &&
    freshSalesConf.default.modules?.[freshSalesConf?.moduleData?.module]?.required
  ) {
    if (
      ['Leads', 'Deal', 'Activities', 'Notes'].includes(freshSalesConf.moduleData.module) &&
      freshSalesConf.moduleData.account_id === undefined &&
      freshSalesConf.moduleData?.contact_id === undefined
    ) {
      return false
    }

    if (
      freshSalesConf.moduleData.module === 'Contacts' &&
      freshSalesConf.moduleData.account_id === undefined
    ) {
      return false
    }
  }
  return true
}

export const handleAuthorize = (confTmp, setError, setisAuthorized, setIsLoading) => {
  if (!confTmp.bundle_alias || !confTmp.api_key) {
    setError({
      bundle_alias: !confTmp.bundle_alias
        ? __("Bundle Alias (Account URL) can't be empty", 'bit-integrations')
        : '',
      api_key: !confTmp.api_key ? __("API Key can't be empty", 'bit-integrations') : ''
    })
    return
  }
  setError({})
  setIsLoading(true)
  const requestParams = {
    api_key: confTmp.api_key,
    bundle_alias: confTmp.bundle_alias,
    module: 'filters'
  }

  bitsFetch(requestParams, 'FreshSales_authorization').then(result => {
    if (result && result.success) {
      setisAuthorized(true)
      setIsLoading(false)
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }
    setIsLoading(false)
    toast.error(__('Authorized failed', 'bit-integrations'))
  })
}
