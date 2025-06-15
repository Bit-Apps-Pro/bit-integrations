import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoDeskActions from './ZohoDeskActions'
import { refreshDepartments, refreshFields, refreshOrganizations } from './ZohoDeskCommonFunc'
import ZohoDeskFieldMap from './ZohoDeskFieldMap'

export default function ZohoDeskIntegLayout({ formID, formFields, handleInput, deskConf, setDeskConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Portal:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="orgId" value={deskConf.orgId} className="btcd-paper-inp w-7">
        <option value="">{__('Select Portal', 'bit-integrations')}</option>
        {
          deskConf?.default?.organizations && Object.values(deskConf.default.organizations).map(organization => (
            <option key={organization.orgId} value={organization.orgId}>
              {organization.portalName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshOrganizations(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Desk Portals', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <b className="wdt-200 d-in-b">{__('Department:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="department" value={deskConf.department} className="btcd-paper-inp w-7">
        <option value="">{__('Select Department', 'bit-integrations')}</option>
        {
          deskConf?.default?.departments?.[deskConf.orgId] && Object.values(deskConf.default.departments[deskConf.orgId]).map(department => (
            <option key={department.departmentId} value={department.departmentId}>
              {department.departmentName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshDepartments(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Desk Departments', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
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

      {deskConf.department && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            <button onClick={() => refreshFields(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Desk Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
          <div className="btcd-hr mt-1" />
          {deskConf.default?.fields?.[deskConf?.orgId]
            && (
              <>
                <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                  <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
                </div>

                {deskConf.field_map.map((itm, i) => (
                  <ZohoDeskFieldMap
                    key={`desk-m-${i + 9}`}
                    i={i}
                    field={itm}
                    deskConf={deskConf}
                    formFields={formFields}
                    setDeskConf={setDeskConf}
                  />
                ))}
                <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(deskConf.field_map.length, deskConf, setDeskConf)} className="icn-btn sh-sm" type="button">+</button></div>
                <br />
                <br />
                <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
                <div className="btcd-hr mt-1" />

                <ZohoDeskActions
                  deskConf={deskConf}
                  setDeskConf={setDeskConf}
                  formID={formID}
                  formFields={formFields}
                  setSnackbar={setSnackbar}
                />
              </>
            )}
        </>
      )}
    </>
  )
}
