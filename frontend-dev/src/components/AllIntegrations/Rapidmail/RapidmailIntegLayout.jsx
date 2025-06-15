import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import { getAllRecipient } from './RapidmailCommonFunc'
import RapidmailFieldMap from './RapidmailFieldMap'
import RapidmailActions from './RapidmailActions'

export default function RapidmailIntegLayout({ formFields, handleInput, rapidmailConf, setRapidmailConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Recipient:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="recipient_id" value={rapidmailConf.recipient_id} className="btcd-paper-inp w-5">
        <option value="">{__('Select Recipients', 'bit-integrations')}</option>
        {
          rapidmailConf?.default?.recipientlists && rapidmailConf.default.recipientlists.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))
        }
      </select>
      <button onClick={() => getAllRecipient(rapidmailConf, setRapidmailConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Rapidmail Fields', 'bit-integrations')}</b></div>
      </div>

      {rapidmailConf?.recipient_id && rapidmailConf?.field_map.map((itm, i) => (
        <RapidmailFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          rapidmailConf={rapidmailConf}
          formFields={formFields}
          setRapidmailConf={setRapidmailConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(rapidmailConf.field_map.length, rapidmailConf, setRapidmailConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <RapidmailActions
        rapidmailConf={rapidmailConf}
        setRapidmailConf={setRapidmailConf}
      />
    </>
  )
}
