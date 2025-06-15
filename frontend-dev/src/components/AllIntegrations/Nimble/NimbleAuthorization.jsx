/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { getAllFields, nimbleAuthentication } from './NimbleCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function NimbleAuthorization({ nimbleConf, setNimbleConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '' })
  const { nimble } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !nimbleConf?.default
    setStep(2)
    getAllFields(nimbleConf, setNimbleConf, setLoading)
  }

  const handleInput = e => {
    const newConf = { ...nimbleConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setNimbleConf(newConf)
  }

  const ActiveInstructions = `
            <h4>To Get API Token</h4>
            <ul>
                <li>First go to your Nimble dashboard.</li>
                <li>Click go to "Settings"</li>
                <li>Then Click "API Tokens"</li>
                <li>Then Click "Generate New Token</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {nimble?.youTubeLink && (
        <TutorialLink
          title={nimble?.title}
          youTubeLink={nimble?.youTubeLink}
        />
      )}
      {nimble?.docLink && (
        <TutorialLink
          title={nimble?.title}
          docLink={nimble?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={nimbleConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={nimbleConf.api_key} type="text" placeholder={__('API Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href='https://app.nimble.com/#app/settings/tokens' target='_blank'>{__('Nimble API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => nimbleAuthentication(nimbleConf, setNimbleConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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
      <Note note={ActiveInstructions} />
    </div>
  )
}

