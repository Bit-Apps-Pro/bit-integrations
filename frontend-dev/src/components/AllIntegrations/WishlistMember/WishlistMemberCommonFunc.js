import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleAuthorize = (setIsAuthorized, setIsLoading, setSnackbar) => {
  setIsLoading(true)

  bitsFetch(null, 'wishlist_authorization').then(result => {
    if (result?.success) {
      setIsAuthorized(true)
      setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
    } else {
      setIsAuthorized(false)
      setSnackbar({
        show: true,
        msg: result?.data || __('Authorization Failed, Please try again', 'bit-integrations')
      })
    }

    setIsLoading(false)
  })
}

export const refreshNewsLetter = (
  formID,
  wishlistMemberConf,
  setWishlistMemberConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  bitsFetch({}, 'refresh_news_letter')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...wishlistMemberConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.newsletterList) {
          newConf.default.newsletterList = result.data.newsletterList
        }
        setSnackbar({ show: true, msg: __('Newsletter list refreshed', 'bit-integrations') })
        setWishlistMemberConf({ ...newConf })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: `${__('Newsletter list refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Newsletter list refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshMailpoetHeader = (
  wishlistMemberConf,
  setWishlistMemberConf,
  setIsLoading,
  setSnackbar
) => {
  bitsFetch({}, 'mail_poet_list_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...wishlistMemberConf }
        if (result.data.wishlistMemberFields) {
          newConf.default.fields = result.data.wishlistMemberFields
          const { fields } = newConf.default
          newConf.field_map = Object.values(fields)
            .filter(f => f.required)
            .map(f => ({ formField: '', wishlistMemberField: f.id, required: true }))
          setSnackbar({ show: true, msg: __('Mailpoet fields refreshed', 'bit-integrations') })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No Mailpoet fields found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setWishlistMemberConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: __('Mailpoet fields refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleInput = (e, wishlistMemberConf, setWishlistMemberConf) => {
  const newConf = { ...wishlistMemberConf }
  newConf.name = e.target.value
  setWishlistMemberConf({ ...newConf })
}
export const checkMappedFields = wishlistMemberConf => {
  const mappedFields = wishlistMemberConf?.field_map
    ? wishlistMemberConf.field_map.filter(
        mappedField => !mappedField.formField && mappedField.wishlistMemberField && mappedField.required
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
