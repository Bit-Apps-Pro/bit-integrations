/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getAllEvents, getAllSessions } from './BentoCommonFunc'
import BentoFieldMap from './BentoFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function BentoIntegLayout({
  formFields,
  bentoConf,
  setBentoConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const setChanges = (val, name) => {
    if (name === 'selectedEvent' && val !== '') {
      getAllSessions(bentoConf, setBentoConf, val, setLoading)
    }

    setBentoConf(prevConf => {
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

      {bentoConf.actionName && !loading.event && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Event:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                bentoConf?.events &&
                bentoConf.events.map(event => ({ label: event.name, value: `${event.id}` }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={bentoConf?.selectedEvent}
              onChange={val => setChanges(val, 'selectedEvent')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllEvents(bentoConf, setBentoConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Events', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.event}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {bentoConf.actionName && bentoConf.selectedEvent && !loading.session && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Session:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                bentoConf?.sessions &&
                bentoConf.sessions.map(session => ({
                  label: session.datetime,
                  value: `${session.date_id}`
                }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={bentoConf?.selectedSession}
              onChange={val => setChanges(val, 'selectedSession')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllSessions(bentoConf, setBentoConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Sessions', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.event}>
              &#x21BB;
            </button>
          </div>
        </>
      )}
      {bentoConf.actionName && !isLoading && (
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
              <b>{__('Bento Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {bentoConf?.field_map.map((itm, i) => (
            <BentoFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              bentoConf={bentoConf}
              formFields={formFields}
              setBentoConf={setBentoConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => addFieldMap(bentoConf.field_map.length, bentoConf, setBentoConf, false)}
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
