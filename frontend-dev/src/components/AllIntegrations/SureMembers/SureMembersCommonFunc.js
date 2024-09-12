/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (e, sureMembersConf, setSureMembersConf) => {
  const newConf = create(sureMembersConf, (draftConf) => {
    const { name } = e.target
    if (e.target.value !== '') {
      draftConf[name] = e.target.value
    } else {
      delete draftConf[name]
    }
  })

  setSureMembersConf(newConf)
}

export const checkMappedFields = (sureMembersConf) => {
  const mappedFields = sureMembersConf?.field_map
    ? sureMembersConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.sureMembersField ||
          (!mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const sureMembersAuthentication = (
  confTmp,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.name) {
    setError({ name: !confTmp.name ? __("Name can't be empty", 'bit-integrations') : '' })
    return
  }

  setLoading({ ...loading, auth: true })
  bitsFetch({}, 'sureMembers_authentication').then((result) => {
    if (result.success) {
      setIsAuthorized(true)
      toast.success(__('Connected Successfully', 'bit-integrations'))
      setLoading({ ...loading, auth: false })
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      __('Connection failed: install and active SureMembers plugin first!', 'bit-integrations')
    )
  })
}

export const getSureMembersGroups = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, groups: true })

  bitsFetch({}, 'sureMembers_fetch_groups').then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      if (result.data) {
        newConf.groups = result.data
      }
      setConf(newConf)
      setLoading({ ...setLoading, groups: false })

      toast.success(__('Groups fetch successfully', 'bit-integrations'))
      return
    }
    setLoading({ ...setLoading, groups: false })
    toast.error(__(result?.data ? result.data : 'Something went wrong!', 'bit-integrations'))
  })
}

export const staticFields = [
  { key: 'email', label: __('User Email', 'bit-integrations'), required: true }
]
