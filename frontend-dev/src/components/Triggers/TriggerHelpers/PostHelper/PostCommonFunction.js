import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllPostType = (data, setFlow) => {
  const loadPostTypes = bitsFetch(
    null,
    'get_all_post_Types',
    null,
    'GET',
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.types = result.data
      setFlow({ ...tmpFlow })
      return 'Fetched post type successfully'
    }
    return 'Post type fetching failed. please try again'
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Post type...'),
  })
}

export const getAllPostPosts = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    'get_all_post_posts',
    null,
    'GET',
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.posts = result.data
      setFlow({ ...tmpFlow })
      return 'Fetched posts successfully'
    }
    return 'Posts fetching failed. please try again'
  })
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading posts...'),
  })
}
