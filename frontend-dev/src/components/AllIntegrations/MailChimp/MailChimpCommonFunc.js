import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

export const handleInput = (
  e,
  mailChimpConf,
  setMailChimpConf,
  formID,
  loading,
  setLoading,
  setSnackbar,
  setIsLoading,
  isNew,
  error,
  setError
) => {
  setMailChimpConf((prevConf) =>
    create(prevConf, (draftConf) => {
      if (isNew) {
        const rmError = { ...error }
        rmError[e.target.name] = ''
        setError({ ...rmError })
      }
      draftConf[e.target.name] = e.target.value
      if (e.target.name === 'module' && e.target.value) {
        refreshAudience(formID, mailChimpConf, setMailChimpConf, setIsLoading, setSnackbar)
      }

      if (
        (e.target.name === 'listId' && e.target.value) ||
        (e.target.name === 'module' && e.target.value === 'add_a_member_to_an_audience')
      ) {
        refreshTags(formID, draftConf, setMailChimpConf, setSnackbar, loading, setLoading)
        refreshFields(formID, draftConf, setMailChimpConf, setSnackbar, loading, setLoading)
      } else if (!e.target.value) {
        draftConf.field_map = [{ formField: '', mailChimpField: '' }]
      }
    })
  )
}

export const checkAddressFieldMapRequired = (mailChimpConf) => {
  const requiredFleld = mailChimpConf?.address_field
    ? mailChimpConf.address_field.filter(
        (field) => !field.formField && field.mailChimpAddressField && field.required
      )
    : []
  if (requiredFleld.length > 0) {
    return false
  }
  return true
}

