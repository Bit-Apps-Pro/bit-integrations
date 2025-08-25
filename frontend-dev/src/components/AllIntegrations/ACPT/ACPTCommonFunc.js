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

export const generateMappedField = acptFields => {
  const requiredFlds = acptFields.filter(fld => fld?.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        acptFormField: field.key
      }))
    : [{ formField: '', acptFormField: '' }]
}

export const checkMappedFields = acptConf => {
  const mappedFields = acptConf?.field_map
    ? acptConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.acptFormField ||
          (mappedField.formField === 'custom' && !mappedField.customValue) ||
          (mappedField.acptFormField === 'customFieldKey' && !mappedField.customFieldKey)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const acptAuthentication = (confTmp, setConf, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.api_key || !confTmp.base_url) {
    setError({
      base_url: !confTmp.base_url ? __("Homepage URL can't be empty", 'bit-integrations') : '',
      api_key: !confTmp.api_key ? __("Api Key-Secret can't be empty", 'bit-integrations') : ''
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key
  }

  bitsFetch(requestParams, 'acpt_authentication').then(result => {
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
        : __('Authorized failed, Please enter valid Api Key-Secret', 'bit-integrations')
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

  bitsFetch(requestParams, 'acpt_fetch_all_customer').then(result => {
    if (result && result.success) {
      if (result.data) {
        setConf(prevConf => {
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

  bitsFetch(requestParams, 'acpt_fetch_all_product').then(result => {
    if (result && result.success) {
      if (result.data) {
        setConf(prevConf => {
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

  bitsFetch(requestParams, 'acpt_fetch_all_order').then(result => {
    if (result && result.success) {
      if (result.data) {
        setConf(prevConf => {
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

export const getAllLicense = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, license: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'acpt_fetch_all_license').then(result => {
    if (result && result.success) {
      if (result.data) {
        setConf(prevConf => {
          prevConf.licenses = result.data
          return prevConf
        })

        setLoading({ ...setLoading, license: false })
        toast.success(__('License fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, license: false })
      toast.error(__('License Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, license: false })
    toast.error(__('License fetching failed', 'bit-integrations'))
  })
}

export const getAllGenerator = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, generator: true })

  const requestParams = {
    base_url: confTmp.base_url,
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret
  }

  bitsFetch(requestParams, 'acpt_fetch_all_generator').then(result => {
    if (result && result.success) {
      if (result.data) {
        setConf(prevConf => {
          prevConf.generators = result.data
          return prevConf
        })

        setLoading({ ...setLoading, generator: false })
        toast.success(__('Generator fetched successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, generator: false })
      toast.error(__('Generator Not Found!', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, generator: false })
    toast.error(__('Generator fetching failed', 'bit-integrations'))
  })
}
