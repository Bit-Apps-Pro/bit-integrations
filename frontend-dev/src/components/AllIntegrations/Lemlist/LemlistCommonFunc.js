// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from "@wordpress/i18n"
import bitsFetch from "../../../Utils/bitsFetch"

export const handleInput = (e, lemlistConf, setLemlistConf) => {
  const newConf = { ...lemlistConf }
  newConf.name = e.target.value
  setLemlistConf({ ...newConf })
}

// refreshMappedLists
export const refreshLemlistCampaign = (
  lemlistConf,
  setLemlistConf,
  setIsLoading,
  setSnackbar,
) => {
  const refreshListsRequestParams = {
    account_id: lemlistConf.account_id,
    api_key: lemlistConf.api_key,
  }
  bitsFetch(refreshListsRequestParams, "lemlist_campaigns")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...lemlistConf }
        if (result.data) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.lemlistCampaigns = result.data
          setSnackbar({
            show: true,
            msg: __("Lemlist Campaigns refreshed", "bit-integrations"),
          })
        } else {
          setSnackbar({
            show: true,
            msg: __(
              "No Lemlist campaigns found. Try changing the header row number or try again",
              "bit-integrations"
            ),
          })
        }

        setLemlistConf({ ...newConf })
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Lemlist campaigns refresh failed. please try again",
            "bit-integrations"
          ),
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

// refreshMappedFields
export const refreshLemlistHeader = (
  lemlistConf,
  setLemlistConf,
  setIsLoading,
  setSnackbar,
) => {
  const leadFields = [
    { fieldValue: 'email', fieldName: 'Email', required: true },
    { fieldValue: 'firstName', fieldName: 'First Name', required: false },
    { fieldValue: 'lastName', fieldName: 'Last Name', required: false },
    { fieldValue: 'companyName', fieldName: 'Company Name', required: false },
    { fieldValue: 'phone', fieldName: 'Phone', required: false },
  ]

  const newConf = { ...lemlistConf }
  if (!newConf.default) {
    newConf.default = {}
  }

  newConf.default.fields = leadFields
  const { fields } = newConf.default
  newConf.field_map = Object.values(fields)
    .filter((f) => f.required)
    .map((f) => ({
      formField: "",
      lemlistField: f.fieldValue,
      required: true,
    }))

  setSnackbar({
    show: true,
    msg: __("Lemlist fields refreshed", "bit-integrations"),
  })
  setLemlistConf({ ...newConf })
  setIsLoading(false)
}

export const checkMappedFields = (lemlistConf) => {
  const mappedFields = lemlistConf?.field_map
    ? lemlistConf.field_map.filter(
      (mappedField) => !mappedField.formField
        && mappedField.lemlistField
        && mappedField.required
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
