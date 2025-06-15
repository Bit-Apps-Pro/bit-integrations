import toast from 'react-hot-toast'
import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, salesforceConf, setSalesforceConf, formID, setIsLoading, setSnackbar, isNew, error, setError) => {
  const newConf = { ...salesforceConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value
  setSalesforceConf({ ...newConf })
}

// export const getAllCampaignList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
//   setIsLoading(true)
//   const campaignRequestParams = {
//     formID,
//     clientId: salesforceConf.clientId,
//     clientSecret: salesforceConf.clientSecret,
//     tokenDetails: salesforceConf.tokenDetails,
//   }
//   const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_campaign_list')
//     .then(result => {
//       if (result && result.success) {
//         const newConf = { ...salesforceConf }
//         if (!newConf.default) newConf.default = {}
//         if (!newConf.default?.campaignLists) {
//           newConf.default.campaignLists = {}
//         }
//         if (result.data.allCampaignLists) {
//           newConf.default.campaignLists = result.data.allCampaignLists
//         }
//         if (result.data.tokenDetails) {
//           newConf.tokenDetails = result.data.tokenDetails
//         }
//         setSalesforceConf({ ...newConf })
//         setIsLoading(false)
//         return 'Campaign list refreshed'
//       }
//       setIsLoading(false)
//       return 'Campaign list refresh failed. please try again'
//     })
//   toast.promise(loadPostTypes, {
//     success: data => data,
//     error: __('Error Occurred', 'bit-integrations'),
//     loading: __('Loading Campaign list...'),
//   })
// }

export const getAllCampaignList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_campaign_list')
    .then(result => {
      if (result && result.success) {
        setSalesforceConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) newConf.default = {}
          if (!newConf.default?.campaignLists) {
            newConf.default.campaignLists = {}
          }
          if (result.data.allCampaignLists) {
            newConf.default.campaignLists = result.data.allCampaignLists
          }
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          return newConf
        })
        setIsLoading(false)
        return 'Campaign list refreshed'
      }
      setIsLoading(false)
      return 'Campaign list refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Campaign list...'),
  })
}

// export const getAllLeadList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
//   setIsLoading(true)
//   const campaignRequestParams = {
//     formID,
//     clientId: salesforceConf.clientId,
//     clientSecret: salesforceConf.clientSecret,
//     tokenDetails: salesforceConf.tokenDetails,
//   }
//   bitsFetch(campaignRequestParams, 'selesforce_lead_list')
//     .then(result => {
//       if (result && result.success) {
//         const newConf = { ...salesforceConf }
//         if (!newConf.default) newConf.default = {}
//         if (!newConf.default?.leadLists) {
//           newConf.default.leadLists = {}
//         }
//         if (result.data.leadLists) {
//           newConf.default.leadLists = result.data.leadLists
//         }
//         if (result.data.tokenDetails) {
//           newConf.tokenDetails = result.data.tokenDetails
//         }
//         setSnackbar({ show: true, msg: __('lead list refreshed', 'bit-integrations') })
//         setSalesforceConf({ ...newConf })
//       } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
//         setSnackbar({ show: true, msg: `${__('Lead list refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
//       } else {
//         setSnackbar({ show: true, msg: __('Lead list refresh failed. please try again', 'bit-integrations') })
//       }
//       setIsLoading(false)
//     })
//     .catch(() => setIsLoading(false))
// }
// export const getAllContactList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
//   setIsLoading(true)
//   const campaignRequestParams = {
//     formID,
//     clientId: salesforceConf.clientId,
//     clientSecret: salesforceConf.clientSecret,
//     tokenDetails: salesforceConf.tokenDetails,
//   }
//   const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_contact_list')
//     .then(result => {
//       if (result && result.success) {
//         const newConf = { ...salesforceConf }
//         if (!newConf.default) newConf.default = {}
//         if (!newConf.default?.contactLists) {
//           newConf.default.contactLists = {}
//         }
//         if (result.data.contactLists) {
//           newConf.default.contactLists = result.data.contactLists
//         }
//         if (result.data.tokenDetails) {
//           newConf.tokenDetails = result.data.tokenDetails
//         }
//         setSalesforceConf({ ...newConf })
//         setIsLoading(false)
//         return 'Contact list refreshed'
//       }
//       setIsLoading(false)
//       return 'Contact list refresh failed. please try again'
//     })
//   toast.promise(loadPostTypes, {
//     success: data => data,
//     error: __('Error Occurred', 'bit-integrations'),
//     loading: __('Loading Contact list...'),
//   })
// }

export const getAllLeadList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails,
  }
  bitsFetch(campaignRequestParams, 'selesforce_lead_list')
    .then(result => {
      if (result && result.success) {
        setSalesforceConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) newConf.default = {}
          if (!newConf.default?.leadLists) {
            newConf.default.leadLists = {}
          }
          if (result.data.leadLists) {
            newConf.default.leadLists = result.data.leadLists
          }
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          return newConf
        })
        setIsLoading(false)
        return 'Lead list refreshed'
      }
      setIsLoading(false)
      return 'Lead list refresh failed. please try again'
    })
    .catch(() => setIsLoading(false))
}

