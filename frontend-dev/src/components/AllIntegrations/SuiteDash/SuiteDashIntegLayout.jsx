/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import SuiteDashActions from './SuiteDashActions'
import { refreshSuiteDashFields } from './SuiteDashCommonFunc'
import SuiteDashFieldMap from './SuiteDashFieldMap'

export default function SuiteDashIntegLayout({ formFields, suiteDashConf, setSuiteDashConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...suiteDashConf }
    const { name } = e.target

    if (e.target.value !== '') {
      newConf[name] = e.target.value
      refreshSuiteDashFields(newConf, setSuiteDashConf, setIsLoading, setSnackbar)
    } else {
      delete newConf[name]
      delete newConf.actionId
    }
    setSuiteDashConf(newConf)
  }

  const setChanges = (val, name) => {
    setSuiteDashConf(prevConf => {
      prevConf[name] = val
      return prevConf
    })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={suiteDashConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="contact" data-action_name="contact">{__('Create Contact', 'bit-integrations')}</option>
      </select>

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {suiteDashConf.actionName === "contact" && !isLoading
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Role:', 'bit-integrations')}</b>
              <MultiSelect
                options={["Lead", "Prospect", "Client"].map(role => ({ label: role, value: role }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={suiteDashConf?.selectedRole}
                onChange={val => setChanges(val, 'selectedRole')}
                singleSelect
              />
            </div>
          </>
        )}
      {suiteDashConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => refreshSuiteDashFields(suiteDashConf, setSuiteDashConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('SuiteDash Fields', 'bit-integrations')}</b></div>
          </div>

          {suiteDashConf?.field_map.map((itm, i) => (
            <SuiteDashFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              suiteDashConf={suiteDashConf}
              formFields={formFields}
              setSuiteDashConf={setSuiteDashConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(suiteDashConf.field_map.length, suiteDashConf, setSuiteDashConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <SuiteDashActions
            suiteDashConf={suiteDashConf}
            setSuiteDashConf={setSuiteDashConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

