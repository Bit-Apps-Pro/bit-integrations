import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import MailerLiteFieldMap from './MailerLiteFieldMap'
import MailerLiteActions from './MailerLiteActions'
import { mailerliteRefreshFields } from './MailerLiteCommonFunc'
import { useState } from 'react'
import Note from '../../Utilities/Note'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { getProLabel } from '../../Utilities/ProUtilHelpers'

export default function MailerLiteIntegLayout({
  formFields,
  handleInput,
  mailerLiteConf,
  setMailerLiteConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="action"
        value={mailerLiteConf?.action}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="add_subscriber" data-action_name="add_subscriber">
          {__('Add Subscriber', 'bit-integrations')}
        </option>
        <option
          value="delete_subscriber"
          data-action_name="delete_subscriber"
          disabled={mailerLiteConf.mailer_lite_type === 'v1' || !isPro}>
          {isPro
            ? __('Delete subscriber', 'bit-integrations')
            : getProLabel(__('Delete subscriber', 'bit-integrations'))}
        </option>
        <option
          value="forget_subscriber"
          data-action_name="forget_subscriber"
          disabled={mailerLiteConf.mailer_lite_type === 'v1' || !isPro}>
          {isPro
            ? __('Forget subscriber', 'bit-integrations')
            : getProLabel(__('Forget subscriber', 'bit-integrations'))}
        </option>
      </select>

      {loading.field && (
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

      {mailerLiteConf?.action && !loading?.field && (
        <>
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
              <button
                onClick={() =>
                  mailerliteRefreshFields(mailerLiteConf, setMailerLiteConf, loading, setLoading)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': '"Refresh Fields"' }}
                type="button"
                disabled={loading.field}>
                &#x21BB;
              </button>
            </b>
          </div>
          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('MailerLite Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {mailerLiteConf?.field_map.map((itm, i) => (
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
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(mailerLiteConf.field_map.length, mailerLiteConf, setMailerLiteConf, false)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
        </>
      )}

      {mailerLiteConf?.action && mailerLiteConf?.action !== 'add_subscriber' && <Note note={note} />}

      {mailerLiteConf?.action && mailerLiteConf?.action === 'add_subscriber' && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <MailerLiteActions
            mailerLiteConf={mailerLiteConf}
            setMailerLiteConf={setMailerLiteConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  )
}

const note = `
    <p>${__('This action requires a MailerLite New account. It isn’t supported with Classic accounts.', 'bit-integrations')}</p>
  `
