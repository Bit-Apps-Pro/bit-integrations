/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'
import { TASK_LIST_VALUES } from './dokanConstants'

export const handleInput = (e, dokanConf, setDokanConf) => {
  const newConf = create(dokanConf, draftConf => {
    const { name } = e.target
    if (e.target.value !== '') {
      draftConf[name] = e.target.value
    } else {
      delete draftConf[name]
    }
  })

  setDokanConf(newConf)
}

export const checkMappedFields = (dokanConf) => {
  const mappedFields = dokanConf?.field_map ? dokanConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.dokanField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const dokanAuthentication = (confTmp, setError, setIsAuthorized, loading, setLoading) => {
  if (!confTmp.name) {
    setError({ name: !confTmp.name ? __('Name can\'t be empty', 'bit-integrations') : '' })
    return
  }

  setLoading({ ...loading, auth: true })
  bitsFetch({}, 'dokan_authentication')
    .then(result => {
      if (result.success) {
        setIsAuthorized(true)
        toast.success(__('Connected Successfully', 'bit-integrations'))
        setLoading({ ...loading, auth: false })
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Connection failed: install and active Dokan plugin first!', 'bit-integrations'))
    })
}

export const getDokanReputations = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, reputation: true })

  bitsFetch({}, 'dokan_fetch_reputations')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.reputations = result.data
        }
        setConf(newConf)
        setLoading({ ...setLoading, reputation: false })

        toast.success(__('Reputations fetch successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, reputation: false })
      toast.error(__(result?.data ? result.data : 'Something went wrong!', 'bit-integrations'))
    })
}

export const getDokanGroups = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, groups: true })

  bitsFetch({}, 'dokan_fetch_groups')
    .then(result => {
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

export const getDokanForums = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, forums: true })

  bitsFetch({}, 'dokan_fetch_forums')
    .then(result => {
      if (result && result.data) {
        const newConf = { ...confTmp }
        newConf.forums = result.data
        setConf(newConf)
        setLoading({ ...setLoading, forums: false })
        toast.success(__('Forums fetch successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...setLoading, forums: false })
      toast.error(__(result?.data ? result.data : 'Something went wrong!', 'bit-integrations'))
    })
}

export const getDokanTopics = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, topics: true })

  bitsFetch({}, 'dokan_fetch_topics')
    .then(result => {
      if (result && result.data) {
        const newConf = { ...confTmp }
        newConf.topics = result.data
        setConf(newConf)
        setLoading({ ...loading, topics: false })
        toast.success(__('Topics fetch successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, topics: false })
      toast.error(__(result?.data ? result.data : 'Something went wrong!', 'bit-integrations'))
    })
}

export const dokanStaticFields = (selectedTask) => {
  if (selectedTask === TASK_LIST_VALUES.USER_REPUTATION || selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP || selectedTask === TASK_LIST_VALUES.REMOVE_FROM_GROUP) {
    return { staticFields: [{ key: 'email', label: 'User Email', required: true }], fieldMap: [{ formField: '', dokanField: 'email' }] }
  } else if (selectedTask === TASK_LIST_VALUES.CREATE_TOPIC) {
    return {
      staticFields: [
        { key: 'email', label: 'User Email', required: true },
        { key: 'topic_title', label: 'Topic Title', required: true },
        { key: 'topic_content', label: 'Topic Content', required: true },
      ],
      fieldMap: [
        { formField: '', dokanField: 'email' },
        { formField: '', dokanField: 'topic_title' },
        { formField: '', dokanField: 'topic_content' },
      ]
    }
  } else if (selectedTask === TASK_LIST_VALUES.DELETE_TOPIC) {
    return { staticFields: [{ key: 'topic_id', label: 'Topic ID', required: true }], fieldMap: [{ formField: '', dokanField: 'topic_id' }] }
  }

  return { staticFields: [], fieldMap: [] }
}

