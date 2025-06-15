// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshDripHeader, refreshDripCampaign } from './DripCommonFunc'
import DripFieldMap from './DripFieldMap'

export default function DripIntegLayout({ formFields, dripConf, setDripConf, isLoading, setIsLoading, setSnackbar }) {

  const handleInput = (e) => {
    const campaignid = e.target.value
    const newConf = { ...dripConf }
    if (campaignid) {
      newConf.campaignId = campaignid
    } else {
      delete newConf.campaignId
    }

    refreshDripHeader(newConf, setDripConf, setIsLoading, setSnackbar)
  }
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Campaign:', 'bit-integrations')}</b>
      <select value={dripConf?.campaignId} name="campaignId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select Campaign', 'bit-integrations')}</option>
        {
          dripConf?.default?.dripCampaigns && Object.keys(dripConf.default.dripCampaigns).map(campaignname => (
            <option key={`${campaignname + 1}`} value={dripConf.default.dripCampaigns[campaignname].campaignId}>
              {dripConf.default.dripCampaigns[campaignname].campaignName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshDripCampaign(dripConf, setDripConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Drip campaign"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transcampaign: 'scale(0.7)',
        }}
        />
      )}

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => refreshDripHeader(dripConf, setDripConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Drip Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {

        (dripConf?.campaignId || dripConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Campaign Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Drip Fields', 'bit-integrations')}</b></div>
            </div>

            {dripConf.field_map.map((itm, i) => (
              <DripFieldMap
                key={`Drip-m-${i + 9}`}
                i={i}
                field={itm}
                dripConf={dripConf}
                formFields={formFields}
                setDripConf={setDripConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(dripConf.field_map.length, dripConf, setDripConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
          </>
        )
      }
    </>
  )
}
