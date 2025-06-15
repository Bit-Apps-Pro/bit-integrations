import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import PipeDriveActions from './PipeDriveActions'
import { handleTabChange, refreshOrganizations, refreshPersons } from './PipeDriveCommonFunc'
import PipeDriveFieldMap from './PipeDriveFieldMap'

export default function PipeDriveNewRecord({ tab, settab, formFields, pipeDriveConf, setPipeDriveConf, handleInput, isLoading, setIsLoading, setSnackbar }) {
  useEffect(() => {
    handleTabChange(0, settab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line no-undef

  return (
    <>
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
      <br />
      <br />

      {(pipeDriveConf.moduleData.module !== '' && pipeDriveConf.default.modules[pipeDriveConf.moduleData.module]?.required)
        && !['Products'].includes(pipeDriveConf.moduleData.module) && (
        <>
          <b className="wdt-200 d-in-b">{__('Organization:', 'bit-integrations')}</b>
          <select onChange={handleInput} name="organization_id" value={pipeDriveConf.moduleData?.organization_id || ''} className="btcd-paper-inp w-5">
            <option value="">{__('Select Organization', 'bit-integrations')}</option>
            {
              pipeDriveConf?.default?.organizations && pipeDriveConf.default.organizations.map((data, indx) => (
                <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                  {data.label}
                </option>
              ))
            }
          </select>
          <button onClick={() => refreshOrganizations(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh organizations', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>

        </>
      )}
      <br />
      <br />
      {(pipeDriveConf.moduleData.module !== '' && pipeDriveConf.default.modules[pipeDriveConf.moduleData.module]?.required)
        && !['Products', 'Persons'].includes(pipeDriveConf.moduleData.module) && (
        <>
          <b className="wdt-200 d-in-b">{__('Person:', 'bit-integrations')}</b>
          <select onChange={handleInput} name="person_id" value={pipeDriveConf.moduleData?.person_id || ''} className="btcd-paper-inp w-5">
            <option value="">{__('Select Person', 'bit-integrations')}</option>
            {
              pipeDriveConf?.default?.persons && pipeDriveConf.default.persons.map((data, indx) => (
                <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                  {data.label}
                </option>
              ))
            }
          </select>
          <button onClick={() => refreshPersons(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh persons', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          <br />
          <br />
        </>
      )}
      <br />
      <br />

      {(pipeDriveConf.moduleData.module && pipeDriveConf.default?.modules?.[pipeDriveConf.moduleData.module]?.fields)
        && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('PipeDrive Fields', 'bit-integrations')}</b></div>
            </div>

            {pipeDriveConf.field_map.map((itm, i) => (
              <PipeDriveFieldMap
                key={`pipedrive-m-${i + 9}`}
                i={i}
                field={itm}
                pipeDriveConf={pipeDriveConf}
                formFields={formFields}
                setPipeDriveConf={setPipeDriveConf}
                tab={tab}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(pipeDriveConf.field_map.length, pipeDriveConf, setPipeDriveConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            <PipeDriveActions
              pipeDriveConf={pipeDriveConf}
              setPipeDriveConf={setPipeDriveConf}
              tab={tab}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSnackbar={setSnackbar}
            />
          </>
        )}
      {pipeDriveConf.moduleData.module && !pipeDriveConf.default?.modules?.[pipeDriveConf.moduleData.module]?.fields
        && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)',
          }}
          />
        )}
    </>
  )
}
