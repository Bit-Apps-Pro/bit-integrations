import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, memberpressConf, setMemberpressConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...memberpressConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setMemberpressConf({ ...newConf })
}

export const getAllMemberShip = (memberpressConf, setMemberpressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_membership')
    .then((result) => {
      if (result && result.success) {
        setMemberpressConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.default.allMemberShips = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All membership fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Membership fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const paymentGateway = (memberpressConf, setMemberpressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_payment_gateway')
    .then((result) => {
      if (result && result.success) {
        setMemberpressConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.default.allPaymentMethods = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All payment method fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Payment method fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const generateMappedField = (memberpressConf) => {
  const requiredFlds = memberpressConf?.memberpressFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', memberpressFormField: field.key })) : [{ formField: '', memberpressFormField: '' }]
}

export const checkMappedFields = (memberpressConf) => {
  const mappedFleld = memberpressConf.field_map ? memberpressConf.field_map.filter((mapped) => !mapped.formField && !mapped.memberpressFormField) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
