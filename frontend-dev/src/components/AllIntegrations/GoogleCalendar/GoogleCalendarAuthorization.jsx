/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { getAllGoogleCalendarLists, handleAuthorize } from './GoogleCalendarCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function GoogleCalendarAuthorization({ flowID, googleCalendarConf, setGoogleCalendarConf, step, setStep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const { googleCalendar } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    getAllGoogleCalendarLists(flowID, googleCalendarConf, setGoogleCalendarConf, setIsLoading)
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...googleCalendarConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setGoogleCalendarConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {googleCalendar?.youTubeLink && (
        <TutorialLink
          title={googleCalendar?.title}
          youTubeLink={googleCalendar?.youTubeLink}
        />
      )}
      {googleCalendar?.docLink && (
        <TutorialLink
          title={googleCalendar?.title}
          docLink={googleCalendar?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={googleCalendarConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Homepage URL:', 'bit-integrations')}</b></div>
      <CopyText value={`${window.location.origin}`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />

      <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b></div>
      <CopyText value={redirectLocation || `${btcbi.api.base}/redirect`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />

      <small className="d-blk mt-3">
        {__('To Get Client Id & Secret, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://console.developers.google.com/apis/credentials" target="_blank" rel="noreferrer">{__('Google API Console', 'bit-integrations')}</a>
      </small>

      <div className="mt-3"><b>{__('GoogleCalendar Client Id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={googleCalendarConf.clientId} type="text" placeholder={__('Client Id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.clientId}</div>

      <div className="mt-3"><b>{__('GoogleCalendar Client Secret:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientSecret" value={googleCalendarConf.clientSecret} type="text" placeholder={__('Client Secret...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.clientSecret}</div>

      {!isInfo && (
        <>
          <button onClick={() => handleAuthorize(googleCalendarConf, setGoogleCalendarConf, setIsAuthorized, setIsLoading, setError)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}
    </div>
  )
}
