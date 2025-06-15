/* eslint-disable no-unused-vars */
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import NimbleActions from './NimbleActions'
import { generateMappedField, getAllFields } from './NimbleCommonFunc'
import NimbleFieldMap from './NimbleFieldMap'

export default function NimbleIntegLayout({ formFields, nimbleConf, setNimbleConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    setNimbleConf(prevConf => {
      const newConf = { ...prevConf }

      if (e.target.value !== '') {
        newConf.actionName = e.target.value
        newConf.field_map = generateMappedField(e.target.value === 'person' ? newConf?.peopleFields : newConf?.companyFields)

      } else {
        delete newConf.actionName
        newConf.field_map = [{ formField: "", nimbleFormField: "" }]
      }
      return newConf
    })
  }

  return (
    <>
      {!loading.allFields
        && (
          <>
            <br />

            <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
            <select onChange={handleActionInput} name="actionName" value={nimbleConf.actionName} className="btcd-paper-inp w-5">
              <option value="">{__('Select an action', 'bit-integrations')}</option>
              <option value="person" data-action_name="account">{__('Add people', 'bit-integrations')}</option>
              <option value="company" data-action_name="project">{__('Create Company', 'bit-integrations')}</option>
            </select>
          </>
        )}

      {(isLoading || loading.allFields) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      {nimbleConf.actionName && !isLoading && !loading.allFields && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getAllFields(nimbleConf, setNimbleConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.allFields}
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Nimble Fields', 'bit-integrations')}</b></div>
          </div>

          {nimbleConf?.field_map.map((itm, i) => (
            <NimbleFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              nimbleConf={nimbleConf}
              formFields={formFields}
              setNimbleConf={setNimbleConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(nimbleConf.field_map.length, nimbleConf, setNimbleConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <NimbleActions
            nimbleConf={nimbleConf}
            setNimbleConf={setNimbleConf}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

