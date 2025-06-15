import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import MailRelayActions from './MailRelayActions'
import { mailRelayAuthentication } from './MailRelayCommonFunc'
import MailRelayFieldMap from './MailRelayFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function MailRelayIntegLayout({ formFields, handleInput, mailRelayConf, setMailRelayConf, loading, setLoading, setSnackbar }) {
  const [error, setError] = useState({ name: '', auth_token: '' })
  const [isAuthorized, setIsAuthorized] = useState(false)

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Subscriber Status:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="status" value={mailRelayConf.status} className="btcd-paper-inp w-5">
        <option value="">{__('Select subscriber status', 'bit-integrations')}</option>
        <option value="active">{__('Active', 'bit-integrations')}</option>
        <option value="inactive">{__('Inactive', 'bit-integrations')}</option>
      </select>
      {(loading.customFields) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {mailRelayConf.status && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
              <button
                onClick={() => mailRelayAuthentication(mailRelayConf, setMailRelayConf, setError, setIsAuthorized, loading, setLoading, 'refreshCustomFields')}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh custom fields', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.customFields}
              >
                &#x21BB;
              </button>
            </b>
          </div>
          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('MailRelay Fields', 'bit-integrations')}</b></div>

          </div>

          {mailRelayConf?.field_map.map((itm, i) => (
            <MailRelayFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              mailRelayConf={mailRelayConf}
              formFields={formFields}
              setMailRelayConf={setMailRelayConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mailRelayConf.field_map.length, mailRelayConf, setMailRelayConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <MailRelayActions
            mailRelayConf={mailRelayConf}
            setMailRelayConf={setMailRelayConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}
