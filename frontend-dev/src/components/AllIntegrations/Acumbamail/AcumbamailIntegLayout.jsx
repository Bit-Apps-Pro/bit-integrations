import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import AcumbamailActions from './AcumbamailActions'
import { fetchAllList, refreshFields } from './AcumbamailCommonFunc'
import AcumbamailFieldMap from './AcumbamailFieldMap'

export default function AcumbamailIntegLayout({ formFields, handleInput, acumbamailConf, setAcumbamailConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="mainAction" value={acumbamailConf.mainAction} className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {
          acumbamailConf.allActions && acumbamailConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <br />
      <br />
      <b className="wdt-200 d-in-b">{__('All List:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="listId" value={acumbamailConf.listId} className="btcd-paper-inp w-5">
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          acumbamailConf?.default?.allLists && Object.entries(acumbamailConf.default.allLists).map((item) => (
            <option key={item[0]} value={item[0]}>
              {item[1].name}
            </option>
          ))
        }
      </select>
      <button onClick={() => fetchAllList(acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch Subscriber List', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
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
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => refreshFields(null, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Acumbamail Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Acumbamail Fields', 'bit-integrations')}</b></div>
      </div>

      {acumbamailConf.default?.allFields
        && (
          <>
            {acumbamailConf.field_map.map((itm, i) => (
              <AcumbamailFieldMap
                key={`sheet-m-${i + 9}`}
                i={i}
                field={itm}
                acumbamailConf={acumbamailConf}
                formFields={formFields}
                setAcumbamailConf={setAcumbamailConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(acumbamailConf.field_map.length, acumbamailConf, setAcumbamailConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
          </>
        )}

      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <AcumbamailActions
        acumbamailConf={acumbamailConf}
        setAcumbamailConf={setAcumbamailConf}
        formFields={formFields}
      />

    </>
  )
}
