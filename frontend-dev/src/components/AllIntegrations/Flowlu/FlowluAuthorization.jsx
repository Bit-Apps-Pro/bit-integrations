/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { flowluAuthentication } from './FlowluCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function FlowluAuthorization({ flowluConf, setFlowluConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '', company_name: '' })
  const { flowlu } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !flowluConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...flowluConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setFlowluConf(newConf)
  }

  const handleSessionTokenLink = () => {
    flowluConf.company_name
      ? window.open(
        `https://${flowluConf.company_name}.flowlu.com/cabinet/all_settings?section=api`,
        '_blank',
        'noreferrer'
      )
      : toast.error(
        __("Company Name is required!", "bit-integrations")
      )
  }

  const ActiveInstructions = `
            <h4>Get the API Key</h4>
            <ul>
                <li>First go to your Flowlu dashboard.</li>
                <li>Click go to your "Profile" from Right top corner</li>
                <li>Then Click "Portal Settings"</li>
                <li>Click go to "API Settings" from "Main Settings"</li>
                <li>Then click "create", Then Copy</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {flowlu?.youTubeLink && (
        <TutorialLink
          title={flowlu?.title}
          youTubeLink={flowlu?.youTubeLink}
        />
      )}
      {flowlu?.docLink && (
        <TutorialLink
          title={flowlu?.title}
          docLink={flowlu?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={flowluConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={flowluConf.api_key} type="text" placeholder={__('Session Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <div className="mt-3"><b>{__('Company Name:', 'bit-integrations')}</b></div>

      <div className="btcd-input-group w-6 mt-1">
        <div className="btcd-input-group-icon">https://</div>
        <div className="btcd-input-group-area">
          <input className="btcd-paper-inp" onChange={handleInput} name="company_name" value={flowluConf.company_name} type="text" placeholder={__('Link Name...', 'bit-integrations')} disabled={isInfo} />
        </div>
        <div className="btcd-input-group-icon">.flowlu.com</div>
      </div>
      <div style={{ color: 'red', fontSize: '15px' }}>{error.company_name}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" onClick={handleSessionTokenLink}>{__('Flowlu API Key', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => flowluAuthentication(flowluConf, setFlowluConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