export const getAllContactList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_contact_list')
    .then(result => {
      if (result && result.success) {
        setSalesforceConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) newConf.default = {}
          if (!newConf.default?.contactLists) {
            newConf.default.contactLists = {}
          }
          if (result.data.contactLists) {
            newConf.default.contactLists = result.data.contactLists
          }
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          return newConf
        })
        setIsLoading(false)
        return 'Contact list refresh successfully.'
      }
      setIsLoading(false)
      return 'Contact list refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Contact list...'),
  })
}

export const getAllCustomFields = (formID, actionName, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const customFieldRequestParams = {
    formID,
    actionName,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(customFieldRequestParams, 'selesforce_custom_field')
    .then(result => {
      const customFields = result && result.success ? result?.data : []
      const returnMsg = result && result.success ? 'Custom field refresh successfully.' : result?.data[0]?.message ? 'Custom field: ' + result?.data[0]?.message : 'Custom field refresh failed. please try again'

      setSalesforceConf((prevConf) => {
        const draftConf = prevConf;
        draftConf.field_map = [{ formField: "", salesmateFormField: "" }];
        if (result?.data) {
          if (actionName === 'contact-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.contactFields,
              ...customFields
            ];
          } else if (actionName === 'lead-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.leadFields,
              ...customFields
            ];
          } else if (actionName === 'account-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.accountFields,
              ...customFields
            ];
          } else if (actionName === 'campaign-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.campaignFields,
              ...customFields
            ];
          } else if (actionName === 'add-campaign-member') {
            draftConf['selesforceFields'] = [
              ...draftConf.campaignMemberStatus,
              ...customFields
            ];
          } else if (actionName === 'opportunity-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.opportunityFields,
              ...customFields
            ];
          } else if (actionName === 'event-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.eventFields,
              ...customFields
            ];
          } else if (actionName === 'case-create') {
            draftConf['selesforceFields'] = [
              ...draftConf.caseFields,
              ...customFields
            ];
          }
        }
        draftConf.field_map = generateMappedField(draftConf);
        return draftConf;
      });
      setIsLoading(false)
      return returnMsg
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __(`Loading ${actionName} list...`),
  })
}

// export const getAllAccountList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
//   setIsLoading(true)
//   const campaignRequestParams = {
//     formID,
//     clientId: salesforceConf.clientId,
//     clientSecret: salesforceConf.clientSecret,
//     tokenDetails: salesforceConf.tokenDetails,
//   }
//   const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_account_list')
//     .then(result => {
//       if (result && result.success) {
//         const newConf = { ...salesforceConf }
//         if (!newConf.default) newConf.default = {}
//         if (!newConf.default?.accountLists) {
//           newConf.default.accountLists = {}
//         }
//         if (result.data.accountLists) {
//           newConf.default.accountLists = result.data.accountLists
//         }
//         if (result.data.tokenDetails) {
//           newConf.tokenDetails = result.data.tokenDetails
//         }
//         setSalesforceConf({ ...newConf })
//         setIsLoading(false)
//         return 'Account list refreshed'
//       }
//       setIsLoading(false)
//       return 'Account list refresh failed. please try again'
//     })
//   toast.promise(loadPostTypes, {
//     success: data => data,
//     error: __('Error Occurred', 'bit-integrations'),
//     loading: __('Loading Account list...'),
//   })
// }

export const getAllAccountList = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_account_list')
    .then(result => {
      if (result && result.success) {
        setSalesforceConf((oldConf) => {
          const newConf = { ...oldConf }
          if (!newConf.default) newConf.default = {}
          if (!newConf.default?.accountLists) {
            newConf.default.accountLists = {}
          }
          if (result.data.accountLists) {
            newConf.default.accountLists = result.data.accountLists
          }
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          return newConf
        })
        setIsLoading(false)
        return 'Account list refreshed'
      }
      setIsLoading(false)
      return 'Account list refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Account list...'),
  })
}

export const checkMappedFields = (salesforceConf) => {
  const mappedFields = salesforceConf?.field_map ? salesforceConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.selesforceField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []

  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const generateMappedField = (salesforceConf, actionName) => {
  let fields = []
  // if (actionName === 'contact-create') {
  //   fields = salesforceConf?.contactFields
  // } else if (actionName === 'lead-create') {
  //   fields = salesforceConf?.leadFields
  // } else if (actionName === 'account-create') {
  //   fields = salesforceConf?.accountFields
  // } else if (actionName === 'campaign-create') {
  //   fields = salesforceConf?.campaignFields
  // } else if (actionName === 'add-campaign-member') {
  //   fields = salesforceConf?.campaignMemberFields
  // } else if (actionName === 'opportunity-create') {
  //   fields = salesforceConf?.opportunityFields
  // } else if (actionName === 'event-create') {
  //   fields = salesforceConf?.eventFields
  // } else if (actionName === 'case-create') {
  //   fields = salesforceConf?.caseFields
  // }
  fields = salesforceConf?.selesforceFields || []
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', selesforceField: field.key })) : [{ formField: '', selesforceField: '' }]
}
export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }

  setIsLoading(true)
  const apiEndpoint = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${confTmp.clientId}&prompt=login%20consent&redirect_uri=${encodeURIComponent(window.location.href)}/redirect`
  const authWindow = window.open(apiEndpoint, 'salesforce', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__salesforce')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__salesforce')
      }
      console.log(grantTokenResponse)
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${encodeURIComponent(window.location.href)}/redirect`
  bitsFetch(tokenRequestParams, 'selesforce_generate_token')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
}
