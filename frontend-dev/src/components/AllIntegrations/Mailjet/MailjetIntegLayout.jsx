/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import MailjetActions from './MailjetActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getCustomFields, mailjetAuthentication } from './MailjetCommonFunc'
import MailjetFieldMap from './MailjetFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function MailjetIntegLayout({ formFields, mailjetConf, setMailjetConf, loading, setLoading, setSnackbar }) {
  const [error, setError] = useState({ name: '', auth_token: '' })
  const [isAuthorized, setIsAuthorized] = useState(false)

  const setChanges = (val) => {
    const newConf = { ...mailjetConf }
    newConf.selectedLists = val
    setMailjetConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx mt-2">
        <b className="wdt-200 d-in-b">{__('Select Lists:', 'bit-integrations')}</b>
        <MultiSelect
          options={mailjetConf?.lists?.map(list => ({ label: list.name, value: list.id }))}
          className="msl-wrp-options"
          defaultValue={mailjetConf?.selectedLists}
          onChange={val => setChanges(val)}
        />
        <button onClick={() => mailjetAuthentication(mailjetConf, setMailjetConf, setError, setIsAuthorized, loading, setLoading, 'refreshLists')} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Groups', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
      </div>
      {(loading.lists) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <div>
        <br />
        <div className="mt-5">
          <b className="wdt-100">
            {__('Field Map', 'bit-integrations')}
            <button
              onClick={() => getCustomFields(mailjetConf, setMailjetConf, setLoading)}
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
          <div className="txt-dp"><b>{__('Mailjet Fields', 'bit-integrations')}</b></div>
        </div>

        {mailjetConf?.selectedLists && mailjetConf?.field_map.map((itm, i) => (
          <MailjetFieldMap
            key={`rp-m-${i + 9}`}
            i={i}
            field={itm}
            mailjetConf={mailjetConf}
            formFields={formFields}
            setMailjetConf={setMailjetConf}
            setSnackbar={setSnackbar}
          />
        ))}
        {mailjetConf?.selectedLists && (
          <div>
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mailjetConf.field_map.length, mailjetConf, setMailjetConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <MailjetActions
              mailjetConf={mailjetConf}
              setMailjetConf={setMailjetConf}
            />
          </div>
        )}
      </div>
    </>
  )
}
