import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

const getSureCartAllProduct = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_sureCart_all_product', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.allProduct = result.data

      setFlow({ ...tmpFlow })
      return __('All SureCart product fetched successfully', 'bit-integrations')
    }
    return __('SureCart product fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading products...')
  })
}

export default getSureCartAllProduct
