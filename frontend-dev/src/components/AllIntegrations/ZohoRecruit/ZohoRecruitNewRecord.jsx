import { useEffect } from 'react'

import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoRecruitActions from './ZohoRecruitActions'
import { handleTabChange } from './ZohoRecruitCommonFunc'
import ZohoRecruitFieldMap from './ZohoRecruitFieldMap'

export default function ZohoRecruitNewRecord({ tab, settab, formID, formFields, recruitConf, setRecruitConf, isLoading, setSnackbar }) {
  useEffect(() => {
    handleTabChange(0, settab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
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
      {recruitConf.default?.moduleData?.[recruitConf.module]?.fields
        && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
            </div>

            {recruitConf.field_map.map((itm, i) => (
              <ZohoRecruitFieldMap
                key={`recruit-m-${i + 9}`}
                i={i}
                field={itm}
                recruitConf={recruitConf}
                formFields={formFields}
                setRecruitConf={setRecruitConf}
                tab={tab}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(recruitConf.field_map.length, recruitConf, setRecruitConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            {Object.keys(recruitConf.default?.moduleData?.[recruitConf.module]?.fileUploadFields).length !== 0 && (
              <>
                <div className="mt-4"><b className="wdt-100">{__('Map Attachments', 'bit-integrations')}</b></div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                  <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
                </div>

                {recruitConf.upload_field_map.map((itm, i) => (
                  <ZohoRecruitFieldMap
                    key={`crm-m-${i + 9}`}
                    uploadFields={1}
                    i={i}
                    field={itm}
                    recruitConf={recruitConf}
                    formFields={formFields}
                    setRecruitConf={setRecruitConf}
                    tab={tab}
                    setSnackbar={setSnackbar}
                  />
                ))}
                <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(recruitConf.upload_field_map.length, recruitConf, setRecruitConf, true, tab)} className="icn-btn sh-sm" type="button">+</button></div>
                <br />
                <br />
              </>
            )}
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            <ZohoRecruitActions
              tab={tab}
              formID={formID}
              formFields={formFields}
              recruitConf={recruitConf}
              setRecruitConf={setRecruitConf}
              setSnackbar={setSnackbar}
            />
          </>
        )}
    </>
  )
}
