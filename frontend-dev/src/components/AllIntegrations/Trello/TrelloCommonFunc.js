import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, trelloConf, setTrelloConf) => {
  const newConf = { ...trelloConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setTrelloConf({ ...newConf })
}

export const fetchAllBoard = (formID, trelloConf, setTrelloConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const fetchBoardModulesRequestParams = {
    formID,
    clientId: trelloConf.clientId,
    accessToken: trelloConf.accessToken,
  }
  bitsFetch(fetchBoardModulesRequestParams, 'trello_fetch_all_board')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...trelloConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.allBoardlist) {
          newConf.default.allBoardlist = result.data.allBoardlist
        }
        // if (result.data.tokenDetails) {
        //   newConf.tokenDetails = result.data.tokenDetails
        // }
        setSnackbar({ show: true, msg: __('Board list refreshed', 'bit-integrations') })
        setTrelloConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Board list refresh failed Cause: %s. please try again', 'bit-integrations'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Board list failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const fetchAllList = (trelloConf, setTrelloConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const fetchListModulesRequestParams = {
    clientId: trelloConf.clientId,
    boardId: trelloConf.boardId,
    accessToken: trelloConf.accessToken,
  }

  bitsFetch(fetchListModulesRequestParams, 'trello_fetch_all_list_Individual_board')

    .then(result => {
      if (result && result.success) {
        const newConf = { ...trelloConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data?.alllists) {
          newConf.default.alllists = result.data.alllists
        }
        setSnackbar({ show: true, msg: __('Board list refreshed', 'bit-integrations') })
        setTrelloConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Board list refresh failed Cause: %s. please try again', 'bit-integrations'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Board list failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
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

export const handleTrelloAuthorize = (integ, ajaxInteg, confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.clientId) {
    setError({ clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '' })
    return
  }
  setIsLoading(true)

  const apiEndpoint = `https://trello.com/1/authorize?expiration=never&name=MyPersonalToken&scope=read,write&response_type=token&key=${confTmp.clientId}&return_url=${encodeURIComponent(window.location.href)}/&response_type=token`

  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitsTrello = localStorage.getItem(`__${integ}`)

      if (bitsTrello) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsTrello)
        localStorage.removeItem(`__${integ}`)

        if (grantTokenResponse.token) {
          grantTokenResponse.code = grantTokenResponse.token
        }
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accessToken = grantTokenResponse.code
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      }
    }
    setIsLoading(false)
  }, 500)
}
export const generateMappedField = (trelloConf) => {
  const requiredFlds = trelloConf?.cardFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', trelloFormField: field.key })) : [{ formField: '', trelloFormField: '' }]
}

export const checkMappedFields = (trelloConf) => {
  const mappedFleld = trelloConf.field_map ? trelloConf.field_map.filter(mapped => (!mapped.formField && !mapped.trelloFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
