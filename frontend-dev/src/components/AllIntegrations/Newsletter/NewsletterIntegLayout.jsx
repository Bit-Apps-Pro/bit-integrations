/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import NewsletterActions from './NewsletterActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import NewsletterFieldMap from './NewsletterFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function NewsletterIntegLayout({
  formFields,
  newsletterConf,
  setNewsletterConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const [error, setError] = useState({ name: '', auth_token: '' })
  const [isAuthorized, setIsAuthorized] = useState(false)

  const setChanges = (val) => {
    const newConf = { ...newsletterConf }
    newConf.selectedLists = val
    setNewsletterConf({ ...newConf })
  }

  return (
    <>
      <div>
        <br />
        <div className="mt-5">
          <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
        </div>
        <br />
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp">
            <b>{__('Form Fields', 'bit-integrations')}</b>
          </div>
          <div className="txt-dp">
            <b>{__('Newsletter Fields', 'bit-integrations')}</b>
          </div>
        </div>

        {newsletterConf?.field_map.map((itm, i) => (
          <NewsletterFieldMap
            key={`rp-m-${i + 9}`}
            i={i}
            field={itm}
            newsletterConf={newsletterConf}
            formFields={formFields}
            setNewsletterConf={setNewsletterConf}
            setSnackbar={setSnackbar}
          />
        ))}
        <div>
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(
                  newsletterConf.field_map.length,
                  newsletterConf,
                  setNewsletterConf,
                  false
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <NewsletterActions
            newsletterConf={newsletterConf}
            setNewsletterConf={setNewsletterConf}
          />
        </div>
      </div>
    </>
  )
}
