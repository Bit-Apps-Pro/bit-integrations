/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import HubspotFieldMap from './HubspotFieldMap'
import { getAllPipelines, getFields } from './HubspotCommonFunc'
import HubspotActions from './HubspotActions'
import Loader from '../../Loaders/Loader'

export default function HubspotIntegLayout({ formFields, handleInput, hubspotConf, setHubspotConf, setSnackbar, loading, setLoading }) {
  const action = [
    { label: 'Create Contact', value: 'contact' },
    { label: 'Create Deal', value: 'deal' },
    { label: 'Create Ticket', value: 'ticket' },
  ]

  const handleInputP = (e) => {
    if (e.target.value === 'deal' || e.target.value === 'ticket') {
      getAllPipelines(hubspotConf, setHubspotConf, setLoading, e.target.value, loading)
    }

    if (e.target.value === 'contact') {
      getFields(hubspotConf, setHubspotConf, setLoading, e.target.value, loading)
    }

    if (e.target.name === 'pipeline') {
      const newConf = { ...hubspotConf }
      if (e.target.value !== '') {
        newConf[e.target.name] = e.target.value
      } else {
        delete newConf[e.target.name]
      }
      const stagesTmp = hubspotConf?.default?.pipelines.filter(({ pipelineId }) => pipelineId === e.target.value).map(({ stages }) => stages)
      newConf.stageTmp = stagesTmp
      setHubspotConf({ ...newConf })
    }
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>

        <select onChange={handleInputP} name="actionName" value={hubspotConf?.actionName} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {
            action.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>
      {(loading.customFields || loading.pipelines) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <br />
      <br />
      {(loading.hubSpotFields && (hubspotConf?.actionName === 'deal' || hubspotConf.actionName === 'ticket')) && (
        <>
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Pipeline:', 'bit-integrations')}</b>

            <select onChange={handleInputP} name="pipeline" value={hubspotConf?.pipeline} className="btcd-paper-inp w-5">
              <option value="">{__('Select Pipeline', 'bit-integrations')}</option>
              {hubspotConf?.default?.pipelines.map(({ pipelineId, pipelineName }) => (
                <option key={pipelineId} value={pipelineId}>
                  {pipelineName}
                </option>
              ))}
            </select>
          </div>
          <br />
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Stage:', 'bit-integrations')}</b>

            <select onChange={handleInput} name="stage" value={hubspotConf?.stage} className="btcd-paper-inp w-5">
              <option value="">{__('Select Stage', 'bit-integrations')}</option>
              {hubspotConf?.stageTmp?.[0]?.map(({ stageId, stageName }) => (
                <option key={stageId} value={stageId}>
                  {stageName}
                </option>
              ))}
            </select>
          </div>

        </>
      )}
      <br />
      {loading.hubSpotFields
        && (
          <div>
            <div className="mt-5">
              <b className="wdt-100">
                {__('Field Map', 'bit-integrations')}
                <button
                  onClick={() => getFields(hubspotConf, setHubspotConf, setLoading, hubspotConf.actionName, loading, true)}
                  className="icn-btn sh-sm ml-2 mr-2 tooltip"
                  style={{ '--tooltip-txt': `'${__('Refresh custom fields', 'bit-integrations')}'` }}
                  type="button"
                  disabled={loading.customFields}
                >
                  &#x21BB;
                </button>
              </b>
            </div>
            <div className="btcd-hr mt-1" />
            {(loading.customFieldsRefresh) && (
              <Loader style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 100,
                transform: 'scale(0.7)',
              }}
              />
            )}
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Hubspot Fields', 'bit-integrations')}</b></div>
            </div>

            {hubspotConf?.field_map.map((itm, i) => (
              <HubspotFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                hubspotConf={hubspotConf}
                formFields={formFields}
                setHubspotConf={setHubspotConf}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(hubspotConf.field_map.length, hubspotConf, setHubspotConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <HubspotActions
              hubspotConf={hubspotConf}
              setHubspotConf={setHubspotConf}
              formFields={formFields}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}
    </>
  )
}
