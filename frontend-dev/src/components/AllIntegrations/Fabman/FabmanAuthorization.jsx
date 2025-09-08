/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { fabmanAuthentication } from './FabmanCommonFunc'
import Note from '../../Utilities/Note'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function FabmanAuthorization({
  fabmanConf,
  setFabmanConf,
  step,
  setStep,
  loading,
  setLoading,
  isInfo
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', apiKey: '' })
  const { fabman } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...fabmanConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setFabmanConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {fabman?.youTubeLink && <TutorialLink title="Fabman" youTubeLink={fabman?.youTubeLink} />}
      {fabman?.docLink && <TutorialLink title="Fabman" docLink={fabman?.docLink} />}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={fabmanConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('API Key:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="apiKey"
        value={fabmanConf.apiKey}
        type="text"
        placeholder={__('Your API Key', 'bit-integrations')}
        disabled={isInfo}
      />
      <div className="mt-3" style={{ color: 'red', fontSize: '15px' }}>
        {error.apiKey}
      </div>

      {!isInfo && (
        <div>
          <button
            onClick={() =>
              fabmanAuthentication(
                fabmanConf,
                setFabmanConf,
                setError,
                setIsAuthorized,
                loading,
                setLoading,
                'authentication'
              )
            }
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isAuthorized || loading.auth}>
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {loading.auth && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>

          <button
            onClick={nextPage}
            className="btn ml-auto btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}
      <Note note={fabmanApiKeyNote} />
    </div>
  )
}

const fabmanApiKeyNote = `<h2>${__('To get your Fabman API key:', 'bit-integrations')}</h2>
     <ul>
         <li>${__('Log in to your <a href="https://fabman.io/" target="_blank">Fabman account</a>.', 'bit-integrations')}</li>
         <li>${__('Go to "Configure" → "Integrations (API & Webhooks)".', 'bit-integrations')}</li>
         <li>${__('Click "Create API key", add a title, and choose a member.', 'bit-integrations')}</li>
         <li>${__('Save, then click "Reveal" to copy your API key.', 'bit-integrations')}</li>
     </ul>`