export const refreshModules = (setMailChimpConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'mChimp_refresh_modules')
    .then((result) => {
      if (result && result.success) {
        setMailChimpConf((prevConf) =>
          create(prevConf, (draftConf) => {
            draftConf.moduleLists = result.data
          })
        )
        setSnackbar({
          show: true,
          msg: __('Module list refreshed', 'bit-integrations')
        })
        // setMailChimpConf({ ...newConf });
      } else {
        setSnackbar({
          show: true,
          msg: __('Module Not Found!', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch((e) => setIsLoading(false))
}

export const refreshAudience = (
  formID,
  mailChimpConf,
  setMailChimpConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true)
  const refreshModulesRequestParams = {
    formID,
    clientId: mailChimpConf.clientId,
    clientSecret: mailChimpConf.clientSecret,
    tokenDetails: mailChimpConf.tokenDetails
  }
  bitsFetch(refreshModulesRequestParams, 'mChimp_refresh_audience')
    .then((result) => {
      if (result && result.success) {
        setMailChimpConf((prevConf) =>
          create(prevConf, (draftConf) => {
            if (!draftConf.default) {
              draftConf.default = {}
            }
            if (result.data.audiencelist) {
              draftConf.default.audiencelist = result.data.audiencelist
            }
            if (result.data.tokenDetails) {
              draftConf.tokenDetails = result.data.tokenDetails
            }
          })
        )
        setSnackbar({
          show: true,
          msg: __('Audience list refreshed', 'bit-integrations')
        })
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('Audience list refresh failed Cause: %s. please try again', 'bit-integrations'),
            result.data.data || result.data
          )
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Audience list failed. please try again', 'bit-integrations')
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshTags = (
  formID,
  mailChimpConf,
  setMailChimpConf,
  setSnackbar,
  loading,
  setLoading
) => {
  setLoading({ ...loading, tags: true })
  const refreshModulesRequestParams = {
    formID,
    clientId: mailChimpConf.clientId,
    clientSecret: mailChimpConf.clientSecret,
    tokenDetails: mailChimpConf.tokenDetails,
    listId: mailChimpConf.listId
  }
  bitsFetch(refreshModulesRequestParams, 'mChimp_refresh_tags')
    .then((result) => {
      if (result && result.success) {
        setMailChimpConf((prevConf) =>
          create(prevConf, (draftConf) => {
            if (result.data.audienceTags) {
              draftConf.default.audienceTags = result.data.audienceTags
            }
            setSnackbar({
              show: true,
              msg: __('Audience tags refreshed', 'bit-integrations')
            })
          })
        )
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === 'string')
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __('Audience tags refresh failed Cause: %s. please try again', 'bit-integrations'),
            result.data.data || result.data
          )
        })
      } else {
        setSnackbar({
          show: true,
          msg: __('Audience tags failed. please try again', 'bit-integrations')
        })
      }
      setLoading({ ...loading, tags: false })
    })
    .catch(() => setLoading({ ...loading, tags: false }))
}

export const refreshFields = (
  formID,
  mailChimpConf,
  setMailChimpConf,
  setSnackbar,
  loading,
  setLoading
) => {
  const { listId } = mailChimpConf
  if (!listId) {
    return
  }

  setLoading({ ...loading, refreshFields: true })
  const refreshSpreadsheetsRequestParams = {
    formID,
    listId,
    module: mailChimpConf?.module,
    clientId: mailChimpConf.clientId,
    clientSecret: mailChimpConf.clientSecret,
    tokenDetails: mailChimpConf.tokenDetails
  }
  bitsFetch(refreshSpreadsheetsRequestParams, 'mChimp_refresh_fields')
    .then((result) => {
      if (result && result.success) {
        setMailChimpConf((prevConf) =>
          create(prevConf, (draftConf) => {
            if (result.data.audienceField) {
              if (!draftConf.default.fields) {
                draftConf.default.fields = {}
              }
              draftConf.default.fields[listId] = result.data.audienceField
              draftConf.field_map = generateMappedField(result.data.audienceField)
            }

            if (result.data.tokenDetails) {
              draftConf.tokenDetails = result.data.tokenDetails
            }
            setSnackbar({
              show: true,
              msg: __('Fields refreshed', 'bit-integrations')
            })
          })
        )
      } else {
        setSnackbar({
          show: true,
          msg: __('Fields refresh failed. please try again', 'bit-integrations')
        })
      }

      setLoading({ ...loading, refreshFields: false })
    })
    .catch(() => setLoading({ ...loading, refreshFields: false }))
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}`, '').split('&')
  if (queryParams) {
    queryParams.forEach((element) => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleMailChimpAuthorize = (
  integ,
  ajaxInteg,
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

  const apiEndpoint = `https://login.mailchimp.com/oauth2/authorize?client_id=${
    confTmp.clientId
  }&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code`
  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitsMailChimp = localStorage.getItem(`__${integ}`)
      if (bitsMailChimp) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsMailChimp)
        localStorage.removeItem(`__${integ}`)
        if (grantTokenResponse.code.search('#')) {
          const [code] = grantTokenResponse.code.split('#')
          grantTokenResponse.code = code
        }
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
          msg: `${__(
            'Authorization failed',
            'bit-integrations'
          )} ${errorCause}. ${__('please try again', 'bit-integrations')}`
        })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(
          ajaxInteg,
          grantTokenResponse,
          newConf,
          setConf,
          setisAuthorized,
          setIsLoading,
          setSnackbar
        )
      }
    }
  }, 500)
}

const tokenHelper = (
  ajaxInteg,
  grantToken,
  confTmp,
  setConf,
  setisAuthorized,
  setIsLoading,
  setSnackbar
) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = window.location.href

  bitsFetch(tokenRequestParams, `${ajaxInteg}_generate_token`)
    .then((result) => result)
    .then((result) => {
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
          msg: `${__('Authorization failed Cause:', 'bit-integrations')}${
            result.data.data || result.data
          }. ${__('please try again', 'bit-integrations')}`
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

export const checkMappedFields = (mailChimpConf) => {
  const mappedFleld = mailChimpConf.field_map
    ? mailChimpConf.field_map.filter((mapped) => !mapped.formField || !mapped.mailChimpField)
    : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}

export const generateMappedField = (fields) => {
  const requiredFlds = fields && Object.values(fields).filter((fld) => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: '',
        mailChimpField: field.tag
      }))
    : [{ formField: '', mailChimpField: '' }]
}
