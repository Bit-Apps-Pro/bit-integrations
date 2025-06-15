/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import CapsuleCRMActions from './CapsuleCRMActions'
import { getAllCRMParties, getAllCRMMilestones, getCustomFields } from './CapsuleCRMCommonFunc'
import CapsuleCRMFieldMap from './CapsuleCRMFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function CapsuleCRMIntegLayout({ formFields, handleInput, capsulecrmConf, setCapsuleCRMConf, loading, setLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...capsulecrmConf }
    newConf.field_map = [
      { formField: '', capsulecrmFormField: '' },
    ]
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
      getCustomFields(newConf, setCapsuleCRMConf, setLoading)
      if (e.target.value === 'opportunity' || e.target.value === 'project') {
        getAllCRMParties(newConf, setCapsuleCRMConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    setCapsuleCRMConf({ ...newConf })
  }

  const setChanges = (val, name) => {
    const newConf = { ...capsulecrmConf }
    newConf[name] = val
    if (name === 'selectedCRMParty' && val !== '' && capsulecrmConf.actionName === 'opportunity') {
      newConf.selectedCRMMilestones = ''
      getAllCRMMilestones(newConf, setCapsuleCRMConf, setLoading)
    }
    setCapsuleCRMConf({ ...newConf })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={capsulecrmConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="organisation">{__('Create Organisation', 'bit-integrations')}</option>
        <option value="person">{__('Create Person', 'bit-integrations')}</option>
        <option value="opportunity">{__('Create Opportunity', 'bit-integrations')}</option>
        <option value="project">{__('Create Project', 'bit-integrations')}</option>
      </select>
      {(loading.CRMParties || loading.CRMMilestones) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(capsulecrmConf.actionName === 'opportunity' || capsulecrmConf.actionName === 'project')
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Party:', 'bit-integrations')}</b>
              <MultiSelect
                options={capsulecrmConf?.CRMParties?.map(CRMParty => ({ label: CRMParty.name, value: CRMParty.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={capsulecrmConf?.selectedCRMParty}
                onChange={val => setChanges(val, 'selectedCRMParty')}
                disabled={loading.CRMParties}
                singleSelect
              />
              <button
                onClick={() => getAllCRMParties(capsulecrmConf, setCapsuleCRMConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh parties', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMParties}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((capsulecrmConf.actionName === 'opportunity') && capsulecrmConf.selectedCRMParty)
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Milestone:', 'bit-integrations')}</b>
              <MultiSelect
                options={capsulecrmConf?.CRMMilestones?.map(CRMMilestone => ({ label: CRMMilestone.name, value: CRMMilestone.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={capsulecrmConf?.selectedCRMMilestones}
                onChange={val => setChanges(val, 'selectedCRMMilestones')}
                disabled={loading.CRMMilestones}
                singleSelect
              />
              <button
                onClick={() => getAllCRMMilestones(capsulecrmConf, setCapsuleCRMConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Milestones', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMMilestones}
              >
                &#x21BB;
              </button>
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
      {capsulecrmConf.actionName && !loading.customFields && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getCustomFields(capsulecrmConf, setCapsuleCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMMilestones}
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('CapsuleCRM Fields', 'bit-integrations')}</b></div>

          </div>

          {capsulecrmConf?.field_map.map((itm, i) => (
            <CapsuleCRMFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              capsulecrmConf={capsulecrmConf}
              formFields={formFields}
              setCapsuleCRMConf={setCapsuleCRMConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(capsulecrmConf.field_map.length, capsulecrmConf, setCapsuleCRMConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <CapsuleCRMActions
            capsulecrmConf={capsulecrmConf}
            setCapsuleCRMConf={setCapsuleCRMConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}
