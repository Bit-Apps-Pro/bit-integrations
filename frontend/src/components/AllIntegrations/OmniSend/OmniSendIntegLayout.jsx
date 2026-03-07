import { useEffect, useRef } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ActionProFeatureComponent from '../IntegrationHelpers/ActionProFeatureComponent'
import { ProFeatureTitle } from '../IntegrationHelpers/ActionProFeatureLabels'
import { addFieldMap } from './IntegrationHelpers'
import OmniSendActions from './OmniSendActions'
import { generateMappedField } from './OmniSendCommonFunc'
import OmniSendFieldMap from './OmniSendFieldMap'

export default function OmniSendIntegLayout({
  formFields,
  handleInput,
  omniSendConf,
  setOmniSendConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const channels = [
    {
      label: __('Email', 'bit-integrations'),
      value: 'email'
    },
    {
      label: __('SMS', 'bit-integrations'),
      value: 'sms'
    }
  ]

  const setChanges = (val, type) => {
    const email = val.search('email')
    const sms = val.search('sms')
    const newConf = { ...omniSendConf }
    const fields = newConf.omniSend_fields

    if (val.length) {
      newConf.actions.channel = true
      if (email !== -1 && sms !== -1) {
        fields[0].required = true
        fields[1].required = true
      } else if (email !== -1) {
        fields[0].required = true
        fields[1].required = false
      } else if (sms !== -1) {
        fields[1].required = true
        fields[0].required = false
      } else {
        fields[0].required = false
        fields[1].required = false
      }
    } else {
      delete newConf.actions.channel
      fields[0].required = false
      fields[1].required = false
    }
    newConf[type] = val
    newConf.field_map = generateMappedField(newConf.omniSend_fields)

    setOmniSendConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Channels', 'bit-integrations')}</b>
        <MultiSelect
          className="msl-wrp-options  w-5"
          defaultValue={omniSendConf?.channels}
          options={channels?.map(channel => ({
            label: channel.label,
            value: channel.value
          }))}
          onChange={val => setChanges(val, 'channels')}
          customValue
        />
      </div>
      <br />
      {omniSendConf.channels.search('email') !== -1 && (
        <div className="flx">
          <b className="wdt-200 d-in-b">{__('Email Status:', 'bit-integrations')}</b>
          <select
            onChange={handleInput}
            name="email_status"
            value={omniSendConf.email_status}
            className="btcd-paper-inp w-5"
            required>
            <option value="">{__('Select Status', 'bit-integrations')}</option>
            <option value="subscribed">{__('Subscribed', 'bit-integrations')}</option>
            <option value="unsubscribed">{__('Unsubscribed', 'bit-integrations')}</option>
            <option value="nonSubscribed">{__('nonSubscribed', 'bit-integrations')}</option>
          </select>
        </div>
      )}
      <br />
      {omniSendConf.channels.search('sms') !== -1 && (
        <div className="flx">
          <b className="wdt-200 d-in-b">{__('SMS Status:', 'bit-integrations')}</b>
          <select
            onChange={handleInput}
            name="sms_status"
            value={omniSendConf.sms_status}
            className="btcd-paper-inp w-5"
            required>
            <option value="">{__('Select Status', 'bit-integrations')}</option>
            <option value="subscribed">{__('Subscribed', 'bit-integrations')}</option>
            <option value="unsubscribed">{__('Unsubscribed', 'bit-integrations')}</option>
            <option value="nonSubscribed">{__('nonSubscribed', 'bit-integrations')}</option>
          </select>
        </div>
      )}

      {(omniSendConf.channels.search('email') !== -1 || omniSendConf.channels.search('sms') !== -1) && (
        <>
          <br />
          <div className="mt-5">
            <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
          </div>
          <br />

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
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('OmniSend Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {omniSendConf?.field_map.map((itm, i) => (
            <OmniSendFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              omniSendConf={omniSendConf}
              formFields={formFields}
              setOmniSendConf={setOmniSendConf}
              setSnackbar={setSnackbar}
              type="field_map"
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(omniSendConf.field_map.length, omniSendConf, setOmniSendConf, 'field_map')
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />

          <ActionProFeatureComponent title={__('Custom Properties', 'bit-integrations')}>
            <b className="wdt-100">
              {<ProFeatureTitle title={__('Custom Properties', 'bit-integrations')} />}
            </b>
            <div className="btcd-hr mt-2 mb-4" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp">
                <b>{__('Form Fields', 'bit-integrations')}</b>
              </div>
              <div className="txt-dp">
                <b>{__('OmniSend Property name', 'bit-integrations')}</b>
              </div>
            </div>
            {omniSendConf?.custom_field_map?.map((itm, i) => (
              <OmniSendFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                omniSendConf={omniSendConf}
                formFields={formFields}
                setOmniSendConf={setOmniSendConf}
                setSnackbar={setSnackbar}
                type="custom_field_map"
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(
                    omniSendConf?.custom_field_map?.length,
                    omniSendConf,
                    setOmniSendConf,
                    'custom_field_map'
                  )
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
          </ActionProFeatureComponent>

          <div className="mt-4">
            <b className="wdt-100">{__('Actions', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <OmniSendActions
            omniSendConf={omniSendConf}
            setOmniSendConf={setOmniSendConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  )
}
