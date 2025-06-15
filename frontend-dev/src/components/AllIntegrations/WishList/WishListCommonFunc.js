/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, wishlistConf, setWishlistConf) => {
  const newConf = { ...wishlistConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setWishlistConf({ ...newConf })
}

export const getAllLevels = (wishlistConf, setWishlistConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = {
    baseUrl: wishlistConf.baseUrl,
    apiKey: wishlistConf.apiKey,
  }
  const loadPostTypes = bitsFetch(null, 'wishlist_get_all_levels', queryParams, 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...wishlistConf }
        if (!newConf.default) newConf.default = {}
        if (result.data.levellists) {
          newConf.default.levellists = result.data.levellists
        }
        setWishlistConf({ ...newConf })
        setIsLoading(false)
        return 'Levels refreshed successfully'
      } else {
        setIsLoading(false)
        return 'Levels refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Levels...'),
  })
  // .catch(() => setIsLoading(false))
}
export const getAllMembers = (wishlistConf, setWishlistConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = {
    baseUrl: wishlistConf.baseUrl,
    apiKey: wishlistConf.apiKey,
  }
  const loadPostTypes = bitsFetch(null, 'wishlist_get_all_members', queryParams, 'GET')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...wishlistConf }
        if (!newConf.default) newConf.default = {}
        if (result.data.memberlists) {
          newConf.default.memberlists = result.data.memberlists
        }
        setWishlistConf({ ...newConf })
        setIsLoading(false)
        return 'Members refreshed successfully'
      } else {
        setIsLoading(false)
        return 'Members refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Members...'),
  })
  // .catch(() => setIsLoading(false))
}

export const generateMappedField = (wishlistConf) => {
  const wishlistFlds = wishlistConf?.actionName === 'level-member' ? wishlistConf?.memberFields : wishlistConf?.levelFields || []
  const requiredFlds = wishlistFlds?.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', wishlistField: field.key })) : [{ formField: '', wishlistField: '' }]
}

export const checkMappedFields = (wishlistConf) => {
  const mappedFields = wishlistConf?.field_map ? wishlistConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.wishlistField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading) => {
  if (!confTmp.baseUrl || !confTmp.apiKey) {
    setError({
      baseUrl: !confTmp.baseUrl ? __('Base URL can\'t be empty', 'bit-integrations') : '',
      apiKey: !confTmp.apiKey ? __('API Key can\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setError({})
  setIsLoading(true)

  const tokenRequestParams = {
    baseUrl: confTmp.baseUrl,
    apiKey: confTmp.apiKey,
  }

  bitsFetch(tokenRequestParams, 'wishlist_authorization')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        toast.success(__('Authorized Successfully', 'bit-integrations'))
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bit-integrations'))
      }
      setIsLoading(false)
    })
}

// export const handleInputAction = (e, wishlistConf, setWishlistConf, setIsLoading) => {
//   const newConf = { ...wishlistConf }
//   const { name } = e.target
//   if (e.target.value !== '') {
//     newConf[name] = e.target.value
//   } else {
//     delete newConf[name]
//   }
//   setWishlistConf({ ...newConf })
//   // if (e.target.value === 'level-member') {
//   //   getAllLevels(newConf, setWishlistConf, setIsLoading)
//   // }
//   // else {
//   //   getAllMembers(newConf, setWishlistConf, setIsLoading)
//   // }
// }
