/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { coppercrmAuthentication } from './CopperCRMCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function CopperCRMAuthorization({ coppercrmConf, setCopperCRMConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '', api_email: '' })
  const { coppercrm } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !coppercrmConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...coppercrmConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setCopperCRMConf(newConf)
  }

  const ActiveInstructions = `
  <h4>Get api secret key</h4>
  <ul>
      <li>First go to your Copper dashboard.</li>
      <li>Then click Settings from Navbar.</li>
      <li>Click "Integrations", Then click "API Keys"</li>
  </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {coppercrm?.youTubeLink && (
        <TutorialLink
          title={coppercrm?.title}
          youTubeLink={coppercrm?.youTubeLink}
        />
      )}
      {coppercrm?.docLink && (
        <TutorialLink
          title={coppercrm?.title}
          docLink={coppercrm?.docLink}
        />
      )}

      <div className="mt-3"><bapi_email>{__('Integration Name:', 'bit-integrations')}</bapi_email></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={coppercrmConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Your API Email:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_email" value={coppercrmConf.api_email} type="text" placeholder={__('Your Company...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_email}</div>
      {/* <small className="d-blk mt-3">
        {__('Example: {name}.coppercrm.com', 'bit-integrations')}
      </small> */}
      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={coppercrmConf.api_key} type="text" placeholder={__('API Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => coppercrmAuthentication(coppercrmConf, setCopperCRMConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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
      <Note
        note={ActiveInstructions}
      />
    </div>

  )
}
