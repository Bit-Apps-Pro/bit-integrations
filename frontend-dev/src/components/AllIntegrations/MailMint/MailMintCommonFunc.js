import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (
  e,
  mailMintConf,
  setMailMintConf,
  setIsLoading,
  setSnackbar,
  formID
) => {
  const newConf = { ...mailMintConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
    mailMintRefreshFields(newConf, setMailMintConf, setIsLoading, setSnackbar)
  } else {
    delete newConf[name]
  }
  newConf[e.target.name] = e.target.value
  setMailMintConf({ ...newConf })
}

export const mailMintRefreshFields = (mailMintConf, setMailMintConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_mail_mint_custom_fields')
    .then((result) => {
      if (result && result.success) {
        setMailMintConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.mailMintContactFields = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All custom field fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Mail Mint custom field fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const getAllList = (mailMintConf, setMailMintConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_mail_mint_list')
    .then((result) => {
      if (result && result.success) {
        setMailMintConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.default.allLists = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All list fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Mail mint list fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const getAllTags = (mailMintConf, setMailMintConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'fetch_all_mail_mint_tags')
    .then((result) => {
      if (result && result.success) {
        setMailMintConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) {
            newConf.default = {}
          }
          if (result.data) {
            newConf.default.allTags = result.data
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('All tags fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Mail Mint fetch failed. please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const generateMappedField = (mailMintConf) => {
  const requiredFlds = mailMintConf?.mailMintContactFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({ formField: '', mailMintFormField: field.key }))
    : [{ formField: '', mailMintFormField: '' }]
}

export const checkMappedFields = (mailMintConf) => {
  const mappedFleld = mailMintConf.field_map
    ? mailMintConf.field_map.filter((mapped) => !mapped.formField && !mapped.mailMintFormField)
    : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
