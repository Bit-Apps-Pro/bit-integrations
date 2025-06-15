import toast from 'react-hot-toast'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getAllRank = (val, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = { post_name: val }
  const loadRank = bitsFetch(null, 'get_all_rank_by_types', queryParams, 'GET').then((result) => {
    if (result && result.success) {
      const newConf = { ...tmpNewFlow }
      if (!edit) {
        newConf.triggerData.ranks = result.data
      } else {
        newConf.flow_details.ranks = result.data
      }
      setNewFlow({ ...newConf })
      return __('Fetched Rank successfully', 'bit-integrations')
    }
    return __('Rank  fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadRank, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Rank ...')
  })
}

export const getAllAwardByAchievementType = (val, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = { achievement_name: val }
  const loadPostTypes = bitsFetch(
    null,
    'get_all_award_by_achievement_type',
    queryParams,
    'GET'
  ).then((result) => {
    if (result && result.success) {
      const newConf = { ...tmpNewFlow }
      if (!edit) {
        newConf.triggerData.awards = result.data
      } else {
        newConf.flow_details.awards = result.data
      }
      setNewFlow({ ...newConf })
      return __('Fetched awards successfully', 'bit-integrations')
    }
    return __('Award fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Award...')
  })
}

export const getAllAchievementType = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_achievement_type', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.achievementTypes = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched Achievement Types successfully', 'bit-integrations')
    }
    return __('Achievement Types fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Achievement Types...')
  })
}

export const getAllRankType = (data, setFlow) => {
  const loadPostTypes = bitsFetch(null, 'get_all_rank_type', null, 'GET').then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data }
      tmpFlow.flow_details.rankTypes = result.data
      setFlow({ ...tmpFlow })
      return __('Fetched Rank Types successfully', 'bit-integrations')
    }
    return __('Rank Types fetching failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Rank Types...')
  })
}
