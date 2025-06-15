import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/MauticIntegrationHelpers'
import MauticActions from './MauticActions'
import { getAllFields } from './MauticCommonFunc'
import MauticFieldMap from './MauticFieldMap'

export default function MauticIntegLayout({ formFields, handleInput, mauticConf, setMauticConf, isLoading, setIsLoading, setSnackbar, a }) {
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
      {!isLoading && mauticConf?.default?.fields && (
        <div>
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            <button onClick={() => getAllFields(mauticConf, setMauticConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Mautic Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Mautic Fields', 'bit-integrations')}</b></div>
          </div>

          {mauticConf?.field_map.map((itm, i) => (
            <MauticFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              mauticConf={mauticConf}
              formFields={formFields}
              setMauticConf={setMauticConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mauticConf.field_map.length, mauticConf, setMauticConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <MauticActions
            mauticConf={mauticConf}
            setMauticConf={setMauticConf}
            formFields={formFields}
          />
        </div>
      )}
    </>
  )
}
