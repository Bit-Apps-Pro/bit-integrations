import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import TrelloActions from './TrelloActions'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { fetchAllBoard, fetchAllList } from './TrelloCommonFunc'
import TrelloCustomFieldMap from './TrelloCustomFieldMap'
import ProModal from '../../Utilities/ProModal'
import { useState } from 'react'

export default function TrelloIntegLayout({
  formFields,
  handleInput,
  trelloConf,
  setTrelloConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const [showProModal, setShowProModal] = useState(false)
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Boards:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="boardId"
        value={trelloConf.boardId}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select Board', 'bit-integrations')}</option>
        {trelloConf?.default?.allBoardlist &&
          trelloConf.default.allBoardlist.map(({ boardId, boardName }) => (
            <option key={boardId} value={boardId}>
              {boardName}
            </option>
          ))}
      </select>
      <button
        onClick={() => fetchAllBoard(trelloConf, setTrelloConf, setIsLoading, setSnackbar)}
        className="icn-btn sh-sm ml-2 mr-2 tooltip"
        style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bit-integrations')}'` }}
        type="button"
        disabled={isLoading}>
        &#x21BB;
      </button>
      <br />
      {trelloConf?.default?.alllists && (
        <>
          <br />
          <b className="wdt-200 d-in-b">{__('Lists:', 'bit-integrations')}</b>
          <select
            onChange={handleInput}
            name="listId"
            value={trelloConf.listId}
            className="btcd-paper-inp w-5">
            <option value="">{__('Select List', 'bit-integrations')}</option>
            {trelloConf?.default?.alllists &&
              trelloConf.default.alllists.map(({ listId, listName }) => (
                <option key={listId} value={listId}>
                  {listName}
                </option>
              ))}
          </select>
          <button
            onClick={() => fetchAllList(trelloConf, setTrelloConf, setIsLoading, setSnackbar)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bit-integrations')}'` }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
          <br />
        </>
      )}
      <br />
      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}
      <TrelloCustomFieldMap
        mapKey="field_map"
        formFields={formFields}
        handleInput={handleInput}
        trelloConf={trelloConf}
        setTrelloConf={setTrelloConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur flx p-3">
            <div className="pro">
              <button
                className="btn p-0 m-0"
                type="button"
                onClick={() => setShowProModal(true)}
                style={{ color: '#344054', background: 'transparent' }}>
                {__('Custom Fields', 'bit-integrations')} {__('Available On', 'bit-integrations')}
                &nbsp;
                <span className="txt-pro"> ({__('Pro', 'bit-integrations')})</span>
              </button>
            </div>
          </div>
        )}

        <TrelloCustomFieldMap
          mapKey="custom_field_map"
          formFields={formFields}
          handleInput={handleInput}
          trelloConf={trelloConf}
          setTrelloConf={setTrelloConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
      </div>
      <ProModal
        show={showProModal}
        setShow={setShowProModal}
        sub={__('Custom Fields', 'bit-integrations')}
      />
      <br />
      <div className="mt-4">
        <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <TrelloActions
        trelloConf={trelloConf}
        setTrelloConf={setTrelloConf}
        formFields={formFields}
      />
    </>
  )
}
