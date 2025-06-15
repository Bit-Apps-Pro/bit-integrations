// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshDirectIqHeader, refreshDirectIqList } from './DirectIqCommonFunc'
import DirectIqFieldMap from './DirectIqFieldMap'

export default function DirectIqIntegLayout({ formFields, directIqConf, setDirectIqConf, isLoading, setIsLoading, setSnackbar }) {

  const handleInput = (e) => {
    const listid = e.target.value
    const newConf = { ...directIqConf }
    if (listid) {
      newConf.listId = listid
    } else {
      delete newConf.listId
    }

    refreshDirectIqHeader(newConf, setDirectIqConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('List:', 'bit-integrations')}</b>
      <select value={directIqConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          directIqConf?.default?.directIqLists && Object.keys(directIqConf.default.directIqLists).map(listname => (
            <option key={`${listname + 1}`} value={directIqConf.default.directIqLists[listname].listId}>
              {directIqConf.default.directIqLists[listname].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshDirectIqList(directIqConf, setDirectIqConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh DirectIq list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          translist: 'scale(0.7)',
        }}
        />
      )}

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => refreshDirectIqHeader(directIqConf, setDirectIqConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh DirectIq Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {

        (directIqConf?.listId || directIqConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('DirectIq Fields', 'bit-integrations')}</b></div>
            </div>

            {directIqConf.field_map.map((itm, i) => (
              <DirectIqFieldMap
                key={`DirectIq-m-${i + 9}`}
                i={i}
                field={itm}
                directIqConf={directIqConf}
                formFields={formFields}
                setDirectIqConf={setDirectIqConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(directIqConf.field_map.length, directIqConf, setDirectIqConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
          </>
        )
      }
    </>
  )
}
