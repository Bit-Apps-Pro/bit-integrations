import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const setGrantTokenResponse = () => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem('__zohoCampaigns', JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleInput = (e, formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar) => {
  let newConf = { ...campaignsConf }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'list':
      newConf = listChange(newConf, formID, setCampaignsConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setCampaignsConf({ ...newConf })
}

export const listChange = (campaignsConf, formID, setCampaignsConf, setIsLoading, setSnackbar) => {
  const newConf = { ...campaignsConf }
  newConf.field_map = [{ formField: '', zohoFormField: 'Contact Email' }]

  if (!newConf?.default?.fields?.[newConf.list]) {
    refreshContactFields(formID, newConf, setCampaignsConf, setIsLoading, setSnackbar)
  }
  return newConf
}

export const refreshLists = (formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const refreshListsRequestParams = {
    formID,
    id: campaignsConf.id,
    dataCenter: campaignsConf.dataCenter,
    clientId: campaignsConf.clientId,
    clientSecret: campaignsConf.clientSecret,
    tokenDetails: campaignsConf.tokenDetails,
  }
  bitsFetch(refreshListsRequestParams, 'zcampaigns_refresh_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...campaignsConf }
        if (result.data.lists) {
          newConf.default = { ...newConf.default, lists: result.data.lists }
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Lists refreshed', 'bit-integrations') })
        setCampaignsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Lists refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Lists refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshContactFields = (formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar) => {
  const { list } = campaignsConf
  if (!list) {
    return
  }

  setIsLoading(true)
  const refreshContactFieldsRequestParams = {
    formID,
    list,
    dataCenter: campaignsConf.dataCenter,
    clientId: campaignsConf.clientId,
    clientSecret: campaignsConf.clientSecret,
    tokenDetails: campaignsConf.tokenDetails,
  }
  bitsFetch(refreshContactFieldsRequestParams, 'zcampaigns_refresh_contact_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...campaignsConf }
        if (result.data.fields) {
          if (!newConf.default.fields) {
            newConf.default.fields = {}
          }
          newConf.default.fields[list] = result.data
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          setSnackbar({ show: true, msg: __('Contact Fields refreshed', 'bit-integrations') })
        } else {
          setSnackbar({ show: true, msg: __('Zoho didn\'t provide fields names for this list', 'bit-integrations') })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setCampaignsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Contact Fields refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const checkMappedFields = (campaignsConf) => {
  const mappedFields = campaignsConf?.field_map ? campaignsConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && campaignsConf?.default?.fields?.[campaignsConf.list]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}
