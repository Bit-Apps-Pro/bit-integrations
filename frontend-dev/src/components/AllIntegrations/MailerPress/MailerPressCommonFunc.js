import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (e, mailerPressConf, setMailerPressConf) => {
  const { name, value } = e.target

  setMailerPressConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const refreshMailerPressLists = (setMailerPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_mailer_press_lists')
    .then(result => {
      if (result && result?.success && result?.data?.listList) {
        setMailerPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allLists = result.data.listList
          })
        )

        setIsLoading(false)
        toast.success(__('All lists fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('MailerPress list fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const refreshMailerPressTags = (setMailerPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'refresh_mailer_press_tags')
    .then(result => {
      if (result && result?.success && result?.data?.tagList) {
        setMailerPressConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.allTags = result.data.tagList
          })
        )

        setIsLoading(false)
        toast.success(__('All tags fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('MailerPress tags fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const mailerPressListHeaders = (setMailerPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'mailer_press_list_headers')
    .then(result => {
      if (result && result.success) {
        setMailerPressConf(oldConf => {
          const newConf = { ...oldConf }
          if (result.data.mailerPressFields) {
            newConf.mailerPressFields = result.data.mailerPressFields
          }
          return newConf
        })
        setIsLoading(false)
        toast.success(__('Fields fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('MailerPress field fetch failed. Please try again', 'bit-integrations'))
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = mailerPressConf => {
  const mappedFields = mailerPressConf?.field_map
    ? mailerPressConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.mailerPressField ||
          (!mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        mailerPressField: field.key
      }))
    : [{ formField: '', mailerPressField: '' }]
}
