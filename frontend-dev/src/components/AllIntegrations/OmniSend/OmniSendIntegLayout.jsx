import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useEffect, useRef } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import OmniSendFieldMap from './OmniSendFieldMap'
import OmniSendActions from './OmniSendActions'
import { generateMappedField } from './OmniSendCommonFunc'

export default function OmniSendIntegLayout({ formFields,
  handleInput,
  omniSendConf,
  setOmniSendConf,
  loading,
  setLoading,
  setSnackbar }) {
  const isInitialMount = useRef(true)
  const channels = [
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'SMS',
      value: 'sms',
    },
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
    setOmniSendConf({ ...newConf })
  }
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const newConf = { ...omniSendConf }
      const tmp = generateMappedField(newConf)
      newConf.field_map = tmp
      setOmniSendConf(newConf)
    }
  }, [omniSendConf.channels])

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Channels', 'bit-integrations')}</b>
        <MultiSelect
          className="msl-wrp-options  w-5"
          defaultValue={omniSendConf?.channels}
          options={channels?.map((channel) => ({
            label: channel.label,
            value: channel.value,
          }))}
          onChange={(val) => setChanges(val, 'channels')}
          customValue
        />
      </div>
      <br />
      {omniSendConf.channels.search('email') !== -1 && (
        <div className="flx">
          <b className="wdt-200 d-in-b">
            {__('Email Status:', 'bit-integrations')}
          </b>
          <select
            onChange={handleInput}
            name="email_status"
            value={omniSendConf.email_status}
            className="btcd-paper-inp w-5"
            required
          >
            <option value="">{__('Select Status', 'bit-integrations')}</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="nonSubscribed">nonSubscribed</option>
          </select>
        </div>
      )}
      <br />
      {omniSendConf.channels.search('sms') !== -1 && (
        <div className="flx">
          <b className="wdt-200 d-in-b">
            {__('SMS Status:', 'bit-integrations')}
          </b>
          <select
            onChange={handleInput}
            name="sms_status"
            value={omniSendConf.sms_status}
            className="btcd-paper-inp w-5"
            required
          >
            <option value="">{__('Select Status', 'bit-integrations')}</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="nonSubscribed">nonSubscribed</option>
          </select>
        </div>
      )}

      {(omniSendConf.channels.search('email') !== -1
        || omniSendConf.channels.search('sms') !== -1) && (
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
                  transform: 'scale(0.7)',
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
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() => addFieldMap(
                  omniSendConf.field_map.length,
                  omniSendConf,
                  setOmniSendConf,
                  false,
                )}
                className="icn-btn sh-sm"
                type="button"
              >
                +
              </button>
            </div>
            <br />
            <br />

            <div className="mt-4">
              <b className="wdt-100">{__("Actions", "bit-integrations")}</b>
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
