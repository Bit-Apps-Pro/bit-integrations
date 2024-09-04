import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { handleAuthorize } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshLists } from './ZohoMarketingHubCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function ZohoMarketingAuthorization({
  formID,
  marketingHubConf,
  setMarketingHubConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isInfo
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const scopes =
    'ZohoMarketingHub.lead.READ,ZohoMarketingHub.lead.CREATE,ZohoMarketingHub.lead.UPDATE'
  const { zohoMarketingHub } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
    refreshLists(formID, marketingHubConf, setMarketingHubConf, setIsLoading, setSnackbar)
  }

  const handleInput = (e) => {
    const newConf = { ...marketingHubConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setMarketingHubConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {zohoMarketingHub?.youTubeLink && (
        <TutorialLink
          title="Zoho Marketing Automation (Zoho Marketing Hub)"
          youTubeLink={zohoMarketingHub?.youTubeLink}
        />
      )}
      {zohoMarketingHub?.docLink && (
        <TutorialLink
          title="Zoho Marketing Automation (Zoho Marketing Hub)"
          docLink={zohoMarketingHub?.docLink}
        />
      )}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={marketingHubConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('Data Center:', 'bit-integrations')}</b>
      </div>
      <select
        onChange={handleInput}
        name="dataCenter"
        value={marketingHubConf.dataCenter}
        className="btcd-paper-inp w-6 mt-1"
        disabled={isInfo}>
        <option value="">{__('--Select a data center--', 'bit-integrations')}</option>
        <option value="com">zoho.com</option>
        <option value="eu">zoho.eu</option>
        <option value="com.cn">zoho.com.cn</option>
        <option value="in">zoho.in</option>
        <option value="com.au">zoho.com.au</option>
      </select>
      <div style={{ color: 'red' }}>{error.dataCenter}</div>

      <div className="mt-3">
        <b>{__('Homepage URL:', 'bit-integrations')}</b>
      </div>
      <CopyText
        value={`${window.location.origin}`}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
        setSnackbar={setSnackbar}
      />

      <div className="mt-3">
        <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
      </div>
      <CopyText
        value={redirectLocation || `${btcbi.api.base}/redirect`}
        className="field-key-cpy w-6 ml-0"
        setSnackbar={setSnackbar}
        readOnly={isInfo}
      />

      <small className="d-blk mt-5">
        {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}{' '}
        <a
          className="btcd-link"
          href={`https://api-console.zoho.${marketingHubConf?.dataCenter || 'com'}/`}
          target="_blank"
          rel="noreferrer">
          {__('Zoho API Console', 'bit-integrations')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Client id:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientId"
        value={marketingHubConf.clientId}
        type="text"
        placeholder={__('client ID...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.clientId}</div>

      <div className="mt-3">
        <b>{__('Client secret:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientSecret"
        value={marketingHubConf.clientSecret}
        type="text"
        placeholder={__('client Secret...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.clientSecret}</div>

      {!isInfo && (
        <>
          <button
            onClick={() =>
              handleAuthorize(
                'zohoMarkatingHub',
                'zmarketingHub',
                scopes,
                marketingHubConf,
                setMarketingHubConf,
                setError,
                setisAuthorized,
                setIsLoading,
                setSnackbar,
                btcbi
              )
            }
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}>
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
    </div>
  )
}
