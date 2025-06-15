import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { refreshDripCampaign } from './DripCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function DripAuthorization({ formID, dripConf, setDripConf, step, setstep, setSnackbar, isInfo, isLoading, setIsLoading }) {
  const { drip } = tutorialLinks
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_token: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)

  const handleAuthorize = () => {
    const newConf = { ...dripConf }
    if (!newConf.name || !newConf.api_token) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bit-integrations') : '',
        api_token: !newConf.api_token ? __('Access Api Token Key cann\'t be empty', 'bit-integrations') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = {
      api_token: newConf.api_token,
    }
    bitsFetch(data, 'drip_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          newConf.account_id = result.data.accounts[0].id
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
        }
        setDripConf({ ...newConf });
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...dripConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setDripConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    refreshDripCampaign(dripConf, setDripConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  const ActiveInstructions = `
            <h4>Get client id and Api Token key</h4>
            <ul>
                <li>First go to your Drip dashboard.</li>
                <li>Click "Integrations", Then click "Api Keys"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {drip?.youTubeLink && (
        <TutorialLink
          title={drip?.title}
          youTubeLink={drip?.youTubeLink}
        />
      )}
      {drip?.docLink && (
        <TutorialLink
          title={drip?.title}
          docLink={drip?.docLink}
        />
      )}

      <div className="mt-3 wdt-200"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={dripConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <div className="mt-3 wdt-250"><b>{__('Access Api Token Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_token" value={dripConf.api_token} type="text" placeholder={__('Access Api Token Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_token}</div>

      <small className="d-blk mt-3">
        {__('To Get Client Id and Api Token Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://app.directiq.com/integrations/apikeys" target="_blank" rel="noreferrer">{__('Drip API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />
      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking Api Token Key!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          Sorry, Api Token key is invalid
        </div>
      )}
      {!isInfo && (
        <>
          <button onClick={handleAuthorize} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
      <Note note={ActiveInstructions} />
    </div>
  )
}
