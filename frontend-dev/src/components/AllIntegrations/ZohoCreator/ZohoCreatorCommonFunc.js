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
  localStorage.setItem('__zohoCreator', JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __('Data center cann\'t be empty', 'bit-integrations') : '',
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  const scopes = 'ZohoCreator.dashboard.READ,ZohoCreator.meta.application.READ,ZohoCreator.meta.form.READ,ZohoCreator.form.CREATE,ZohoCreator.report.CREATE,ZohoCreator.report.UPDATE'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&redirect_uri=${encodeURIComponent(window.location.href)}/redirect`
  const authWindow = window.open(apiEndpoint, 'zohoCreator', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__zohoCreator')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__zohoCreator')
      }
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
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${encodeURIComponent(window.location.href)}/redirect`
  bitsFetch(tokenRequestParams, 'zcreator_generate_token')
    .then(result => result)
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

export const handleInput = (e, creatorConf, setCreatorConf, formID, setIsLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...creatorConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'applicationId':
      newConf = applicationChange(newConf, formID, setCreatorConf, setIsLoading, setSnackbar)
      break
    case 'formId':
      newConf = formChange(newConf, formID, setCreatorConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setCreatorConf({ ...newConf })
}

export const applicationChange = (creatorConf, formID, setCreatorConf, setIsLoading, setSnackbar) => {
  const newConf = { ...creatorConf }
  newConf.department = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  newConf.actions = {}

  if (!newConf?.default?.forms?.[newConf.applicationId]) {
    refreshForms(formID, newConf, setCreatorConf, setIsLoading, setSnackbar)
  }
  return newConf
}

export const formChange = (creatorConf, formID, setCreatorConf, setIsLoading, setSnackbar) => {
  const newConf = { ...creatorConf }
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  newConf.upload_field_map = [{ formField: '', zohoFormField: '' }]
  newConf.actions = {}

  if (!newConf?.default?.fields?.[newConf.orgId]) {
    refreshFields(formID, newConf, setCreatorConf, setIsLoading, setSnackbar)
  } else {
    newConf.field_map = generateMappedField(newConf)
    if (Object.keys(newConf.default.fields[newConf.applicationId][newConf.formId].fileUploadFields).length > 0) {
      newConf.upload_field_map = generateMappedField(newConf, true)
    }
  }
  return newConf
}

export const refreshApplications = (formID, creatorConf, setCreatorConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const refreshApplicationsRequestParams = {
    formID,
    id: creatorConf.id,
    dataCenter: creatorConf.dataCenter,
    clientId: creatorConf.clientId,
    clientSecret: creatorConf.clientSecret,
    tokenDetails: creatorConf.tokenDetails,
  }
  bitsFetch(refreshApplicationsRequestParams, 'zcreator_refresh_applications')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...creatorConf }
        if (result.data.applications) {
          newConf.default = { ...newConf.default, applications: result.data.applications }
        }
        setSnackbar({ show: true, msg: __('Applications refreshed', 'bit-integrations') })
        setCreatorConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Applications refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Applications refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshForms = (formID, creatorConf, setCreatorConf, setIsLoading, setSnackbar) => {
  const { accountOwner, applicationId } = creatorConf
  setIsLoading(true)
  const refreshFormsRequestParams = {
    formID,
    id: creatorConf.id,
    dataCenter: creatorConf.dataCenter,
    clientId: creatorConf.clientId,
    clientSecret: creatorConf.clientSecret,
    tokenDetails: creatorConf.tokenDetails,
    accountOwner,
    applicationId,
  }
  bitsFetch(refreshFormsRequestParams, 'zcreator_refresh_forms')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...creatorConf }
        if (!newConf.default.forms) {
          newConf.default.forms = {}
        }
        if (result.data.forms) {
          newConf.default.forms[applicationId] = result.data.forms
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Forms refreshed', 'bit-integrations') })
        setCreatorConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Forms refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Forms refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshFields = (formID, creatorConf, setCreatorConf, setIsLoading, setSnackbar) => {
  const { accountOwner, applicationId, formId } = creatorConf
  setIsLoading(true)
  const refreshFieldsRequestParams = {
    formID,
    dataCenter: creatorConf.dataCenter,
    clientId: creatorConf.clientId,
    clientSecret: creatorConf.clientSecret,
    tokenDetails: creatorConf.tokenDetails,
    accountOwner,
    applicationId,
    formId,
  }
  bitsFetch(refreshFieldsRequestParams, 'zcreator_refresh_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...creatorConf }
        if (result.data.fields) {
          if (!newConf.default.fields) {
            newConf.default.fields = {}
          }
          if (!newConf.default.fields[applicationId]) {
            newConf.default.fields[applicationId] = {}
          }
          newConf.default.fields[applicationId][formId] = { ...result.data }
          newConf.field_map = generateMappedField(newConf)
          if (Object.keys(result.data.fileUploadFields).length > 0) {
            newConf.upload_field_map = generateMappedField(newConf, true)
          }
          if (result.data.tokenDetails) {
            newConf.tokenDetails = result.data.tokenDetails
          }
          setSnackbar({ show: true, msg: __('Fields refreshed', 'bit-integrations') })
        } else {
          setSnackbar({ show: true, msg: `${__('Fields refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setCreatorConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Fields refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const generateMappedField = (creatorConf, uploadFields) => {
  const { applicationId, formId } = creatorConf
  if (uploadFields) {
    return creatorConf.default.fields[applicationId][formId].requiredFileUploadFields.length > 0 ? creatorConf.default.fields[applicationId][formId].requiredFileUploadFields.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }]
  }
  return creatorConf.default.fields[applicationId][formId].required.length > 0 ? creatorConf.default.fields[applicationId][formId].required.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }]
}

export const checkMappedFields = creatorConf => {
  const mappedFields = creatorConf?.field_map ? creatorConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && creatorConf?.default?.fields?.[creatorConf.applicationId]?.[creatorConf.formId]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
  const mappedUploadFields = creatorConf?.upload_field_map ? creatorConf.upload_field_map.filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && creatorConf?.default?.fields?.[creatorConf.applicationId]?.[creatorConf.formId]?.requiredFileUploadFields.indexOf(mappedField.zohoFormField) !== -1)) : []
  if (mappedFields.length > 0 || mappedUploadFields.length > 0) {
    return false
  }
  return true
}
