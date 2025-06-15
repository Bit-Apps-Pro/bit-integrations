import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import { getAllDropboxFolders } from './DropboxCommonFunc'
import DropboxFieldMap from './DropboxFieldMap'
import DropboxActions from './DropboxActions'

export default function DropboxIntegLayout({ flowID, formFields, dropboxConf, setDropboxConf }) {
  return (
    <>
      <div className="mt-5">
        <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
        <button onClick={() => getAllDropboxFolders(flowID, dropboxConf, setDropboxConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Dropbox Folders', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('File Input', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Dropbox Folder', 'bit-integrations')}</b></div>
      </div>

      {dropboxConf?.field_map.map((itm, i) => (
        <DropboxFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          formFields={formFields}
          dropboxConf={dropboxConf}
          setDropboxConf={setDropboxConf}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2">
        <button onClick={() => addFieldMap(dropboxConf.field_map.length, dropboxConf, setDropboxConf, false)} className="icn-btn sh-sm" type="button">+</button>
      </div>
      <br />
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <DropboxActions
        dropboxConf={dropboxConf}
        setDropboxConf={setDropboxConf}
      />
    </>
  )
}
