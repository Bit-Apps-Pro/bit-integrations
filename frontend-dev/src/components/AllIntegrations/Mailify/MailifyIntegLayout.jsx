// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshMailifyHeader, refreshMailifyList } from './MailifyCommonFunc'
import MailifyFieldMap from './MailifyFieldMap'
import MailifyActions from './MailifyActions'

export default function MailifyIntegLayout({ formFields, mailifyConf, setMailifyConf, isLoading, setIsLoading, setSnackbar }) {

  const handleInput = (e) => {
    const listid = e.target.value
    const newConf = { ...mailifyConf }
    if (listid) {
      newConf.listId = listid
    }

    refreshMailifyHeader(newConf, setMailifyConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('List:', 'bit-integrations')}</b>
      <select value={mailifyConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          mailifyConf?.default?.mailifyLists && Object.keys(mailifyConf.default.mailifyLists).map(listName => (
            <option key={`${listName + 1}`} value={mailifyConf.default.mailifyLists[listName].listId}>
              {mailifyConf.default.mailifyLists[listName].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshMailifyList(mailifyConf, setMailifyConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Mailify list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
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
        <button onClick={() => refreshMailifyHeader(mailifyConf, setMailifyConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Mailify Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {
        (mailifyConf?.listId || mailifyConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Mailify Fields', 'bit-integrations')}</b></div>
            </div>

            {mailifyConf.field_map.map((itm, i) => (
              <MailifyFieldMap
                key={`Mailify-m-${i + 9}`}
                i={i}
                field={itm}
                mailifyConf={mailifyConf}
                formFields={formFields}
                setMailifyConf={setMailifyConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mailifyConf.field_map.length, mailifyConf, setMailifyConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <MailifyActions
              mailifyConf={mailifyConf}
              setMailifyConf={setMailifyConf}
            />
          </>
        )
      }
    </>
  )
}
