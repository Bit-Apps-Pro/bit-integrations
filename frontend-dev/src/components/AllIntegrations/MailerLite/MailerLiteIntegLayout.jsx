import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import MailerLiteFieldMap from './MailerLiteFieldMap'
import MailerLiteActions from './MailerLiteActions'
import {mailerliteRefreshFields } from './MailerLiteCommonFunc'
import { useState } from 'react'

export default function MailerLiteIntegLayout({ formFields, handleInput, mailerLiteConf, setMailerLiteConf, loading, setLoading, setSnackbar }) {
  const [error, setError] = useState({ name: '', auth_token: '' })
  const [isAuthorized, setisAuthorized] = useState(false)


  return (
    <>
      <br />
     
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}
      <button onClick={() => mailerliteRefreshFields(mailerLiteConf, setMailerLiteConf, setError, setisAuthorized,loading, setLoading,'refreshFields')} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Fields"' }} type="button" disabled={loading.field}>&#x21BB;</button>
      </b></div>
      <br />
      {loading.field && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('MailerLite Fields', 'bit-integrations')}</b></div>
  
      </div>

      { mailerLiteConf?.field_map.map((itm, i) => (
        <MailerLiteFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          mailerLiteConf={mailerLiteConf}
          formFields={formFields}
          setMailerLiteConf={setMailerLiteConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mailerLiteConf.field_map.length, mailerLiteConf, setMailerLiteConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />

        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <MailerLiteActions
            mailerLiteConf={mailerLiteConf}
            setMailerLiteConf={setMailerLiteConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </>
   
    </>
  )
}
