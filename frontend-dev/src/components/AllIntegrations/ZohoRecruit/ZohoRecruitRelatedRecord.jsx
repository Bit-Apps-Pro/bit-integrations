import { useEffect } from 'react'

import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoRecruitActions from './ZohoRecruitActions'
import { handleTabChange, refreshRelatedList } from './ZohoRecruitCommonFunc'
import ZohoRecruitFieldMap from './ZohoRecruitFieldMap'

export default function ZohoRecruitRelatedRecord({ indx, tab, settab, formID, formFields, recruitConf, setRecruitConf, handleInput, isLoading, setIsLoading, setSnackbar }) {
  useEffect(() => {
    handleTabChange(indx + 1, settab, recruitConf, setRecruitConf, formID, setIsLoading, setSnackbar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">Related List:</b>
      <select onChange={handleInput} name="module" value={recruitConf?.relatedlists?.[tab - 1]?.module} className="btcd-paper-inp w-7" disabled={!recruitConf.module}>
        <option value="">{__('Select Related Module', 'bit-integrations')}</option>
        {
          recruitConf?.default.relatedlists?.[recruitConf.module] && Object.values(recruitConf.default.relatedlists[recruitConf.module]).map(relatedlistApiName => (
            <option key={relatedlistApiName.aMod} value={relatedlistApiName.aMod}>
              {relatedlistApiName.pl}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshRelatedList(formID, recruitConf, setRecruitConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Recruit Related Lists"' }} type="button" disabled={isLoading}>&#x21BB;</button>
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
      {recruitConf.default?.moduleData?.[recruitConf.relatedlists?.[tab - 1]?.module]?.fields
        && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
            </div>

            {recruitConf.relatedlists[tab - 1].field_map.map((itm, i) => (
              <ZohoRecruitFieldMap
                key={`crm-m-${i + 9}`}
                i={i}
                field={itm}
                recruitConf={recruitConf}
                formFields={formFields}
                setRecruitConf={setRecruitConf}
                tab={tab}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(recruitConf.relatedlists[tab - 1].field_map.length, recruitConf, setRecruitConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            {Object.keys(recruitConf.default?.moduleData?.[recruitConf.relatedlists[tab - 1].module]?.fileUploadFields).length !== 0 && (
              <>
                <div className="mt-4"><b className="wdt-100">{__('Map Attachments', 'bit-integrations')}</b></div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                  <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
                </div>

                {recruitConf.relatedlists[tab - 1].upload_field_map.map((itm, i) => (
                  <ZohoRecruitFieldMap
                    key={`crm-m-${i + 9}`}
                    uploadFields={1}
                    i={i}
                    field={itm}
                    recruitConf={recruitConf}
                    formFields={formFields}
                    setRecruitConf={setRecruitConf}
                    tab={tab}
                  />
                ))}
                <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(recruitConf.relatedlists[tab - 1].upload_field_map.length, recruitConf, setRecruitConf, true, tab)} className="icn-btn sh-sm" type="button">+</button></div>
                <br />
                <br />
              </>
            )}
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            <ZohoRecruitActions
              recruitConf={recruitConf}
              setRecruitConf={setRecruitConf}
              tab={tab}
            />
          </>
        )}
    </>
  )
}
