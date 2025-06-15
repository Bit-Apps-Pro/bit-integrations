// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import CampaignMonitorActions from './CampaignMonitorActions'
import { refreshCampaignMonitorFields, refreshCampaignMonitorLists } from './CampaignMonitorCommonFunc'
import CampaignMonitorFieldMap from './CampaignMonitorFieldMap'

export default function CampaignMonitorIntegLayout({ formFields, campaignMonitorConf, setCampaignMonitorConf, isLoading, setIsLoading, setSnackbar }) {
  const handleInput = (e) => {
    const listId = e.target.value
    const newConf = { ...campaignMonitorConf }
    if (listId) {
      newConf.listId = listId
    }
    setCampaignMonitorConf(newConf)
    refreshCampaignMonitorFields(newConf, setCampaignMonitorConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Subscriber List:', 'bit-integrations')}</b>
      <select value={campaignMonitorConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select Subscriber List', 'bit-integrations')}</option>
        {
          campaignMonitorConf?.default?.campaignMonitorLists && campaignMonitorConf.default.campaignMonitorLists.map(list => (
            <option key={`${list.listId}`} value={list.listId}>
              {list.listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshCampaignMonitorLists(campaignMonitorConf, setCampaignMonitorConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh CampaignMonitor campaign"' }} type="button" disabled={isLoading}>&#x21BB;</button>
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
        <button onClick={() => refreshCampaignMonitorFields(campaignMonitorConf, setCampaignMonitorConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh CampaignMonitor Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      { !isLoading &&
        (campaignMonitorConf?.listId || campaignMonitorConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('CampaignMonitor Fields', 'bit-integrations')}</b></div>
            </div>

            {campaignMonitorConf.field_map.map((itm, i) => (
              <CampaignMonitorFieldMap
                key={`CampaignMonitor-m-${i + 9}`}
                i={i}
                field={itm}
                campaignMonitorConf={campaignMonitorConf}
                formFields={formFields}
                setCampaignMonitorConf={setCampaignMonitorConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(campaignMonitorConf.field_map.length, campaignMonitorConf, setCampaignMonitorConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <CampaignMonitorActions
              campaignMonitorConf={campaignMonitorConf}
              setCampaignMonitorConf={setCampaignMonitorConf}
            />
          </>
        )
      }
    </>
  )
}
