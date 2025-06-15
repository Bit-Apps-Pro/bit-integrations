import { useEffect } from 'react'

import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoBiginActions from './ZohoBiginActions'
import { handleTabChange, refreshRelatedList } from './ZohoBiginCommonFunc'
import ZohoBiginFieldMap from './ZohoBiginFieldMap'

export default function ZohoBiginRelatedRecord({ indx, tab, settab, formID, formFields, biginConf, setBiginConf, handleInput, isLoading, setIsLoading, setSnackbar }) {
  useEffect(() => {
    handleTabChange(indx + 1, settab, biginConf, setBiginConf, formID, setIsLoading, setSnackbar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('Related List:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="module" value={biginConf?.relatedlists?.[tab - 1]?.module} className="btcd-paper-inp w-7" disabled={!biginConf.module}>
        <option value="">{__('Select Related Module', 'bit-integrations')}</option>
        {
          biginConf?.default.relatedlists?.[biginConf.module] && Object.values(biginConf.default.relatedlists[biginConf.module]).map(relatedlistApiName => (
            <option key={relatedlistApiName.api_name} value={relatedlistApiName.aMod}>
              {relatedlistApiName.plural_label}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshRelatedList(formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Bigin Related Lists', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
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
      {biginConf.default?.moduleData?.[biginConf.relatedlists?.[tab - 1]?.module]?.fields
        && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
            </div>

            {biginConf.relatedlists[tab - 1].field_map.map((itm, i) => (
              <ZohoBiginFieldMap
                key={`crm-m-${i + 9}`}
                i={i}
                field={itm}
                biginConf={biginConf}
                formFields={formFields}
                setBiginConf={setBiginConf}
                tab={tab}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(biginConf.relatedlists[tab - 1].field_map.length, biginConf, setBiginConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            {Object.keys(biginConf.default?.moduleData?.[biginConf.relatedlists[tab - 1].module]?.fileUploadFields).length !== 0 && (
              <>
                <div className="mt-4"><b className="wdt-100">{__('Map Attachments', 'bit-integrations')}</b></div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                  <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
                </div>

                {biginConf.relatedlists[tab - 1].upload_field_map.map((itm, i) => (
                  <ZohoBiginFieldMap
                    key={`crm-m-${i + 9}`}
                    uploadFields={1}
                    i={i}
                    field={itm}
                    biginConf={biginConf}
                    formFields={formFields}
                    setBiginConf={setBiginConf}
                    tab={tab}
                  />
                ))}
                <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(biginConf.relatedlists[tab - 1].upload_field_map.length, biginConf, setBiginConf, true, tab)} className="icn-btn sh-sm" type="button">+</button></div>
                <br />
                <br />
              </>
            )}
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            <ZohoBiginActions
              tab={tab}
              formID={formID}
              formFields={formFields}
              biginConf={biginConf}
              setBiginConf={setBiginConf}
              setSnackbar={setSnackbar}
            />
          </>
        )}
    </>
  )
}
