import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getVoxelFields = (flow, setFlowData, value, edit, setFormFields) => {
  const TaskId = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const loadFields = bitsFetch({ id: value, type: 'postType', TaskId }, 'voxel/get/fields', null, 'POST').then(
    (result) => {
      if (result && result.success) {
        if (edit) {
          setFormFields(result.data)
        } else {
          setFlowData(result.data, 'fields')
        }

        return __('Fetched fields successfully', 'bit-integrations')
      }

      return __('Fields fetching failed. please try again', 'bit-integrations')
    }
  )

  toast.promise(loadFields, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading fields...')
  })
}

export const getVoxelPostTypes = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'voxel/get/post-types', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.postTypes = result.data
      tmpFlow.flow_details.selectedPostType = ''
      setFlow({ ...tmpFlow })
      return __('Fetched post types successfully', 'bit-integrations')
    }
    return __('Post types fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading post types...')
  })
}
