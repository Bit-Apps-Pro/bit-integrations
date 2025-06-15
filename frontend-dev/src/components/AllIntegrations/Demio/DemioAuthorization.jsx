/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { demioAuthentication, getAllEvents } from './DemioCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function DemioAuthorization({ demioConf, setDemioConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { demio } = tutorialLinks
  const [error, setError] = useState({ api_key: '', api_secret: '' })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !demioConf?.default
    setStep(2)
    getAllEvents(demioConf, setDemioConf, setLoading)
  }

  const handleInput = e => {
    const newConf = { ...demioConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setDemioConf(newConf)
  }

  const ActiveInstructions = `
            <h4>To Get API Key & API Secret</h4>
            <ul>
                <li>First go to your Demio dashboard.</li>
                <li>Click go to "Settings" from Right Top corner</li>
                <li>Then Click "API" from the "Settings Menu"</li>
                <li>Then Click "Generate Api Secret"</li>
                <li>Then copy "API Authorization Credentials"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {demio?.youTubeLink && (
        <TutorialLink
          title={demio?.title}
          youTubeLink={demio?.youTubeLink}
        />
      )}
      {demio?.docLink && (
        <TutorialLink
          title={demio?.title}
          docLink={demio?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={demioConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={demioConf.api_key} type="text" placeholder={__('API Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <div className="mt-3"><b>{__('API Secret:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_secret" value={demioConf.api_secret} type="text" placeholder={__('API Secret...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_secret}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key & API Secret, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href='https://my.demio.com/manage/settings/api-details' target='_blank'>{__('Demio API Key & Secret', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => demioAuthentication(demioConf, setDemioConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

