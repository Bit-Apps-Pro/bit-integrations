// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import LemlistActions from './LemlistActions'
import { refreshLemlistCampaign, refreshLemlistHeader } from './LemlistCommonFunc'
import LemlistFieldMap from './LemlistFieldMap'

export default function LemlistIntegLayout({ formFields, lemlistConf, setLemlistConf, isLoading, setIsLoading, setSnackbar }) {
  const handleInput = (e) => {
    const campaignId = e.target.value
    const newConf = { ...lemlistConf }
    if (campaignId) {
      newConf.campaignId = campaignId
    }

    refreshLemlistHeader(newConf, setLemlistConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Campaigns:', 'bit-integrations')}</b>
      <select value={lemlistConf?.campaignId} name="campaignId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select Campaigns', 'bit-integrations')}</option>
        {
          lemlistConf?.default?.lemlistCampaigns && Object.keys(lemlistConf.default.lemlistCampaigns).map(campaignName => (
            <option key={`${campaignName + 1}`} value={lemlistConf.default.lemlistCampaigns[campaignName].campaignId}>
              {lemlistConf.default.lemlistCampaigns[campaignName].campaignName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshLemlistCampaign(lemlistConf, setLemlistConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Lemlist campaign"' }} type="button" disabled={isLoading}>&#x21BB;</button>
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
        <button onClick={() => refreshLemlistHeader(lemlistConf, setLemlistConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Lemlist Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {
        (lemlistConf?.campaignsId || lemlistConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Lemlist Fields', 'bit-integrations')}</b></div>
            </div>

            {lemlistConf.field_map.map((itm, i) => (
              <LemlistFieldMap
                key={`Lemlist-m-${i + 9}`}
                i={i}
                field={itm}
                lemlistConf={lemlistConf}
                formFields={formFields}
                setLemlistConf={setLemlistConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(lemlistConf.field_map.length, lemlistConf, setLemlistConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <LemlistActions
              lemlistConf={lemlistConf}
              setLemlistConf={setLemlistConf}
            />
          </>
        )
      }
    </>
  )
}
