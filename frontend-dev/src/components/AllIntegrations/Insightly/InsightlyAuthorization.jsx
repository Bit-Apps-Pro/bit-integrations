/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { insightlyAuthentication } from './InsightlyCommonFunc'
import TutorialLink from '../../Utilities/TutorialLink'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'

export default function InsightlyAuthorization({ insightlyConf, setInsightlyConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '', api_url: '' })
  const { insightly } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !insightlyConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...insightlyConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setInsightlyConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {insightly?.youTubeLink && (
        <TutorialLink
          title={insightly?.title}
          youTubeLink={insightly?.youTubeLink}
        />
      )}
      {insightly?.docLink && (
        <TutorialLink
          title={insightly?.title}
          docLink={insightly?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={insightlyConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Your API URL:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_url" value={insightlyConf.api_url} type="text" placeholder={__('Your Organisation...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_url}</div>
      <small className="d-blk mt-3">
        {__('Example: {name}.insightly.com', 'bit-integrations')}
      </small>
      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={insightlyConf.api_key} type="text" placeholder={__('API Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>
      {insightlyConf.api_url && (
        <small className="d-blk mt-3">
          {__('To Get API token, Please Visit', 'bit-integrations')}
          &nbsp;
          <a className="btcd-link" href={`https://crm.${insightlyConf.api_url}/Users/UserSettings#`} target="_blank" rel="noreferrer">{__('Insightly API Token', 'bit-integrations')}</a>
        </small>
      )}
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => insightlyAuthentication(insightlyConf, setInsightlyConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {loading.auth && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn ml-auto btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}
    </div>
  )
}
