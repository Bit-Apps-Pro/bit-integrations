// eslint-disable-next-line no-unused-vars
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const addFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf[fldProp].splice(i, 0, {})

  setConf({ ...newConf })
}

export const delFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf[fldProp].length > 1) {
    newConf[fldProp].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (fldProp, event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf[fldProp][index][event.target.name] = event.target.value

  setConf({ ...newConf })
}

export const checkMappedPostFields = data => {
  const mappedFields = data?.post_map ? data.post_map.filter(mappedField => !mappedField.formField && mappedField.postField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const checkMappedAcfFields = data => {
  const mappedFields = data?.acf_map ? data.acf_map.filter(mappedField => !mappedField.formField && mappedField.acfField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

export const checkMappedMbFields = data => {
  const mappedFields = data?.metabox_map ? data.metabox_map.filter(mappedField => !mappedField.formField && mappedField.metaboxField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

export const refreshAcfFields = (acfConf, setAcfFields, setAcfFile) => {
  const loadAcfFields = bitsFetch({ post_type: acfConf?.post_type }, 'bitforms_get_custom_field').then((res) => {
    if (res !== undefined && res.success) {
      if (res?.data?.acfFields) {
        setAcfFields(res.data.acfFields)
      }
      if (res?.data?.acfFile) {
        setAcfFile(res.data.acfFile)
      }
    }
    if (res?.data?.acfFields.length !== 0 || res?.data?.acfFile.length !== 0) return 'Successfully refresh ACF Fields.'
    return 'ACF Fields not found'
  })
  toast.promise(loadAcfFields, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading ACF Fields...'),
  })
}
export const refreshPostTypes = (postTypes, setPostTypes) => {
  const loadPostTypes = bitsFetch({}, 'post-types/list')
    .then(result => {
      if (result && result.success) {
        const { data } = result
        if (data) {
          setPostTypes(data)
        }
        if (data !== 0) return 'Successfully refresh Post Types.'
        return ' Post Types not found'
      }
    })

  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Post Types...'),
  })
}
