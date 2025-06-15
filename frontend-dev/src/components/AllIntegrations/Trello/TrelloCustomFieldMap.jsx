import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import TrelloActions from './TrelloActions'
import { fetchAllBoard, fetchAllCustomFields, fetchAllList } from './TrelloCommonFunc'
import TrelloFieldMap from './TrelloFieldMap'
import { create } from 'mutative'

export default function TrelloCustomFieldMap({
  mapKey,
  formFields,
  handleInput,
  trelloConf,
  setTrelloConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const addFieldMap = (setConf) => {
    setConf((prevConf) =>
      create(prevConf, (draftConf) => {
        if (!draftConf[mapKey]) {
          draftConf[mapKey] = []
        }

        draftConf[mapKey].splice(draftConf[mapKey].length, 0, {})
      })
    )
  }

  const delFieldMap = (i, setConf) => {
    setConf((prevConf) =>
      create(prevConf, (draftConf) => {
        if (draftConf[mapKey].length > 1) {
          draftConf[mapKey].splice(i, 1)
        }
      })
    )
  }

  return (
    <>
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
      <div className="mt-5">
        <b className="wdt-100">
          {mapKey === 'field_map'
            ? __('Field Map', 'bit-integrations')
            : __('Custom Field Map', 'bit-integrations')}
        </b>
        {mapKey !== 'field_map' && (
          <button
            onClick={() =>
              fetchAllCustomFields(trelloConf, setTrelloConf, setIsLoading, setSnackbar)
            }
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh Custom Fields', 'bit-integrations')}'` }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
        )}
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp">
          <b>{__('Form Fields', 'bit-integrations')}</b>
        </div>
        <div className="txt-dp">
          <b>{__('Trello Fields', 'bit-integrations')}</b>
        </div>
      </div>

      {trelloConf?.listId &&
        trelloConf[mapKey]?.map((itm, i) => (
          <TrelloFieldMap
            key={`rp-m-${i + 9}`}
            i={i}
            fieldKey={mapKey === 'field_map' ? 'cardFields' : 'customFields'}
            mapKey={mapKey}
            field={itm}
            trelloConf={trelloConf}
            formFields={formFields}
            setTrelloConf={setTrelloConf}
            setSnackbar={setSnackbar}
            addFieldMap={addFieldMap}
            delFieldMap={delFieldMap}
          />
        ))}
      <div className="txt-center btcbi-field-map-button mt-2">
        <button onClick={() => addFieldMap(setTrelloConf)} className="icn-btn sh-sm" type="button">
          +
        </button>
      </div>
      <br />
      <br />
    </>
  )
}
