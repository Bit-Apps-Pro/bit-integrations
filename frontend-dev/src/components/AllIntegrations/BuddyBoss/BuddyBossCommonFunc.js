import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...buddyBossConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  if (name === 'mainAction') {
    newConf.field_map = [
      { formField: '', buddyBossFormField: '' },
    ]
  }

  newConf[e.target.name] = e.target.value
  setBuddyBossConf({ ...newConf })
}

export const getAllBuddyBossGroup = (buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  // const requestParams = {  }
  bitsFetch(null, 'fetch_all_group')
    .then((result) => {
      if (result && result.success) {
        setBuddyBossConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            if (buddyBossConf.mainAction === '6' || buddyBossConf.mainAction === '14') {
              const newGroupAdd = { id: 'any', name: 'Any' }
              const allGroupModify = [newGroupAdd, ...result.data]
              newConf.default.allGroup = allGroupModify
            } else {
              newConf.default.allGroup = result.data
            }
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All Group fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Group fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const getAllUser = (buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_user')
    .then((result) => {
      if (result && result.success) {
        setBuddyBossConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.default.allUser = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All User fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('User fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const getAllForum = (buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_forum')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...buddyBossConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allForum = result.data
        }
        setBuddyBossConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All Forum fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Forum list fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const getAllTopic = (buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { forumID: buddyBossConf.forumId }
  bitsFetch(requestParams, 'fetch_all_topic')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...buddyBossConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allTopic = result.data
        }
        setBuddyBossConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All Topic fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Topic list fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

// export const generateMappedField = (buddyBossConf) => {
//   const requiredFlds = buddyBossConf?.createGroupFields.filter(fld => fld.required === true)
//   return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', buddyBossFormField: field.key })) : [{ formField: '', buddyBossFormField: '' }]
// }

export const generateMappedField = (buddyBossConf, mainAction) => {
  let fields = []
  if (mainAction === '1') {
    fields = buddyBossConf?.createGroupFields
  } else if (mainAction === '5') {
    fields = buddyBossConf?.topicInForumFields
  } else if (mainAction === '8' || mainAction === '11') {
    fields = buddyBossConf?.sendAllUserNotificationFields
  } else if (mainAction === '9' || mainAction === '10') {
    fields = buddyBossConf?.sendAllGroupPrivateMessageFields
  } else if (mainAction === '14') {
    fields = buddyBossConf?.addPostToGroupFields
  } else if (mainAction === '15') {
    fields = buddyBossConf?.addPostSiteWideActivityStreamFields
  } else if (mainAction === '17') {
    fields = buddyBossConf?.postReplyTopicForumFields
  }
  const requiredFlds = fields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({ formField: '', buddyBossFormField: field.key }))
    : [{ formField: '', buddyBossFormField: '' }]
}

export const checkMappedFields = (buddyBossConf) => {
  const mappedFleld = buddyBossConf.field_map ? buddyBossConf.field_map.filter((mapped) => !mapped.formField && !mapped.buddyBossFormField) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
