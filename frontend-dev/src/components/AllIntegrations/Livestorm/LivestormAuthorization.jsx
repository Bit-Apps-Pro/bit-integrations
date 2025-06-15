/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { getAllEvents, livestormAuthentication } from './LivestormCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function LivestormAuthorization({ livestormConf, setLivestormConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '' })
  const { livestorm } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !livestormConf?.default
    setStep(2)
    getAllEvents(livestormConf, setLivestormConf, setLoading)
  }

  const handleInput = e => {
    const newConf = { ...livestormConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setLivestormConf(newConf)
  }

  const ActiveInstructions = `
            <h4>To Get API Token</h4>
            <ul>
                <li>First go to your Livestorm dashboard.</li>
                <li>Click go to "Account Settings"</li>
                <li>Then Click "App marketplace"</li>
                <li>Then Click "Public API" card</li>
                <li>Then you'll be able to generate your own API tokens</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {livestorm?.youTubeLink && (
        <TutorialLink
          title={livestorm?.title}
          youTubeLink={livestorm?.youTubeLink}
        />
      )}
      {livestorm?.docLink && (
        <TutorialLink
          title={livestorm?.title}
          docLink={livestorm?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={livestormConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={livestormConf.api_key} type="text" placeholder={__('API Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href='https://app.livestorm.co/#/settings?page=settings&tab=integrations&id=public-api' target='_blank'>{__('Livestorm API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => livestormAuthentication(livestormConf, setLivestormConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

