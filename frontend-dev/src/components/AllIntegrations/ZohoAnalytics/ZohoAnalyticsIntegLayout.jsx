import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ZohoAnalyticsActions from './ZohoAnalyticsActions'
import { refreshTableHeaders, refreshTables, refreshWorkspaces } from './ZohoAnalyticsCommonFunc'
import ZohoAnalyticsFieldMap, { addFieldMap } from './ZohoAnalyticsFieldMap'

export default function ZohoAnalyticsIntegLayout({ formID, formFields, handleInput, analyticsConf, setAnalyticsConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('Workspace:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="workspace" value={analyticsConf.workspace} className="btcd-paper-inp w-7">
        <option value="">{__('Select Workspace', 'bit-integrations')}</option>
        {
          analyticsConf?.default?.workspaces && analyticsConf.default.workspaces.map(workspaceApiName => (
            <option key={workspaceApiName} value={workspaceApiName}>
              {workspaceApiName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshWorkspaces(formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Analytics Workspaces', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <b className="wdt-100 d-in-b">{__('Table:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="table" value={analyticsConf.table} className="btcd-paper-inp w-7">
        <option value="">{__('Select Table', 'bit-integrations')}</option>
        {
          analyticsConf?.default?.tables?.[analyticsConf.workspace] && analyticsConf.default.tables[analyticsConf.workspace].map(tableApiName => (
            <option key={tableApiName} value={tableApiName}>
              {tableApiName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshTables(formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Analytics Tables"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <small style={{ color: 'red', marginLeft: 105 }}>{__("** Zoho Analytics doesn't support data INSERT / UPDATE in other integration table", 'bit-integrations')}</small>

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
      {analyticsConf.default?.tables?.headers?.[analyticsConf.table]
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
              <button onClick={() => refreshTableHeaders(formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Analytics Table Headers', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
            </div>

            {analyticsConf.field_map.map((itm, i) => (
              <ZohoAnalyticsFieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                field={itm}
                analyticsConf={analyticsConf}
                formFields={formFields}
                setAnalyticsConf={setAnalyticsConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(analyticsConf.field_map.length, analyticsConf, setAnalyticsConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            <ZohoAnalyticsActions
              analyticsConf={analyticsConf}
              setAnalyticsConf={setAnalyticsConf}
              formFields={formFields}
            />
          </>
        )}
    </>
  )
}
