import toast from 'react-hot-toast'
import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { create } from 'mutative'

export const handleInput = (
  e,
  salesforceConf,
  setSalesforceConf,
  formID,
  setIsLoading,
  setSnackbar,
  isNew,
  error,
  setError
) => {
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
//         return __('Campaign list refreshed','bit-integrations')
//       }
//       setIsLoading(false)
//       return __('Campaign list refresh failed. please try again','bit-integrations')
//     })
//   toast.promise(loadPostTypes, {
//     success: data => data,
//     error: __('Error Occurred', 'bit-integrations'),
//     loading: __('Loading Campaign list...'),
//   })
// }

export const getAllCampaignList = (
  formID,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_campaign_list').then(result => {
    if (result && result.success) {
      setSalesforceConf(oldConf => {
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
      return __('Campaign list refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Campaign list refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Campaign list...')
  })
}

export const getAllOrigin = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_case_origin').then(result => {
    if (result && result.success) {
      setSalesforceConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf['caseOrigins'] = result.data
        })
      )
      setIsLoading(false)
      return __('Case Origin refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Case Origin refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Case Origin...')
  })
}

export const getAllType = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_case_type').then(result => {
    if (result && result.success) {
      setSalesforceConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf['caseTypes'] = result.data
        })
      )
      setIsLoading(false)
      return __('Type refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Type refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading type...')
  })
}

export const getAllReason = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostReasons = bitsFetch(campaignRequestParams, 'selesforce_case_reason').then(result => {
    if (result && result.success) {
      setSalesforceConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf['caseReasons'] = result.data
        })
      )
      setIsLoading(false)
      return __('Reason refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Reason refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostReasons, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Reason...')
  })
}

export const getAllStatus = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostReasons = bitsFetch(campaignRequestParams, 'selesforce_case_status').then(result => {
    if (result && result.success) {
      setSalesforceConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf['caseStatus'] = result.data
        })
      )
      setIsLoading(false)
      return __('Status refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Status refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostReasons, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Status...')
  })
}

export const getAllPriority = (formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostReasons = bitsFetch(campaignRequestParams, 'selesforce_case_priority').then(result => {
    if (result && result.success) {
      setSalesforceConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf['casePriority'] = result.data
        })
      )
      setIsLoading(false)
      return __('Priority refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Priority refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostReasons, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Priority...')
  })
}

export const getAllPotentialLiability = (
  formID,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostReasons = bitsFetch(campaignRequestParams, 'selesforce_case_potential_liability').then(
    result => {
      if (result && result.success) {
        setSalesforceConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf['casePotentialLiability'] = result.data
          })
        )
        setIsLoading(false)
        return __('Potential Liability refreshed', 'bit-integrations')
      }
      setIsLoading(false)
      return __('Potential Liability refresh failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostReasons, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Potential Liability...')
  })
}

