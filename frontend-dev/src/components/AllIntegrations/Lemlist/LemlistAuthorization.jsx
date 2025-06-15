import { useState } from 'react'
import { toast } from 'react-hot-toast'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { refreshLemlistCampaign } from './LemlistCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function LemlistAuthorization({ lemlistConf, setLemlistConf, step, setstep, setSnackbar, isInfo, isLoading, setIsLoading }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const { lemlist } = tutorialLinks

  const handleAuthorize = () => {
    const newConf = { ...lemlistConf }
    if (!newConf.name || !newConf.api_key) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bit-integrations') : '',
        api_key: !newConf.api_key ? __('Access Api Key cann\'t be empty', 'bit-integrations') : '',
      })
      return
    }
    setIsLoading('auth')

    const data = {
      api_key: newConf.api_key,
    }

    bitsFetch(data, 'lemlist_authorize')
      .then(result => {
        if (result && result.success) {
          const newConf = { ...lemlistConf }
          newConf.tokenDetails = result.data
          setLemlistConf(newConf)
          setisAuthorized(true)
          toast.success(__('Authorized Successfully', 'bit-integrations'))
        } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
          toast.error(`${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`)
        } else {
          toast.error(__('Authorization failed. please try again', 'bit-integrations'))
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...lemlistConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setLemlistConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    refreshLemlistCampaign(lemlistConf, setLemlistConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  const ActiveInstructions = `
            <h4>Get Api key</h4>
            <ul>
                <li>First go to your Lemlist dashboard.</li>
                <li>Click on the "Team Setting" from sidebar</li>
                <li>Then Click "Integrations"</li>
                <li>Then click "Api", Then click "Generate Api Key"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {lemlist?.youTubeLink && (
        <TutorialLink
          title={lemlist?.title}
          youTubeLink={lemlist?.youTubeLink}
        />
      )}
      {lemlist?.docLink && (
        <TutorialLink
          title={lemlist?.title}
          docLink={lemlist?.docLink}
        />
      )}

      <div className="mt-3 wdt-200"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={lemlistConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <div className="mt-3 wdt-250"><b>{__('Access Api Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={lemlistConf.api_key} type="text" placeholder={__('Access Api Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get Api Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://api.lemlist.com/teams/tea_beEpCu2irsJfn3PJr/settings/integrations#api" target="_blank" rel="noreferrer">{__('Lemlist API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />
      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking Api Key!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          Sorry, Api key is invalid
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
