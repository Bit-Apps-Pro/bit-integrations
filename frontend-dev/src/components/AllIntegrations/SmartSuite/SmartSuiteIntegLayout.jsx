/* eslint-disable no-unused-vars */
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import SmartSuiteActions from './SmartSuiteActions'
import { getAllEvents, getAllSessions, generateMappedField } from './SmartSuiteCommonFunc'
import { getCustomFields } from './SmartSuiteCommonFunc'
import SmartSuiteFieldMap from './SmartSuiteFieldMap'

export default function SmartSuiteIntegLayout({
  formFields,
  handleInput,
  smartSuiteConf,
  setSmartSuiteConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)

  const setChanges = (val, name) => {
    console.error('check value')

    console.error(val + ' ' + name)

    if (name === 'selectedEvent' && val !== '' && smartSuiteConf?.actionName === 'record') {
      getAllSessions(smartSuiteConf, setSmartSuiteConf, val, setLoading)
    }
    if (
      name === 'selectedSession' &&
      val != '' &&
      smartSuiteConf?.selectedSession &&
      smartSuiteConf?.selectedSession != ''
    ) {
      getCustomFields(smartSuiteConf, setSmartSuiteConf, setIsLoading, val)
    }
    setSmartSuiteConf((prevConf) => {
      const newConf = { ...prevConf }
      newConf[name] = val

      if (name === 'selectedEvent') {
        delete newConf.selectedSession
        delete newConf.sessions
      }
      return newConf
    })
  }
  const handleCustomFieldForRecord = (actionName, value) => {
    if (actionName === 'record') {
      if (value != null && value != '') return true
      return false
    }
    return true
  }

  const handleActionInput = (e) => {
    const newConf = { ...smartSuiteConf }
    const { name } = e.target
    newConf.field_map = [{ formField: '', smartSuiteFormField: '' }]

    if (e.target.value != '') {
      newConf[name] = e.target.value
      if (e.target.value === 'table' || e.target.value === 'record') {
        getAllEvents(smartSuiteConf, setSmartSuiteConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    newConf.isActionTable = e.target.value
    if (newConf.isActionTable === 'solution' || newConf.isActionTable === 'table') {
      newConf.field_map = generateMappedField(newConf.smartSuiteFields)
    } else if (newConf.isActionTable === 'record') {
      newConf.field_map = generateMappedField(newConf.smartSuiteFieldsForRecord)
    }
    setSmartSuiteConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select
        onChange={handleActionInput}
        name="actionName"
        value={smartSuiteConf.actionName}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="solution" data-action_name="contact">
          {__('Create Solution', 'bit-integrations')}
        </option>
        <option value="table" data-action_name="campaign">
          {__('Create Table', 'bit-integrations')}
        </option>
        <option value="record" data-action_name="campaign">
          {__('Create Record', 'bit-integrations')}
        </option>
      </select>
      {loading.event && (
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

      {smartSuiteConf.actionName &&
        (smartSuiteConf.isActionTable === 'table' || smartSuiteConf.isActionTable === 'record') &&
        !loading.event && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Solution:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  smartSuiteConf?.events &&
                  smartSuiteConf.events.map((event) => ({ label: event.name, value: `${event.id}` }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={smartSuiteConf?.selectedEvent}
                onChange={(val) => setChanges(val, 'selectedEvent')}
                singleSelect
                closeOnSelect
                disabled={loading.event}
              />
              <button
                onClick={() => getAllEvents(smartSuiteConf, setSmartSuiteConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Solution', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.event}>
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {console.error(smartSuiteConf.selectedEvent)}
      {loading.session && (
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
      {smartSuiteConf.actionName &&
        smartSuiteConf?.selectedEvent &&
        smartSuiteConf?.selectedEvent != '' &&
        !loading.event &&
        !loading.session &&
        smartSuiteConf.isActionTable === 'record' && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Table:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  smartSuiteConf?.sessions &&
                  smartSuiteConf.sessions.map((session) => ({
                    label: session.datetime,
                    value: `${session.date_id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={smartSuiteConf?.selectedSession}
                onChange={(val) => setChanges(val, 'selectedSession')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() =>
                  getAllSessions(
                    smartSuiteConf,
                    setSmartSuiteConf,
                    smartSuiteConf?.selectedEvent,
                    setLoading
                  )
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Table', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.event}>
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {isLoading && (
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

      {handleCustomFieldForRecord(smartSuiteConf.actionName, smartSuiteConf.selectedSession) &&
        smartSuiteConf.actionName &&
        !isLoading && (
          <div>
            <br />
            <div className="mt-5">
              <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
              {smartSuiteConf.actionName === 'record' && (
                <button
                  onClick={() => getCustomFields(smartSuiteConf, setSmartSuiteConf, setIsLoading)}
                  className="icn-btn sh-sm ml-2 mr-2 tooltip"
                  style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
                  type="button"
                  disabled={loading.CRMPipelines}>
                  &#x21BB;
                </button>
              )}
            </div>
            <br />
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp">
                <b>{__('Form Fields', 'bit-integrations')}</b>
              </div>
              <div className="txt-dp">
                <b>{__('SmartSuite Fields', 'bit-integrations')}</b>
              </div>
            </div>
            {smartSuiteConf?.field_map.map((itm, i) => (
              <SmartSuiteFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                smartSuiteConf={smartSuiteConf}
                formFields={formFields}
                setSmartSuiteConf={setSmartSuiteConf}
                setSnackbar={setSnackbar}
              />
            ))}
            {(smartSuiteConf.actionName === 'solution' || smartSuiteConf.actionName === 'record') && (
              <div className="txt-center btcbi-field-map-button mt-2">
                <button
                  onClick={() =>
                    addFieldMap(
                      smartSuiteConf.field_map.length,
                      smartSuiteConf,
                      setSmartSuiteConf,
                      false
                    )
                  }
                  className="icn-btn sh-sm"
                  type="button">
                  +
                </button>
              </div>
            )}
            <br />
            <br />
            {smartSuiteConf.actionName === 'solution' && (
              <div>
                <div className="mt-4">
                  <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
                </div>
                <div className="btcd-hr mt-1" />
                <SmartSuiteActions
                  smartSuiteConf={smartSuiteConf}
                  setSmartSuiteConf={setSmartSuiteConf}
                  formFields={formFields}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            )}
          </div>
        )}
    </>
  )
}
