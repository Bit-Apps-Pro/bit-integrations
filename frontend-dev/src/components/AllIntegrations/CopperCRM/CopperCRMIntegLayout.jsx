/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import CopperCRMActions from './CopperCRMActions'
import { getAllCRMPeoples, getAllCRMPipelines, getCustomFields } from './CopperCRMCommonFunc'
import CopperCRMFieldMap from './CopperCRMFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function CopperCRMIntegLayout({
  formFields,
  handleInput,
  copperCRMConf,
  setCopperCRMConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const handleActionInput = e => {
    const newConf = { ...copperCRMConf }
    newConf.field_map = [{ formField: '', coppercrmFormField: '' }]
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
      getCustomFields(newConf, setCopperCRMConf, setLoading)
      if (e.target.value === 'opportunity') {
        getAllCRMPeoples(newConf, setCopperCRMConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    setCopperCRMConf({ ...newConf })
  }

  const setChanges = (val, name) => {
    const newConf = { ...copperCRMConf }
    newConf[name] = val
    if (name === 'selectedCRMPeople' && val !== '' && copperCRMConf.actionName === 'opportunity') {
      newConf.selectedCRMPipelines = ''
      getAllCRMPipelines(newConf, setCopperCRMConf, setLoading)
    }
    setCopperCRMConf({ ...newConf })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select
        onChange={handleActionInput}
        name="actionName"
        value={copperCRMConf.actionName}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="company">{__('Create Company', 'bit-integrations')}</option>
        <option value="person">{__('Create Person', 'bit-integrations')}</option>
        <option value="opportunity">{__('Create Opportunity', 'bit-integrations')}</option>
        <option value="task">{__('Create Task', 'bit-integrations')}</option>
      </select>
      {(loading.CRMPeoples || loading.CRMPipelines) && (
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
      {copperCRMConf.actionName === 'opportunity' && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select People:', 'bit-integrations')}</b>
            <MultiSelect
              options={copperCRMConf?.CRMPeoples?.map(CRMPeople => ({
                label: CRMPeople.name,
                value: CRMPeople.id
              }))}
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={copperCRMConf?.selectedCRMPeople}
              onChange={val => setChanges(val, 'selectedCRMPeople')}
              disabled={loading.CRMPeoples}
              singleSelect
            />
            <button
              onClick={() => getAllCRMPeoples(copperCRMConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh peoples', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMPeoples}>
              &#x21BB;
            </button>
          </div>
        </>
      )}
      {copperCRMConf.actionName === 'opportunity' && copperCRMConf.selectedCRMPeople && (
        <>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Pipeline:', 'bit-integrations')}</b>
            <MultiSelect
              options={copperCRMConf?.CRMPipelines?.map(CRMPipeline => ({
                label: CRMPipeline.name,
                value: CRMPipeline.id
              }))}
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={copperCRMConf?.selectedCRMPipelines}
              onChange={val => setChanges(val, 'selectedCRMPipelines')}
              disabled={loading.CRMPipelines}
              singleSelect
            />
            <button
              onClick={() => getAllCRMPipelines(copperCRMConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh pipelines', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMPipelines}>
              &#x21BB;
            </button>
          </div>
        </>
      )}
      {loading.customFields && (
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
      {copperCRMConf.actionName && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
            <button
              onClick={() => getCustomFields(copperCRMConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMPipelines}>
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
              <b>{__('CopperCRM Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {copperCRMConf?.field_map.map((itm, i) => (
            <CopperCRMFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              copperCRMConf={copperCRMConf}
              formFields={formFields}
              setCopperCRMConf={setCopperCRMConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(copperCRMConf.field_map.length, copperCRMConf, setCopperCRMConf, false)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <CopperCRMActions
            copperCRMConf={copperCRMConf}
            setCopperCRMConf={setCopperCRMConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}
