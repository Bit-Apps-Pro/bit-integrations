/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { suiteDashAuthentication } from './SuiteDashCommonFunc'
import Note from '../../Utilities/Note'
import { toast } from 'react-hot-toast'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function SuiteDashAuthorization({ suiteDashConf, setSuiteDashConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ session_token: '' })
  const { suiteDash } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !suiteDashConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...suiteDashConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setSuiteDashConf(newConf)
  }

  const ActiveInstructions = `
            <h4>To Get Public Id & Secret Key</h4>
            <ul>
                <li>First go to your SuiteDash dashboard.</li>
                <li>Click go to your "Profile" from Right top corner</li>
                <li>Then Click "Integrations"</li>
                <li>Then Click "Secure Api"</li>
                <li>Then copy "API Authorization Credentials"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {suiteDash?.youTubeLink && (
        <TutorialLink
          title={suiteDash?.title}
          youTubeLink={suiteDash?.youTubeLink}
        />
      )}
      {suiteDash?.docLink && (
        <TutorialLink
          title={suiteDash?.title}
          docLink={suiteDash?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={suiteDashConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Public Id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="public_id" value={suiteDashConf.public_id} type="text" placeholder={__('Public Id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.public_id}</div>

      <div className="mt-3"><b>{__('Secret Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="secret_key" value={suiteDashConf.secret_key} type="text" placeholder={__('Secret Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.secret_key}</div>

      <small className="d-blk mt-3">
        {__('To Get Public Id & Secret Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href='https://app.suitedash.com/integrations/publicApi?t=authentication' target='_blank'>{__('SuiteDash Public Id & Secret Key', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => suiteDashAuthentication(suiteDashConf, setSuiteDashConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

