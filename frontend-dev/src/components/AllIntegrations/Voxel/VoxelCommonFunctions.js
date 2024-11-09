/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'
import { TASK_LIST_VALUES } from './VoxelConstants'

export const handleInput = (e, voxelConf, setVoxelConf) => {
  const newConf = create(voxelConf, (draftConf) => {
    const { name } = e.target
    if (e.target.value !== '') {
      draftConf[name] = e.target.value
    } else {
      delete draftConf[name]
    }
  })

  setVoxelConf(newConf)
}

export const checkMappedFields = (voxelConf) => {
  const mappedFields = voxelConf?.field_map
    ? voxelConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.voxelField ||
        (!mappedField.formField === 'custom' && !mappedField.customValue)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const voxelAuthentication = (confTmp, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.name) {
    setError({ name: !confTmp.name ? __("Name can't be empty", 'bit-integrations') : '' })
    return
  }

  setLoading({ ...loading, auth: true })
  bitsFetch({}, 'voxel_authentication').then((result) => {
    if (result.success) {
      setIsAuthorized(true)
      toast.success(__('Connected Successfully', 'bit-integrations'))
      setLoading({ ...loading, auth: false })
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(__(result?.data ? result.data : 'Something went wrong!', 'bit-integrations'))
  })
}

export const getAllEvents = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, events: true })

  bitsFetch({}, 'get_voxel_events').then((result) => {
    if (result.success && result.data) {
      const newConf = { ...confTmp }
      newConf.events = result.data
      setConf(newConf)
      setLoading({ ...loading, events: false })
      toast.success(__('Events fetched successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...loading, events: false })
    toast.error(result?.data ? result.data : __('Something went wrong!', 'bit-integrations'))
  })
}

export const voxelStaticFields = (selectedTask) => {
  if (selectedTask === TASK_LIST_VALUES.NEW_ATTENDEE) {
    return {
      staticFields:
        [
          { key: 'name', label: __('Full Name', 'bit-integrations'), required: true },
          { key: 'email', label: __('Email', 'bit-integrations'), required: true },
          { key: 'number_of_guests', label: __('Number of Guests', 'bit-integrations'), required: true },
        ],
      fieldMap:
        [
          { formField: '', voxelField: 'name' },
          { formField: '', voxelField: 'email' },
          { formField: '', voxelField: 'number_of_guests' }
        ]
    }
  }

  return { staticFields: [], fieldMap: [] }
}
