import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getWPForoForums = (data, setFlow) => {
  const loadForum = bitsFetch(null, 'wpforo/get/forums', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.forums = result.data
      setFlow({ ...tmpFlow })
      return __('Forums fetched successfully', 'bit-integrations')
    }
    return __('Forums fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadForum, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Forums...')
  })
}

export const getWPForoTopics = (data, setFlow) => {
  const loadForum = bitsFetch(null, 'wpforo/get/topics', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.topics = result.data
      setFlow({ ...tmpFlow })
      return __('Topics fetched successfully', 'bit-integrations')
    }
    return __('Topics fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadForum, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Topics...')
  })
}

export const getWPForoUsers = (data, setFlow) => {
  const loadForum = bitsFetch(null, 'wpforo/get/users', null, 'GET').then((result) => {
    if (result && result.data) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.users = result.data
      setFlow({ ...tmpFlow })
      return __('Users fetched successfully', 'bit-integrations')
    }
    return __('Users fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadForum, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Users...')
  })
}
