import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import TrelloActions from './TrelloActions'
// import { addFieldMap } from './IntegrationHelpers'
import { fetchAllBoard, fetchAllList } from './TrelloCommonFunc'
import TrelloFieldMap from './TrelloFieldMap'

export default function TrelloIntegLayout({ formFields, handleInput, trelloConf, setTrelloConf, isLoading, setIsLoading, setSnackbar }) {
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    trelloConf?.boardId && fetchAllList(trelloConf, setTrelloConf, setIsLoading, setSnackbar)
  }, [trelloConf?.boardId])

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Boards:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="boardId" value={trelloConf.boardId} className="btcd-paper-inp w-5">
        <option value="">{__('Select Board', 'bit-integrations')}</option>
        {
          trelloConf?.default?.allBoardlist && trelloConf.default.allBoardlist.map(({ boardId, boardName }) => (
            <option key={boardId} value={boardId}>
              {boardName}
            </option>
          ))
        }
      </select>
      <button onClick={() => fetchAllBoard(trelloConf, setTrelloConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      {
        trelloConf?.default?.alllists && (
          <>
            <br />
            <b className="wdt-200 d-in-b">{__('Lists:', 'bit-integrations')}</b>
            <select onChange={handleInput} name="listId" value={trelloConf.listId} className="btcd-paper-inp w-5">
              <option value="">{__('Select List', 'bit-integrations')}</option>
              {
                trelloConf?.default?.alllists && trelloConf.default.alllists.map(({ listId, listName }) => (
                  <option key={listId} value={listId}>
                    {listName}
                  </option>
                ))
              }
            </select>
            <button onClick={() => fetchAllList(trelloConf, setTrelloConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            <br />
          </>
        )
      }
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
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Trello Fields', 'bit-integrations')}</b></div>
      </div>

      {trelloConf?.listId && trelloConf?.field_map.map((itm, i) => (
        <TrelloFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          trelloConf={trelloConf}
          formFields={formFields}
          setTrelloConf={setTrelloConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(trelloConf.field_map.length, trelloConf, setTrelloConf, false)} className="icn-btn sh-sm" type="button">+</button></div>

      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <TrelloActions
        trelloConf={trelloConf}
        setTrelloConf={setTrelloConf}
        formFields={formFields}
      />

    </>
  )
}
