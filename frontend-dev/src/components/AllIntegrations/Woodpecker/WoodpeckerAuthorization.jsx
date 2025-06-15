/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { woodpeckerAuthentication } from './WoodpeckerCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function WoodpeckerAuthorization({ woodpeckerConf, setWoodpeckerConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_token: '' })
  const { woodpecker } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !woodpeckerConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...woodpeckerConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setWoodpeckerConf(newConf)
  }

  const ActiveInstructions = `
            <h4>Get API Key</h4>
            <ul>
                <li> Log into your Woodpecker account on <a className="btcd-link" href="https://app.woodpecker.co/panel" target="_blank">app.woodpecker.co.</a></li>
                <li>Go to the <b>Marketplace</b> → <b>INTEGRATIONS</b> → <b>API keys</b>.</li>
                <li>Use the green button to <b>CREATE A KEY</b>.</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {woodpecker?.youTubeLink && (
        <TutorialLink
          title={woodpecker?.title}
          youTubeLink={woodpecker?.youTubeLink}
        />
      )}
      {woodpecker?.docLink && (
        <TutorialLink
          title={woodpecker?.title}
          docLink={woodpecker?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={woodpeckerConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={woodpeckerConf.api_key} type="text" placeholder={__('API Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://app.woodpecker.co/panel?u=411340#marketplace/integrations/api-keys" target="_blank">{__('Woodpecker API Key', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => woodpeckerAuthentication(woodpeckerConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

