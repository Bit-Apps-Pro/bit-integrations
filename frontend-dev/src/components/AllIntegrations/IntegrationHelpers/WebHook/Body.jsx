import React, { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import CloseIcn from '../../../../Icons/CloseIcn'
import TrashIcn from '../../../../Icons/TrashIcn'
import { __ } from '../../../../Utils/i18nwrap'
import Button from '../../../Utilities/Button'
import TableCheckBox from '../../../Utilities/TableCheckBox'
import JsonEditor from '../../../Utilities/jsonEditor/JsonEditor'
import { create } from 'mutative'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../../GlobalStates'
import { SmartTagField } from '../../../../Utils/StaticData/SmartTagField'

function Body({ formFields, webHooks, setWebHooks, isInfo, setTab }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  useEffect(() => {
    const tmpConf = { ...webHooks }
    if (!tmpConf.body) {
      tmpConf.body = { type: '', data: [] }
      tmpConf.body['raw'] = `{ 
        // write here your custom field map 
      }`
      setWebHooks(tmpConf)
    }
    setTab(3)
  }, [])

  const handlePayload = (e, index) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data[index] = { ...tmpConf.body.data[index], [e.target.name]: e.target.value }
    setWebHooks(tmpConf)
  }

  const setFromField = (val, index) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data[index] = { ...tmpConf.body.data[index], value: val }
    setWebHooks(tmpConf)
  }
  const addParam = () => {
    const tmpConf = { ...webHooks }
    if (!tmpConf.body.data || !Array.isArray(tmpConf.body.data)) {
      tmpConf.body.data = []
    }
    tmpConf.body.data.push({})
    setWebHooks(tmpConf)
  }
  const delParam = (id) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data.splice(id, 1)
    setWebHooks(tmpConf)
  }
  const handleContentType = (e) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.type = e.target.value

    if (e.target.value !== 'raw') {
      tmpConf.body.data = tmpConf?.body?.send_all_data ? getFormatedData() : []
    }
    setWebHooks(tmpConf)
  }
  const getFormatedData = () => {
    const data = []
    formFields.map(({ name }) => {
      // tmpConf.body.data[index] = { ...tmpConf.body.data[index], value: val }
      data.push({ key: name, value: `\${${name}}` })
    })
    return data
  }
  const actionHandler = (e) => {
    const newConf = { ...webHooks }
    // {key: 'vxcv', value: '${display_name}'}
    const formatedData = getFormatedData()
    if (e.target.checked) {
      newConf.body.send_all_data = true
      newConf.body.data = formatedData
    } else {
      delete newConf?.body?.data
      delete newConf?.body?.send_all_data
    }
    setWebHooks({ ...newConf })
  }
  const setJsonCustomBody = data => {
    setWebHooks(prevConf => create(prevConf, draftConf => {
      draftConf.body.raw = data
    }))
  }

  return (
    <div className="mt-2">
      <TableCheckBox isInfo={isInfo} checked={webHooks?.body?.send_all_data || false} onChange={actionHandler} className="wdt-200 mt-4 mr-2 mb-2" value="Send All Data" title={__('Send All Data', 'bit-integrations')} />
      <div className="f-m mt-1 mb-2">{__('Add Request Payload', 'bit-integrations')}</div>
      <select name="method" onChange={handleContentType} defaultValue={webHooks?.body?.type} className="btcd-paper-inp w-6" disabled={isInfo}>
        <option>-- Select Content-Type --</option>
        <option value="application/json">application/json</option>
        <option value="multipart/form-data">multipart/form-data</option>
        <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
        <option value="raw">raw (JSON)</option>
      </select>
      {webHooks?.body?.type === 'raw' ?
        <JsonEditor data={webHooks?.body?.raw || webHooks.body?.data} onChange={setJsonCustomBody} formFields={formFields} />
        : <div className="btcd-param-t-wrp mt-1">
          <div className="btcd-param-t">
            <div className="tr">
              <div className="td">{__('Key', 'bit-integrations')}</div>
              <div className="td">{__('Value', 'bit-integrations')}</div>
            </div>
            {Array.isArray(webHooks.body?.data) && webHooks.body?.data?.map((itm, childindx) => (
              <div className="tr" key={`fu-1${childindx * 3}`}>
                <div className="td">
                  <input className="btcd-paper-inp p-i-sm" onChange={e => handlePayload(e, childindx)} name="key" type="text" value={itm.key} disabled={isInfo} />
                </div>
                <div className="td">
                  <input className="btcd-paper-inp p-i-sm" onChange={e => handlePayload(e, childindx)} name="value" type="text" value={itm.value} disabled={isInfo} />
                </div>
                {!isInfo && (
                  <div className="flx p-atn">
                    <Button onClick={() => delParam(childindx)} icn><TrashIcn size={16} /></Button>
                    <select className="btcd-paper-inp mr-2" name="formField" value={itm.value || ''} onChange={(ev) => setFromField(ev.target.value, childindx)}>
                      <option value="">{__('Select Field', 'bit-integrations')}</option>
                      <optgroup label="Form Fields">
                        {
                          formFields?.map(f => (
                            <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                              {f.label}
                            </option>
                          ))
                        }
                      </optgroup>
                      <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                        {isPro && SmartTagField?.map(f => (
                          <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                            {f.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                )}
              </div>
            ))}
            {!isInfo && (
              <Button onClick={() => addParam(webHooks, setWebHooks)} className="add-pram" icn><CloseIcn size="14" className="icn-rotate-45" /></Button>
            )}
          </div>
        </div>
      }
    </div >
  )
}

export default Body
