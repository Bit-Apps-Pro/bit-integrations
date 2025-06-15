import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { handleMailupAuthorize, fetchAllList } from './MailupCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function MailupAuthorization({ formID, mailupConf, setMailupConf, step, setStep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '' })
  const { mailup } = tutorialLinks
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setStep(2)
    fetchAllList(mailupConf, setMailupConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...mailupConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setMailupConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {mailup?.youTubeLink && (
        <TutorialLink
          title={mailup?.title}
          youTubeLink={mailup?.youTubeLink}
        />
      )}
      {mailup?.docLink && (
        <TutorialLink
          title={mailup?.title}
          docLink={mailup?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={mailupConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b></div>
      <CopyText value={redirectLocation || `${window.location.href}`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />
      <div className="mt-3"><b>{__('Client id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={mailupConf.clientId} type="text" placeholder={__('Client id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>

      <div className="mt-3"><b>{__('Client secret:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientSecret" value={mailupConf.clientSecret} type="text" placeholder={__('Client secret...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>
      {!isInfo && (
        <>
          <button onClick={() => handleMailupAuthorize('mailup', mailupConf, setMailupConf, setError, setIsAuthorized, setIsLoading, setSnackbar)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
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
