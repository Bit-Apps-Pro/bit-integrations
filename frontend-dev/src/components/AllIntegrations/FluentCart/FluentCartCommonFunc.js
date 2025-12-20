import { create } from 'mutative'
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, fluentCartConf, setFluentCartConf) => {
  const { name, value } = e.target

  setFluentCartConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const refreshFluentCartProducts = (setFluentCartConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_fluent_cart_products')
    .then(result => {
      if (result && result?.success && result?.data?.products) {
        setFluentCartConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allProducts = result.data.products
          })
        )

        setIsLoading(false)
        toast.success(__('All products fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('FluentCart products fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const refreshFluentCartCustomers = (setFluentCartConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_fluent_cart_customers')
    .then(result => {
      if (result && result?.success && result?.data?.customers) {
        setFluentCartConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allCustomers = result.data.customers
          })
        )

        setIsLoading(false)
        toast.success(__('All customers fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('FluentCart customers fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const refreshFluentCartCoupons = (setFluentCartConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_fluent_cart_coupons')
    .then(result => {
      if (result && result?.success && result?.data?.coupons) {
        setFluentCartConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allCoupons = result.data.coupons
          })
        )

        setIsLoading(false)
        toast.success(__('All coupons fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('FluentCart coupons fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const refreshFluentCartOrderStatuses = (setFluentCartConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_fluent_cart_order_statuses')
    .then(result => {
      if (result && result?.success && result?.data?.statuses) {
        setFluentCartConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allStatuses = result.data.statuses
          })
        )

        setIsLoading(false)
        toast.success(__('All order statuses fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('FluentCart order statuses fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = fluentCartConf => {
  const mappedFields = fluentCartConf?.field_map
    ? fluentCartConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.fluentCartField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        fluentCartField: field.key
      }))
    : [{ formField: '', fluentCartField: '' }]
}
