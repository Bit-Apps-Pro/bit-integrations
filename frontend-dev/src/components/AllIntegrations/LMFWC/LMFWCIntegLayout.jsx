/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getAllEvents, getAllSessions } from './LMFWCCommonFunc'
import LMFWCFieldMap from './LMFWCFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'

export default function LMFWCIntegLayout({
  formFields,
  licenseManagerConf,
  setLicenseManagerConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const setChanges = (val, name) => {
    if (name === 'selectedEvent' && val !== '') {
      getAllSessions(licenseManagerConf, setLicenseManagerConf, val, setLoading)
    }

    setLicenseManagerConf((prevConf) => {
      const newConf = { ...prevConf }
      newConf[name] = val

      if (name === 'selectedEvent') {
        delete newConf.selectedSession
        delete newConf.sessions
      }
      return newConf
    })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={licenseManagerConf?.action}
          className="mt-2 w-5"
          onChange={(val) => setChanges(val, 'action')}
          options={licenseManagerConf?.actions?.map((action) => ({
            label: checkIsPro(isPro, action.is_pro)
              ? action.label
              : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {(isLoading || loading.event || loading.session) && (
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

      {licenseManagerConf.actionName && !loading.event && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Event:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                licenseManagerConf?.events &&
                licenseManagerConf.events.map((event) => ({ label: event.name, value: `${event.id}` }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={licenseManagerConf?.selectedEvent}
              onChange={(val) => setChanges(val, 'selectedEvent')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllEvents(licenseManagerConf, setLicenseManagerConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Events', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.event}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {licenseManagerConf.actionName && licenseManagerConf.selectedEvent && !loading.session && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Session:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                licenseManagerConf?.sessions &&
                licenseManagerConf.sessions.map((session) => ({
                  label: session.datetime,
                  value: `${session.date_id}`
                }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={licenseManagerConf?.selectedSession}
              onChange={(val) => setChanges(val, 'selectedSession')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllSessions(licenseManagerConf, setLicenseManagerConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Sessions', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.event}>
              &#x21BB;
            </button>
          </div>
        </>
      )}
      {licenseManagerConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
            <button
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('LMFWC Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {licenseManagerConf?.field_map.map((itm, i) => (
            <LMFWCFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              licenseManagerConf={licenseManagerConf}
              formFields={formFields}
              setLicenseManagerConf={setLicenseManagerConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(licenseManagerConf.field_map.length, licenseManagerConf, setLicenseManagerConf, false)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
        </div>
      )}
    </>
  )
}