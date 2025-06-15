// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { create } from 'mutative'

export const handleInput = (e, activeCampaingConf, setActiveCampaingConf) => {
  const newConf = { ...activeCampaingConf }
  newConf.name = e.target.value
  setActiveCampaingConf({ ...newConf })
}

export const refreshActiveCampaingList = (
  activeCampaingConf,
  setActiveCampaingConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshListsRequestParams = {
    api_key: activeCampaingConf.api_key,
    api_url: activeCampaingConf.api_url
  }
  setIsLoading(true)
  bitsFetch(refreshListsRequestParams, 'aCampaign_lists')
    .then((result) => {
      if (result && result.success) {
        if (result.data.activeCampaignLists) {
          setActiveCampaingConf((prevConf) =>
            create(prevConf, (draftConf) => {
              if (!draftConf.default) {
                draftConf.default = {}
              }
              draftConf.default.activeCampaignLists = result.data.activeCampaignLists
            })
          )
          setSnackbar({
            show: true,
            msg: __('ActiveCampaign lists refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No ActiveCampaign lists found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }
      } else {
        setSnackbar({
          show: true,
          msg: __('ActiveCampaign lists refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshActiveCampaingAccounts = (
  activeCampaingConf,
  setActiveCampaingConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshListsRequestParams = {
    api_key: activeCampaingConf.api_key,
    api_url: activeCampaingConf.api_url
  }
  setIsLoading(true)
  bitsFetch(refreshListsRequestParams, 'aCampaign_accounts')
    .then((result) => {
      if (result && result.success) {
        if (result.data) {
          setActiveCampaingConf((prevConf) =>
            create(prevConf, (draftConf) => {
              draftConf.accounts = result.data
            })
          )
          setSnackbar({
            show: true,
            msg: __('ActiveCampaign accounts refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No ActiveCampaign account found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }
      } else {
        setSnackbar({
          show: true,
          msg: __('ActiveCampaign accounts refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
// refreshActiveCampaingTags
export const refreshActiveCampaingTags = (
  activeCampaingConf,
  setActiveCampaingConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshListsRequestParams = {
    api_key: activeCampaingConf.api_key,
    api_url: activeCampaingConf.api_url
  }
  bitsFetch(refreshListsRequestParams, 'aCampaign_tags')
    .then((result) => {
      if (result && result.success) {
        if (result.data.activeCampaignTags) {
          setActiveCampaingConf((prevConf) =>
            create(prevConf, (draftConf) => {
              if (!draftConf.default) {
                draftConf.default = {}
              }
              draftConf.default.activeCampaignTags = result.data.activeCampaignTags
            })
          )
          setSnackbar({
            show: true,
            msg: __('ActiveCampaign tags refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No ActiveCampaign tags found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }
      } else {
        setSnackbar({
          show: true,
          msg: __('ActiveCampaign tags refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
export const refreshActiveCampaingHeader = (
  activeCampaingConf,
  setActiveCampaingConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshListsRequestParams = {
    api_key: activeCampaingConf.api_key,
    api_url: activeCampaingConf.api_url
  }
  setIsLoading(true)
  bitsFetch(refreshListsRequestParams, 'aCampaign_headers')
    .then((result) => {
      if (result && result.success) {
        if (result.data.activeCampaignField) {
          setActiveCampaingConf((prevConf) =>
            create(prevConf, (draftConf) => {
              if (!draftConf.default) {
                draftConf.default = {}
              }
              draftConf.default.fields = result.data.activeCampaignField
              draftConf.field_map = Object.values(draftConf.default.fields)
                .filter((f) => f.required)
                .map((f) => ({
                  formField: '',
                  activeCampaignField: f.fieldId,
                  required: true
                }))
            })
          )
          setSnackbar({
            show: true,
            msg: __('ActiveCampaign fields refreshed', 'bit-integrations')
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              'No ActiveCampaign fields found. Try changing the header row number or try again',
              'bit-integrations'
            )
          })
        }
      } else {
        setSnackbar({
          show: true,
          msg: __('ActiveCampaign fields refresh failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = (activeCampaingConf) => {
  const mappedFields = activeCampaingConf?.field_map
    ? activeCampaingConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField && mappedField.activeCampaignField && mappedField.required
      )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
