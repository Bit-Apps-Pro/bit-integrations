/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import CompanyHubActions from './CompanyHubActions'
import { generateMappedField } from './CompanyHubCommonFunc'
import CompanyHubFieldMap from './CompanyHubFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function CompanyHubIntegLayout({ formFields, companyHubConf, setCompanyHubConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...companyHubConf }
    const { name } = e.target

    if (e.target.value !== '') {
      newConf[name] = e.target.value
      let companyHubFields = []

      if (e.target.value === 'contact') {
        companyHubFields = companyHubConf?.contactFields
      } else if (e.target.value === 'company') {
        companyHubFields = companyHubConf?.companyFields
      } else if (e.target.value === 'deal') {
        companyHubFields = companyHubConf?.dealFields
      }

      newConf.field_map = generateMappedField(companyHubFields)
    } else {
      delete newConf[name]
      delete newConf.actionId
    }
    setCompanyHubConf(newConf)
  }

  const setChanges = (val, name) => {
    setCompanyHubConf(prevConf => {
      prevConf[name] = val
      return prevConf
    })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={companyHubConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="contact" data-action_name="contact">{__('Create Contact', 'bit-integrations')}</option>
        <option value="company" data-action_name="company">{__('Create Company', 'bit-integrations')}</option>
        <option value="deal" data-action_name="deal">{__('Create Deal', 'bit-integrations')}</option>
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
      {companyHubConf.actionName === "deal" && !isLoading
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Deal Stage:', 'bit-integrations')}</b>
              <MultiSelect
                options={["Prospecting", "Qualification", "Discussion", "Proposal", "Review", "Closed Won", "Closed Lost"].map(stage => ({ label: stage, value: stage }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={companyHubConf?.selectedStage}
                onChange={val => setChanges(val, 'selectedStage')}
                singleSelect
                closeOnSelect
              />
            </div>
          </>
        )}
      {companyHubConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
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
            <div className="txt-dp"><b>{__('CompanyHub Fields', 'bit-integrations')}</b></div>
          </div>

          {companyHubConf?.field_map.map((itm, i) => (
            <CompanyHubFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              companyHubConf={companyHubConf}
              formFields={formFields}
              setCompanyHubConf={setCompanyHubConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(companyHubConf.field_map.length, companyHubConf, setCompanyHubConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <CompanyHubActions
            companyHubConf={companyHubConf}
            setCompanyHubConf={setCompanyHubConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

