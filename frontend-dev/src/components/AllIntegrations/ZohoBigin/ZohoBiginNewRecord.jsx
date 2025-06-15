import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields } from '../../../GlobalStates'

import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ZohoBiginActions from './ZohoBiginActions'
import { getFields, handleTabChange } from './ZohoBiginCommonFunc'
import ZohoBiginFieldMap from './ZohoBiginFieldMap'

export default function ZohoBiginNewRecord({ tab, settab, formID, isLoading, setIsLoading, setSnackbar }) {
  const [biginConf, setBiginConf] = useRecoilState($actionConf)
  const formFields = useRecoilValue($formFields)
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
      {biginConf.default?.moduleData?.[biginConf.module]?.fields
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
              <button onClick={() => getFields(tab, formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Bigin Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
            </div>

            {biginConf.field_map.map((itm, i) => (
              <ZohoBiginFieldMap
                key={`bigin-m-${i + 9}`}
                i={i}
                field={itm}
                biginConf={biginConf}
                formFields={formFields}
                setBiginConf={setBiginConf}
                tab={tab}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(biginConf.field_map.length, biginConf, setBiginConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            {Object.keys(biginConf.default?.moduleData?.[biginConf.module]?.fileUploadFields).length !== 0 && (
              <>
                <div className="mt-4"><b className="wdt-100">{__('Map Attachments', 'bit-integrations')}</b></div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                  <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bit-integrations')}</b></div>
                </div>

                {biginConf.upload_field_map.map((itm, i) => (
                  <ZohoBiginFieldMap
                    key={`crm-m-${i + 9}`}
                    uploadFields={1}
                    i={i}
                    field={itm}
                    biginConf={biginConf}
                    formFields={formFields}
                    setBiginConf={setBiginConf}
                    tab={tab}
                    setSnackbar={setSnackbar}
                  />
                ))}
                <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(biginConf.upload_field_map.length, biginConf, setBiginConf, true, tab)} className="icn-btn sh-sm" type="button">+</button></div>
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
