import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllEDDProduct = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_edd_all_product', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allProduct = result.data

      setFlow({ ...tmpFlow })
      return 'All easy digital downloads  product fetched successfully'
    }
    return 'Easy digital downloads  product fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading all product...'),
  })
}

export const getAllEDDDiscountCode = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_edd_all_discount_code', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allDiscountCode = result.data

      setFlow({ ...tmpFlow })
      return 'All easy digital downloads fetched successfully'
    }
    return 'Easy digital downloads fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading discount code...'),
  })
}

