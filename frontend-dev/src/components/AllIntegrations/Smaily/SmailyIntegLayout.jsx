/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import SmailyActions from './SmailyActions'
import SmailyFieldMap from './SmailyFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function SmailyIntegLayout({ formFields, handleInput, smailyConf, setSmailyConf, loading, setLoading, setSnackbar }) {
  const [error, setError] = useState({ name: '', api_user_name: '' })
  const [isAuthorized, setIsAuthorized] = useState(false)

  return (
    <>
      <br />
      <div>
        <br />
        <div className="mt-5">
          <b className="wdt-100">
            {__('Field Map', 'bit-integrations')}
          </b>
        </div>
        <br />
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
          <div className="txt-dp"><b>{__('Smaily Fields', 'bit-integrations')}</b></div>

        </div>

        {smailyConf?.field_map.map((itm, i) => (
          <SmailyFieldMap
            key={`rp-m-${i + 9}`}
            i={i}
            field={itm}
            smailyConf={smailyConf}
            formFields={formFields}
            setSmailyConf={setSmailyConf}
            setSnackbar={setSnackbar}
          />
        ))}
        <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(smailyConf.field_map.length, smailyConf, setSmailyConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
        <br />
        <br />
        <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
        <div className="btcd-hr mt-1" />
        <SmailyActions
          smailyConf={smailyConf}
          setSmailyConf={setSmailyConf}
          formFields={formFields}
        />
      </div>
    </>
  )
}
