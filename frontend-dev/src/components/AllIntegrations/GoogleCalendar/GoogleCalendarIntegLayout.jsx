import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import GoogleCalendarFieldMap from './GoogleCalendarFieldMap'
import GoogleCalendarActions from './GoogleCalendarActions'
import { getAllGoogleCalendarLists } from './GoogleCalendarCommonFunc'

import timeZoneList from './timeZoneList.json'

export default function GoogleCalendarIntegLayout({ flowID, formFields, googleCalendarConf, setGoogleCalendarConf }) {
  const inputHandler = (e) => {
    const newConf = { ...googleCalendarConf }
    newConf.calendarId = e.target.value
    setGoogleCalendarConf({ ...newConf })
  }

  const inputTimeZoneHandler = (val) => {
    const newConf = { ...googleCalendarConf }
    newConf.timeZone = val
    setGoogleCalendarConf({ ...newConf })
  }

  return (
    <>
      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Calendar Lists: ', 'bit-integrations')}</b>
        <select onChange={(e) => inputHandler(e)} name="calendarId" value={googleCalendarConf.calendarId} className="btcd-paper-inp w-5">
          <option value="">{__('Select Calendar', 'bit-integrations')}</option>
          {
            googleCalendarConf?.calendarLists && googleCalendarConf.calendarLists.map(({ id, name, accessRole }) => (
              <option key={id} value={id}>
                {`${name} (${accessRole})`}
              </option>
            ))
          }
        </select>
        <button onClick={() => getAllGoogleCalendarLists(flowID, googleCalendarConf, setGoogleCalendarConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch Calendar Lists', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
      </div>
      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Time Zone: ', 'bit-integrations')}</b>
        <MultiSelect
          name="timeZone"
          className="w-5"
          defaultValue={googleCalendarConf?.timeZone}
          options={timeZoneList.map((item) => ({ label: item.label, value: item.value }))}
          onChange={(val) => inputTimeZoneHandler(val)}
          singleSelect
        />
      </div>
      <div className="mt-5">
        <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Google Calendar Fields', 'bit-integrations')}</b></div>
      </div>

      {googleCalendarConf?.field_map.map((itm, i) => (
        <GoogleCalendarFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          formFields={formFields}
          googleCalendarConf={googleCalendarConf}
          setGoogleCalendarConf={setGoogleCalendarConf}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2">
        <button onClick={() => addFieldMap(googleCalendarConf.field_map.length, googleCalendarConf, setGoogleCalendarConf, false)} className="icn-btn sh-sm" type="button">+</button>
      </div>
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <GoogleCalendarActions
        googleCalendarConf={googleCalendarConf}
        setGoogleCalendarConf={setGoogleCalendarConf}
      />
    </>
  )
}
