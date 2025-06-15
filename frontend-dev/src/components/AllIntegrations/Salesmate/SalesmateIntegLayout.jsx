/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import SalesmateActions from './SalesmateActions'
import { getAllCRMOwner, getAllCRMPipelines, getAllCRMPrimaryContact, refreshSalesmateFields } from './SalesmateCommonFunc'
import SalesmateFieldMap from './SalesmateFieldMap'

export default function SalesmateIntegLayout({ formFields, handleInput, salesmateConf, setSalesmateConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...salesmateConf }
    const { name } = e.target

    if (e.target.value !== '') {
      newConf[name] = e.target.options[e.target.selectedIndex].dataset.action_name
      newConf.actionId = e.target.value

      if (Number(e.target.value) === 4) {
        getAllCRMPrimaryContact(newConf, setSalesmateConf, loading, setLoading)
      }

      if (Number(e.target.value) !== 4) {
        setIsLoading(true)
        getAllCRMOwner(newConf, setSalesmateConf, loading, setLoading)
        refreshSalesmateFields(newConf, setSalesmateConf, setIsLoading, setSnackbar)
      }
    } else {
      delete newConf[name]
      delete newConf.actionId
    }
    setSalesmateConf(newConf)
  }

  const setChanges = (val, name) => {
    const newConf = { ...salesmateConf }
    newConf[name] = val

    if (name === "selectedCRMContact") {
      setIsLoading(true)
      getAllCRMOwner(newConf, setSalesmateConf, loading, setLoading)
      getAllCRMPipelines(newConf, setSalesmateConf, loading, setLoading)
      refreshSalesmateFields(newConf, setSalesmateConf, setIsLoading, setSnackbar)
    }

    if (name === "selectedCRMPipeline") {
      const tmp = salesmateConf?.CRMPipelines.filter(pipeline => pipeline.pipeline === val)
      newConf.stages = tmp[0]?.stages
    }
    setSalesmateConf({ ...newConf })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={salesmateConf.actionId} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="1" data-action_name="contact">{__('Create Contact', 'bit-integrations')}</option>
        <option value="4" data-action_name="deal">{__('Create Deal', 'bit-integrations')}</option>
        <option value="5" data-action_name="company">{__('Create Company', 'bit-integrations')}</option>
        <option value="6" data-action_name="product">{__('Create Product', 'bit-integrations')}</option>
      </select>
      {(loading.CRMPipelines || loading.CRMOwners || loading.CRMContacts) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(Number(salesmateConf.actionId) === 4 && !salesmateConf?.CRMContacts) && (
        <>
          <br />
          <br />
          <br />
          <br />
          <small className="wdt-200 d-in-b error-msg">{__('Contacts not found!', 'bit-integrations')}</small>
          <br />
          <br />
        </>
      )}
      {(Number(salesmateConf.actionId) === 4 && salesmateConf?.CRMContacts)
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Contact:', 'bit-integrations')}</b>
              <MultiSelect
                options={salesmateConf?.CRMContacts?.map(CRMContact => ({ label: CRMContact.name, value: CRMContact.id.toString() }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={salesmateConf?.selectedCRMContact}
                onChange={val => setChanges(val, 'selectedCRMContact')}
                disabled={loading.CRMContacts}
                singleSelect
              />
              <button
                onClick={() => getAllCRMPrimaryContact(salesmateConf, setSalesmateConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Primary Contacts', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMContact}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((Number(salesmateConf.actionId) === 4 && salesmateConf?.selectedCRMContact) || (salesmateConf.actionName && Number(salesmateConf.actionId) !== 4 && salesmateConf?.CRMOwners))
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Owner:', 'bit-integrations')}</b>
              <MultiSelect
                options={salesmateConf?.CRMOwners?.map(CRMOwner => ({ label: CRMOwner.name, value: CRMOwner.id.toString() }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={salesmateConf?.selectedCRMOwner}
                onChange={val => setChanges(val, 'selectedCRMOwner')}
                disabled={loading.CRMOwners}
                singleSelect
              />
              <button
                onClick={() => getAllCRMOwner(salesmateConf, setSalesmateConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Owners', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMOwners}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((Number(salesmateConf.actionId) === 4) && salesmateConf?.selectedCRMContact)
        && (
          <>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Pipeline:', 'bit-integrations')}</b>
              <MultiSelect
                options={salesmateConf?.CRMPipelines?.map(CRMPipeline => ({ label: CRMPipeline.pipeline, value: CRMPipeline.pipeline }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={salesmateConf?.selectedCRMPipeline}
                onChange={val => setChanges(val, 'selectedCRMPipeline')}
                disabled={loading.CRMPipelines}
                singleSelect
              />
              <button
                onClick={() => getAllCRMPipelines(salesmateConf, setSalesmateConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh pipelines', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMPipelines}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((Number(salesmateConf.actionId) === 4) && salesmateConf.selectedCRMPipeline && salesmateConf?.selectedCRMContact)
        && (
          <>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Stage:', 'bit-integrations')}</b>
              <MultiSelect
                options={salesmateConf?.stages.map(stage => ({ label: stage.stage, value: stage.stage }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={salesmateConf?.selectedCRMStage}
                onChange={val => setChanges(val, 'selectedCRMStage')}
                disabled={loading.CRMStage}
                singleSelect
              />
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
      {(((Number(salesmateConf.actionId) === 4) && salesmateConf?.selectedCRMContact) || (salesmateConf.actionName && (Number(salesmateConf.actionId) !== 4))) && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => refreshSalesmateFields(salesmateConf, setSalesmateConf, setIsLoading, setSnackbar)}
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
            <div className="txt-dp"><b>{__('Salesmate Fields', 'bit-integrations')}</b></div>
          </div>

          {salesmateConf?.field_map.map((itm, i) => (
            <SalesmateFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              salesmateConf={salesmateConf}
              formFields={formFields}
              setSalesmateConf={setSalesmateConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(salesmateConf.field_map.length, salesmateConf, setSalesmateConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <SalesmateActions
            salesmateConf={salesmateConf}
            setSalesmateConf={setSalesmateConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

