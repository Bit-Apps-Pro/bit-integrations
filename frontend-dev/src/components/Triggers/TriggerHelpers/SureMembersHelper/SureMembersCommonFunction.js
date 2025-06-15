import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getSureMembersGroups = (data, setFlow) => {
  const loadGroups = bitsFetch({}, 'suremembers/get/groups', null, 'POST').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      const anyGroup = [{ id: 'any', title: 'Any' }]
      const groups = result.data
      let finalGroups
      if (tmpFlow.triggered_entity_id === 'sureMembers-3') {
        finalGroups = anyGroup.concat(groups)
      } else {
        finalGroups = groups
      }
      tmpFlow.flow_details.groups = finalGroups
      setFlow({ ...tmpFlow })
      return __('Groups fetched successfully', 'bit-integrations')
    }
    return __('Groups fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadGroups, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Groups...')
  })
}
