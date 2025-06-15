import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const refreshAutonamiListsAndTags = (autonamiConf, setAutonamiConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch({}, 'autonami_lists_and_tags')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...autonamiConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.autonamiList) {
          newConf.default.autonamiList = result.data.autonamiList
        }
        if (result.data.autonamiTags) {
          newConf.default.autonamiTags = result.data.autonamiTags
        }
        setSnackbar({ show: true, msg: __('Autonami lists and tags refreshed', 'bit-integrations') })
        setAutonamiConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Autonami lists and tags refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Autonami lists and tags refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const getAutonamiFields = (autonamiConf, setAutonamiConf, setIsLoading, setSnackbar, refreshFields = false) => {
  bitsFetch({}, 'autonami_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...autonamiConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.autonamiFields) {
          newConf.default.fields = result.data.autonamiFields
          if (!refreshFields) {
            const { fields } = newConf.default
            newConf.field_map = Object.values(fields).filter(f => f.required).map(f => ({ formField: '', autonamiField: f.key, required: true }))
          }
          setSnackbar({ show: true, msg: __('Autonami fields refreshed', 'bit-integrations') })
        } else {
          setSnackbar({ show: true, msg: __('No Autonami fields found. Try changing the header row number or try again', 'bit-integrations') })
        }
        setAutonamiConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Autonami fields refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleInput = (e, autonamiConf, setAutonamiConf) => {
  const newConf = { ...autonamiConf }
  newConf.name = e.target.value
  setAutonamiConf({ ...newConf })
}
export const checkMappedFields = autonamiConf => {
  const mappedFields = autonamiConf?.field_map ? autonamiConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.autonamiField && mappedField.required)) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
