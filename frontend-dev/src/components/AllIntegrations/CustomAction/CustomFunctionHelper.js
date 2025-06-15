import bitsFetch from '../../../Utils/bitsFetch'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'

export const checkFunctionValidity = (
  customActionConf,
  setCustomActionConf,
  loading,
  setLoading
) => {
  const data = customActionConf.value
  const newConf = { ...customActionConf }
  setLoading({ ...loading, validate: true })
  bitsFetch(data, 'checking_function_validity', null, 'POST').then((result) => {
    if (result && result.success) {
      if (result.data) {
        newConf.isValid = true
      }
      setCustomActionConf({ ...newConf })
      setLoading({ ...loading, validate: false })
      toast.success(__(`${result.data}, You can proceed`, 'bit-integrations'))
      return
    }
    delete newConf.isValid
    setCustomActionConf({ ...newConf })
    setLoading({ ...loading, validate: false })
    toast.error(__(`${result.data}`, 'bit-integrations'))
    return
  })
}
