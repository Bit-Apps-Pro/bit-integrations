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
  if (selectedTask === TASK_LIST_VALUES.CREATE_VENDOR) {
    return {
      staticFields: [
        { key: 'email', label: 'Email', required: true },
        { key: 'user_login', label: 'Username', required: true },
        { key: 'store_name', label: 'Store Name', required: true },
        { key: 'first_name', label: 'First Name', required: false },
        { key: 'last_name', label: 'Last Name', required: false },
        { key: 'phone', label: 'Phone', required: false },
        { key: 'payment_bank_ac_name', label: 'Account Name', required: false },
        { key: 'payment_bank_ac_type', label: 'Account Type', required: false },
        { key: 'payment_bank_ac_number', label: 'Account Number', required: false },
        { key: 'payment_bank_bank_name', label: 'Bank Name', required: false },
        { key: 'payment_bank_bank_addr', label: 'Bank Address', required: false },
        { key: 'payment_bank_routing_number', label: 'Routing Number', required: false },
        { key: 'payment_bank_iban', label: 'IBAN', required: false },
        { key: 'payment_bank_swift', label: 'Swift', required: false },
        { key: 'payment_paypal_email', label: 'PayPal Email', required: false },
        { key: 'street_1', label: 'Street 1', required: false },
        { key: 'street_2', label: 'Street 2', required: false },
        { key: 'city', label: 'City', required: false },
        { key: 'zip', label: 'Zip', required: false },
        { key: 'state', label: 'State', required: false },
        { key: 'country', label: 'Country', required: false },
      ],
      fieldMap: [
        { formField: '', dokanField: 'email' },
        { formField: '', dokanField: 'user_login' },
        { formField: '', dokanField: 'store_name' },
      ]
    }
  }

  return { staticFields: [], fieldMap: [] }
}

