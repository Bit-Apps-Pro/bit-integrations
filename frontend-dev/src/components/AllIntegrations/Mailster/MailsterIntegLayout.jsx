/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import MailsterActions from './MailsterActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import MailsterFieldMap from './MailsterFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { mailsterFields } from './MailsterCommonFunc'

export default function MailsterIntegLayout({
  formFields,
  mailsterConf,
  setMailsterConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const [error, setError] = useState({ name: '', auth_token: '' })
  const [isAuthorized, setIsAuthorized] = useState(false)

  const setChanges = (val) => {
    const newConf = { ...mailsterConf }
    newConf.selectedLists = val
    setMailsterConf({ ...newConf })
  }

  return (
    <>
      <div>
        <br />
        <div className="mt-5">
          <b className="wdt-100">
            {__('Field Map', 'bit-integrations')}
            <button
              onClick={() => mailsterFields(mailsterConf, setMailsterConf, loading, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.customFields}
            >
              &#x21BB;
            </button>
          </b>
        </div>
        {loading.fields && (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
              transform: 'scale(0.7)'
            }}
          />
        )}
        <br />
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp">
            <b>{__('Form Fields', 'bit-integrations')}</b>
          </div>
          <div className="txt-dp">
            <b>{__('Mailster Fields', 'bit-integrations')}</b>
          </div>
        </div>
        {mailsterConf.mailsterFields.length > 0 && (
          <>
            {mailsterConf?.field_map.map((itm, i) => (
              <MailsterFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                mailsterConf={mailsterConf}
                formFields={formFields}
                setMailsterConf={setMailsterConf}
                setSnackbar={setSnackbar}
              />
            ))}
            <div>
              <div className="txt-center btcbi-field-map-button mt-2">
                <button
                  onClick={() =>
                    addFieldMap(mailsterConf.field_map.length, mailsterConf, setMailsterConf, false)
                  }
                  className="icn-btn sh-sm"
                  type="button"
                >
                  +
                </button>
              </div>
              <br />
              <br />
              <div className="mt-4">
                <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <MailsterActions
                mailsterConf={mailsterConf}
                setMailsterConf={setMailsterConf}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
