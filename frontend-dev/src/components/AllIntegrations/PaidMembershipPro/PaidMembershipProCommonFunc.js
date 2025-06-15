import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, paidMembershipProConf, setPaidMembershipProConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...paidMembershipProConf }
  const { name, value } = e.target
  if (e.target.value !== '') {
    newConf[name] = value
  } else {
    delete newConf[name]
  }
  newConf[name] = value
  getAllPaidMemberShipProLevel(newConf, setPaidMembershipProConf, setIsLoading, setSnackbar)
}

export const getAllPaidMemberShipProLevel = (paidMembershipProConf, setPaidMembershipProConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_paid_membership_pro_level')
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...paidMembershipProConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          if (newConf.mainAction === '2') {
            const newLevel = { membershipId: 'any', membershipTitle: 'Any membership level' }
            newConf.default.allMemberShipLevel = [newLevel, ...result.data]
          } else {
            newConf.default.allMemberShipLevel = result.data
          }
        }
        setPaidMembershipProConf(newConf)
        setIsLoading(false)
        toast.success(__('All Paid Membership pro level fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Paid Membership pro level fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}
