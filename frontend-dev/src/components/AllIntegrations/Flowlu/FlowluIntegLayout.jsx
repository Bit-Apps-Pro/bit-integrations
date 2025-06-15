/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import FlowluActions from './FlowluActions'
import { getAllFields, getAllPipeline, getAllStage } from './FlowluCommonFunc'
import FlowluFieldMap from './FlowluFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function FlowluIntegLayout({ formFields, flowluConf, setFlowluConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...flowluConf }

    if (e.target.value !== '') {
      newConf.actionName = e.target.value
      delete newConf.flowluFields

      if ((e.target.value === 'account' && newConf.selectedAccountType) || e.target.value !== 'account') {
        getAllFields(newConf, setFlowluConf, setIsLoading, setSnackbar)
      }
      if (e.target.value === 'opportunity') {
        getAllPipeline(newConf, setFlowluConf, setLoading, setSnackbar)
      }
    } else {
      delete newConf.actionName
    }
    setFlowluConf(newConf)
  }

  const setChanges = (val, name) => {
    setFlowluConf(prevConf => {
      const newConf = { ...prevConf }
      newConf[name] = val

      if (val !== '') {
        if (name === "selectedAccountType") {
          setIsLoading(true)
          getAllFields(newConf, setFlowluConf, setIsLoading, setSnackbar)
        }
        if (name === "selectedPipeline") {
          getAllStage(newConf, setFlowluConf, setLoading, setSnackbar)
        }
      }

      return newConf
    })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={flowluConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="account" data-action_name="account">{__('Create Account', 'bit-integrations')}</option>
        <option value="opportunity" data-action_name="opportunity">{__('Create Opportunity', 'bit-integrations')}</option>
        <option value="project" data-action_name="project">{__('Create Project', 'bit-integrations')}</option>
      </select>
      {(loading.pipeline || loading.stage) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {flowluConf.actionName && flowluConf.actionName === 'account'
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Account Type:', 'bit-integrations')}</b>
              <select onChange={e => setChanges(e.target.value, 'selectedAccountType')} name="selectedAccountType" value={flowluConf.selectedAccountType} className="btcd-paper-inp w-5">
                <option value="">{__('Select an account type', 'bit-integrations')}</option>
                <option value="1">{__('Organization', 'bit-integrations')}</option>
                <option value="2">{__('Contact', 'bit-integrations')}</option>
              </select>
            </div>
          </>
        )}
      {flowluConf.actionName && flowluConf.actionName === 'opportunity' && !loading.pipeline && flowluConf?.pipelines
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Pipeline:', 'bit-integrations')}</b>
              <MultiSelect
                options={flowluConf?.pipelines?.map(pipeline => ({ label: pipeline.name, value: `${pipeline.id}` }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={flowluConf?.selectedPipeline}
                onChange={val => setChanges(val, 'selectedPipeline')}
                disabled={loading.pipeline}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllPipeline(flowluConf, setFlowluConf, setLoading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Pipeline', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.pipeline}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {flowluConf.actionName && flowluConf.actionName === 'opportunity' && flowluConf?.selectedPipeline && !loading.stage && flowluConf?.stages
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Stage:', 'bit-integrations')}</b>
              <MultiSelect
                options={flowluConf?.stages?.map(stage => ({ label: stage.name, value: `${stage.id}` }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={flowluConf?.selectedOpportunityStage}
                onChange={val => setChanges(val, 'selectedOpportunityStage')}
                disabled={loading.stage}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllStage(flowluConf, setFlowluConf, setLoading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Opportunity stages', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.stage}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}

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
      {!isLoading && flowluConf.actionName && flowluConf?.flowluFields && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getAllFields(flowluConf, setFlowluConf, setIsLoading, setSnackbar)}
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
            <div className="txt-dp"><b>{__('Flowlu Fields', 'bit-integrations')}</b></div>
          </div>

          {flowluConf?.field_map.map((itm, i) => (
            <FlowluFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              flowluConf={flowluConf}
              formFields={formFields}
              setFlowluConf={setFlowluConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(flowluConf.field_map.length, flowluConf, setFlowluConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <FlowluActions
            flowluConf={flowluConf}
            setFlowluConf={setFlowluConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

