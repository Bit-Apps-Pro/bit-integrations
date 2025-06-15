import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const saveIntegConfig = async (flow, setFlow, allIntegURL, confTmp, navigate, index, edit) => {
  let action = 'flow/save'
  const data = {
    name: confTmp.name,
    trigger: flow.triggered_entity,
    triggered_entity_id: flow?.triggerData?.formID ? flow.triggerData.formID : (flow.triggered_entity_id || 0),
    flow_details: confTmp,
  }
  if (flow.id) {
    data.id = flow.id
  }
  if (flow.triggered_entity === 'Webhook') {
    data.flow_details.fields = flow.triggerDetail.data
  }
  if (edit) {
    action = 'flow/update'
    // integs[index] = { ...allintegs[index], ...confTmp }
  }
  try {
    const res = await bitsFetch(data, action)
    if (res.success) {
      navigate(allIntegURL)
    }
    return res
  } catch (e) {
    return __('Failed to save integration', 'bit-integrations')
  }
}

export const setGrantTokenResponse = (integ) => {
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
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}

export const addFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    uploadFields ? newConf.relatedlists[tab - 1].upload_field_map.splice(i, 0, {}) : newConf.relatedlists[tab - 1].field_map.splice(i, 0, {})
  } else {
    uploadFields ? newConf.upload_field_map.splice(i, 0, {}) : newConf.field_map.splice(i, 0, {})
  }

  setConf({ ...newConf })
}

export const addContactFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }

  newConf.field_map_contact.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    if (uploadFields) {
      if (newConf.relatedlists[tab - 1].upload_field_map.length > 1) {
        newConf.relatedlists[tab - 1].upload_field_map.splice(i, 1)
      }
    } else if (newConf.relatedlists[tab - 1].field_map.length > 1) {
      newConf.relatedlists[tab - 1].field_map.splice(i, 1)
    }
  } else if (uploadFields) {
    if (newConf.upload_field_map.length > 1) {
      newConf.upload_field_map.splice(i, 1)
    }
  } else if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const delContactFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.field_map_contact.length > 1) {
    newConf.field_map_contact.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, uploadFields, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    if (uploadFields) newConf.relatedlists[tab - 1].upload_field_map[index][event.target.name] = event.target.value
    else newConf.relatedlists[tab - 1].field_map[index][event.target.name] = event.target.value
  } else if (uploadFields) newConf.upload_field_map[index][event.target.name] = event.target.value
  else newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    if (tab) {
      newConf.relatedlists[tab - 1].field_map[index].customValue = ''
    } else newConf.field_map[index].customValue = ''
  }

  setConf({ ...newConf })
}
