/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ClinchPadActions from './ClinchPadActions'
import { getAllCRMPipelines, getAllCRMContacts } from './ClinchPadCommonFunc'
import ClinchPadFieldMap from './ClinchPadFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function ClinchPadIntegLayout({ formFields, handleInput, clinchPadConf, setClinchPadConf, loading, setLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...clinchPadConf }
    newConf.field_map = [
      { formField: '', clinchPadFormField: '' },
    ]
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
      if (e.target.value === 'lead') {
        getAllCRMPipelines(newConf, setClinchPadConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    setClinchPadConf({ ...newConf })
  }

  const setChanges = (val, name) => {
    const newConf = { ...clinchPadConf }
    newConf[name] = val
    setClinchPadConf({ ...newConf })
  }
  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={clinchPadConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="organization">{__('Create Organization', 'bit-integrations')}</option>
        <option value="contact">{__('Create Contact', 'bit-integrations')}</option>
        <option value="lead">{__('Create Lead', 'bit-integrations')}</option>
      </select>
      {(loading.CRMPipelines) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(clinchPadConf.actionName === 'lead')
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Pipeline:', 'bit-integrations')}</b>

              <MultiSelect
                options={clinchPadConf?.CRMPipelines?.map(CRMPipeline => ({ label: CRMPipeline.name, value: CRMPipeline.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={clinchPadConf?.selectedCRMPipeline}
                onChange={val => setChanges(val, 'selectedCRMPipeline')}
                disabled={loading.CRMPipelines}
                singleSelect
              />
            </div>
          </>
        )}

      {(loading.customFields) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {clinchPadConf.actionName && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getCustomFields(clinchPadConf, setClinchPadConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMPipelines}
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('ClinchPad Fields', 'bit-integrations')}</b></div>

          </div>

          {clinchPadConf?.field_map.map((itm, i) => (
            <ClinchPadFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              clinchPadConf={clinchPadConf}
              formFields={formFields}
              setClinchPadConf={setClinchPadConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(clinchPadConf.field_map.length, clinchPadConf, setClinchPadConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <ClinchPadActions
            clinchPadConf={clinchPadConf}
            setClinchPadConf={setClinchPadConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}
