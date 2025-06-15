/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, dropboxConf, setDropboxConf) => {
  const newConf = { ...dropboxConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setDropboxConf({ ...newConf })
}

export const getAllDropboxFolders = (flowID, dropboxConf, setDropboxConf) => {
  const queryParams = {
    flowID: flowID ?? null,
    clientId: dropboxConf.clientId,
    clientSecret: dropboxConf.clientSecret,
    tokenDetails: dropboxConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(queryParams, 'dropbox_get_all_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...dropboxConf }
        if (result.data.dropboxFoldersList) {
          newConf.foldersList = result.data.dropboxFoldersList
          newConf.tokenDetails = result.data.tokenDetails
        }

        setDropboxConf(newConf)
        return 'Dropbox Folders List refreshed successfully'
      } else {
        return 'Dropbox Folders List refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bit-integrations'),
    loading: __('Loading Dropbox Folders List...', 'bit-integrations'),
  })
}

export const handleAuthorize = (confTmp, setConf, setIsAuthorized, setIsLoading, setError) => {
  if (!confTmp.accessCode || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client Id can\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Client Secret can\'t be empty', 'bit-integrations') : '',
      accessCode: !confTmp.accessCode ? __('Access Code can\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)

  const tokenRequestParams = {
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    accessCode: confTmp.accessCode,
  }

  bitsFetch(tokenRequestParams, 'dropbox_authorization')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setIsAuthorized(true)
        toast.success(__('Authorized Successfully', 'bit-integrations'))
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause: ', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bit-integrations'))
      }
      setIsLoading(false)
    })
}