export const getAllSLAViolation = (
  formID,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostReasons = bitsFetch(campaignRequestParams, 'selesforce_case_sla_violation').then(
    result => {
      if (result && result.success) {
        setSalesforceConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf['caseSLAViolation'] = result.data
          })
        )
        setIsLoading(false)
        return __('SLA Violation refreshed', 'bit-integrations')
      }
      setIsLoading(false)
      return __('SLA Violation refresh failed. please try again', 'bit-integrations')
    }
  )
  toast.promise(loadPostReasons, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading SLA Violation...')
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
//         return __('Contact list refreshed','bit-integrations')
//       }
//       setIsLoading(false)
//       return __('Contact list refresh failed. please try again','bit-integrations')
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
    tokenDetails: salesforceConf.tokenDetails
  }
  bitsFetch(campaignRequestParams, 'selesforce_lead_list')
    .then(result => {
      if (result && result.success) {
        setSalesforceConf(oldConf => {
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
        return __('Lead list refreshed', 'bit-integrations')
      }
      setIsLoading(false)
      return __('Lead list refresh failed. please try again', 'bit-integrations')
    })
    .catch(() => setIsLoading(false))
}

export const getAllContactList = (
  formID,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_contact_list').then(result => {
    if (result && result.success) {
      setSalesforceConf(oldConf => {
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
      return __('Contact list refresh successfully.', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Contact list refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Contact list...')
  })
}

export const getAllCustomFields = (
  formID,
  actionName,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const customFieldRequestParams = {
    formID,
    actionName,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }

  const loadPostTypes = bitsFetch(customFieldRequestParams, 'selesforce_custom_field').then(result => {
    if (!result?.success) {
      return result?.data[0]?.message
        ? 'Custom field: ' + result?.data[0]?.message
        : 'Custom field refresh failed. please try again'
    }

    const customFields = result && result.success ? result?.data : []
    setSalesforceConf(prevConf => {
      const draftConf = prevConf
      draftConf['selesforceFields'] = customFields
      draftConf.field_map = generateMappedField(draftConf)

      return draftConf
    })

    setIsLoading(false)
    return 'Custom field refresh successfully.'
  })

  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __(`Loading ${actionName} list...`)
  })
}

export const getAllCustomActionModules = (
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  const customFieldRequestParams = {
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  setIsLoading(true)
  bitsFetch(customFieldRequestParams, 'selesforce_custom_action').then(result => {
    setIsLoading(false)
    setSalesforceConf(prevConf =>
      create(prevConf, draftConf => {
        if (result.success) {
          draftConf['selesforceActionModules'] = [...draftConf.action_modules, ...result?.data]
        }
      })
    )

    toast.success(
      result && result.success
        ? 'Custom Action refresh successfully.'
        : result?.data[0]?.message
          ? 'Custom Action: ' + result?.data[0]?.message
          : 'Custom Action refresh failed. please try again'
    )
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
//         return __('Account list refreshed','bit-integrations')
//       }
//       setIsLoading(false)
//       return __('Account list refresh failed. please try again','bit-integrations')
//     })
//   toast.promise(loadPostTypes, {
//     success: data => data,
//     error: __('Error Occurred', 'bit-integrations'),
//     loading: __('Loading Account list...'),
//   })
// }

export const getAllAccountList = (
  formID,
  salesforceConf,
  setSalesforceConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const campaignRequestParams = {
    formID,
    clientId: salesforceConf.clientId,
    clientSecret: salesforceConf.clientSecret,
    tokenDetails: salesforceConf.tokenDetails
  }
  const loadPostTypes = bitsFetch(campaignRequestParams, 'selesforce_account_list').then(result => {
    if (result && result.success) {
      setSalesforceConf(oldConf => {
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
      return __('Account list refreshed', 'bit-integrations')
    }
    setIsLoading(false)
    return __('Account list refresh failed. please try again', 'bit-integrations')
  })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Account list...')
  })
}

export const checkMappedFields = salesforceConf => {
  const mappedFields = salesforceConf?.field_map
    ? salesforceConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.selesforceField ||
          (!mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []

  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (salesforceConf, actionName) => {
  const fields = salesforceConf?.selesforceFields || []
  const fieldMap = salesforceConf?.field_map || []

  const mappedFieldKeys = fieldMap.reduce((arr, item) => {
    const key = item.selesforceField ?? item.selesforceField
    if (key) arr.push(key)
    return arr
  }, [])
  const unmappedRequiredFields = fields.filter(
    fld => fld.required === true && !mappedFieldKeys.includes(fld.key)
  )

  if (unmappedRequiredFields.length > 0) {
    const requiredMappings = unmappedRequiredFields.map(field => ({
      formField: '',
      selesforceField: field.key
    }))
    fieldMap.push(...requiredMappings)
  } else if (fieldMap.length === 0) {
    fieldMap.push({ formField: '', selesforceField: '' })
  }

  return fieldMap
}

export const handleAuthorize = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __("Client Id can't be empty", 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __("Secret key can't be empty", 'bit-integrations') : ''
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

      if (
        !grantTokenResponse.code ||
        grantTokenResponse.error ||
        !grantTokenResponse ||
        !isauthRedirectLocation
      ) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({
          show: true,
          msg: `${__('Authorization Failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}`
        })
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
  bitsFetch(tokenRequestParams, 'selesforce_generate_token').then(result => {
    if (result && result.success) {
      const newConf = { ...confTmp }
      newConf.tokenDetails = result.data
      setConf(newConf)
      setisAuthorized(true)
      setSnackbar({
        show: true,
        msg: __('Authorized Successfully', 'bit-integrations')
      })
    } else if (
      (result && result.data && result.data.data) ||
      (!result.success && typeof result.data === 'string')
    ) {
      setSnackbar({
        show: true,
        msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`
      })
    } else {
      setSnackbar({
        show: true,
        msg: __('Authorization failed. please try again', 'bit-integrations')
      })
    }
    setIsLoading(false)
  })
}
