import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import CopyText from '../../Utilities/CopyText'
import LoaderSm from '../../Loaders/LoaderSm'
import { refreshLists } from './ZohoCampaignsCommonFunc'
import BackIcn from '../../../Icons/BackIcn'
import { $btcbi } from '../../../GlobalStates'
import { handleAuthorize } from '../IntegrationHelpers/IntegrationHelpers'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function ZohoCampaignsAuthorization({ formID, campaignsConf, setCampaignsConf, step, setstep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const scopes = 'ZohoCampaigns.contact.READ,ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.UPDATE'
  const { zohoCampaigns } = tutorialLinks
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
    refreshLists(formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...campaignsConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setCampaignsConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {zohoCampaigns?.youTubeLink && (
        <TutorialLink
          title={zohoCampaigns?.title}
          youTubeLink={zohoCampaigns?.youTubeLink}
        />
      )}
      {zohoCampaigns?.docLink && (
        <TutorialLink
          title={zohoCampaigns?.title}
          docLink={zohoCampaigns?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={campaignsConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Data Center:', 'bit-integrations')}</b></div>
      <select onChange={handleInput} name="dataCenter" value={campaignsConf.dataCenter} className="btcd-paper-inp w-6 mt-1" disabled={isInfo}>
        <option value="">{__('--Select a data center--', 'bit-integrations')}</option>
        <option value="com">zoho.com</option>
        <option value="eu">zoho.eu</option>
        <option value="com.cn">zoho.com.cn</option>
        <option value="in">zoho.in</option>
        <option value="com.au">zoho.com.au</option>
      </select>
      <div style={{ color: 'red' }}>{error.dataCenter}</div>

      <div className="mt-3"><b>{__('Homepage URL:', 'bit-integrations')}</b></div>
      <CopyText value={`${window.location.origin}`} className="field-key-cpy w-6 ml-0" setSnackbar={setSnackbar} readOnly={isInfo} />

      <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b></div>
      <CopyText value={redirectLocation || `${btcbi.api.base}/redirect`} className="field-key-cpy w-6 ml-0" setSnackbar={setSnackbar} readOnly={isInfo} />

      <small className="d-blk mt-5">
        {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}
        {' '}
        <a className="btcd-link" href={`https://api-console.zoho.${campaignsConf?.dataCenter || 'com'}/`} target="_blank" rel="noreferrer">{__('Zoho API Console', 'bit-integrations')}</a>
      </small>

      <div className="mt-3"><b>{__('Client id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={campaignsConf.clientId} type="text" placeholder={__('Client id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.clientId}</div>

      <div className="mt-3"><b>{__('Client secret:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientSecret" value={campaignsConf.clientSecret} type="text" placeholder={__('Client secret...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.clientSecret}</div>

      {!isInfo && (
        <>
          <button onClick={() => handleAuthorize('zohoCampaigns', 'zcampaigns', scopes, campaignsConf, setCampaignsConf, setError, setisAuthorized, setIsLoading, setSnackbar, btcbi)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
    </div>
  )
}
