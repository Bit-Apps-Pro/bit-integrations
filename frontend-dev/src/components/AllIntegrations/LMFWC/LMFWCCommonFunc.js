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

export const generateMappedField = (lmfwcFields) => {
  const requiredFlds = lmfwcFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: '',
        lmfwcFormField: field.key
      }))
    : [{ formField: '', lmfwcFormField: '' }]
}

export const checkMappedFields = (licenseManagerConf) => {
  const mappedFields = licenseManagerConf?.field_map
    ? licenseManagerConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.lmfwcFormField ||
          (mappedField.formField === 'custom' && !mappedField.customValue) ||
          (mappedField.lmfwcFormField === 'customFieldKey' && !mappedField.customFieldKey)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const lmfwcAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key || !confTmp.api_secret) {
    setError({
      base_url: !confTmp.base_url ? __("Consumer key can't be empty", 'bit-integrations') : '',
      api_key: !confTmp.api_key ? __("Consumer key can't be empty", 'bit-integrations') : '',
      api_secret: !confTmp.api_secret ? __("Consumer secret can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'lmfwc_authentication').then((result) => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      result?.data && typeof result.data === 'string'
        ? result.data
        : __('Authorized failed, Please enter valid Consumer key & Consumer secret', 'bit-integrations')
    )
  })
}

export const getAllCustomer = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, customer: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'lmfwc_fetch_all_customer').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.customers = result.data
          return prevConf
        })

        setLoading({ ...setLoading, customer: false })
        toast.success(__('Customers fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, customer: false })
      toast.error(__('Customers Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, customer: false })
    toast.error(__('Customers fetching failed', 'bit-integrations'))
  })
}

export const getAllProduct = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, product: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'lmfwc_fetch_all_product').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.products = result.data
          return prevConf
        })

        setLoading({ ...setLoading, product: false })
        toast.success(__('Product fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, product: false })
      toast.error(__('Product Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, product: false })
    toast.error(__('Product fetching failed', 'bit-integrations'))
  })
}

export const getAllOrder = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, order: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'lmfwc_fetch_all_order').then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.orders = result.data
          return prevConf
        })

        setLoading({ ...setLoading, order: false })
        toast.success(__('Order fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, order: false })
      toast.error(__('Order Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, order: false })
    toast.error(__('Order fetching failed', 'bit-integrations'))
  })
}
