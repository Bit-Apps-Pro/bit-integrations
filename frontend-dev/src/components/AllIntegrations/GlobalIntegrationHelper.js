/* eslint-disable no-unused-expressions */

import bitsFetch from "../../Utils/bitsFetch"

export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf.field_map.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }

  newConf.field_map[index].customValue = event.target.value
  setConf({ ...newConf })
}

export const handleAuthData = async (actionName, tokenDetails, userInfo, setAuthData) => {
  const requestParams = {};
  requestParams.actionName = actionName
  requestParams.tokenDetails = tokenDetails
  requestParams.userInfo = userInfo
  await bitsFetch(requestParams, 'store/authData').then((resp) => {
    if (resp.success) {
      if (resp.data.data.length > 0) {
        setAuthData(resp.data.data);
      }
      // setSnackbar({ show: true, msg: 'Authorization Data Fetched Successfully' })
    }
  })
}
