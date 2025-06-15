// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import BenchMarkActions from './BenchMarkActions'
import { refreshBenchMarkHeader, refreshBenchMarkList } from './BenchMarkCommonFunc'
import BenchMarkFieldMap from './BenchMarkFieldMap'

export default function BenchMarkIntegLayout({ formFields, benchMarkConf, setBenchMarkConf, isLoading, setIsLoading, setSnackbar }) {

  const handleInput = (e) => {
    const listid = e.target.value
    const newConf = { ...benchMarkConf }
    if (listid) {
      newConf.listId = listid
    } else {
      delete newConf.listId
    }

    refreshBenchMarkHeader(newConf, setBenchMarkConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('List:', 'bit-integrations')}</b>
      <select value={benchMarkConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          benchMarkConf?.default?.benchMarkLists && Object.keys(benchMarkConf.default.benchMarkLists).map(listname => (
            <option key={`${listname + 1}`} value={benchMarkConf.default.benchMarkLists[listname].listId}>
              {benchMarkConf.default.benchMarkLists[listname].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshBenchMarkList(benchMarkConf, setBenchMarkConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh BenchMark list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
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
        <button onClick={() => refreshBenchMarkHeader(benchMarkConf, setBenchMarkConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh BenchMark Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {

        (benchMarkConf?.listId || benchMarkConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('BenchMark Fields', 'bit-integrations')}</b></div>
            </div>

            {benchMarkConf.field_map.map((itm, i) => (
              <BenchMarkFieldMap
                key={`BenchMark-m-${i + 9}`}
                i={i}
                field={itm}
                benchMarkConf={benchMarkConf}
                formFields={formFields}
                setBenchMarkConf={setBenchMarkConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(benchMarkConf.field_map.length, benchMarkConf, setBenchMarkConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <BenchMarkActions benchMarkConf={benchMarkConf} setBenchMarkConf={setBenchMarkConf} />
          </>
        )
      }
    </>
  )
}
