import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { refreshConvertKitForm } from './ConvertKitCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function ConvertKitAuthorization({ formID, convertKitConf, setConvertKitConf, step, setstep, setSnackbar, isInfo, isLoading, setIsLoading }) {
  const { convertKit } = tutorialLinks
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_secret: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)

  const handleAuthorize = () => {
    const newConf = { ...convertKitConf }
    if (!newConf.name || !newConf.api_secret) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bit-integrations') : '',
        api_secret: !newConf.api_secret ? __('Access API Secret Key cann\'t be empty', 'bit-integrations') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = {
      api_secret: newConf.api_secret,
    }
    bitsFetch(data, 'convertKit_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...convertKitConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setConvertKitConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    refreshConvertKitForm(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  const ActiveInstructions = `
            <h4>Get api secret key</h4>
            <ul>
                <li>First go to your ConvertKit dashboard.</li>
                <li>Click "Settings", Then click "Advanced"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {convertKit?.youTubeLink && (
        <TutorialLink
          title={convertKit?.title}
          youTubeLink={convertKit?.youTubeLink}
        />
      )}
      {convertKit?.docLink && (
        <TutorialLink
          title={convertKit?.title}
          docLink={convertKit?.docLink}
        />
      )}

      <div className="mt-3 wdt-200"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={convertKitConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <div className="mt-3 wdt-200"><b>{__('Access API Secret Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_secret" value={convertKitConf.api_secret} type="text" placeholder={__('Access API Secret Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_secret}</div>

      <small className="d-blk mt-3">
        {__('To Get API Secret Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://app.convertkit.com/account_settings/advanced_settings" target="_blank" rel="noreferrer">{__('ConvertKit API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking API Secret Key!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          Sorry, API Secret key is invalid
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
      <Note
        note={ActiveInstructions}
      />
    </div>
  )
}
