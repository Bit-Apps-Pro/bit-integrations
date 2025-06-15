import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import Note from '../../Utilities/Note'
import { handleAuthorize, zoomAllWebinar } from './ZoomCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function ZoomWebinarAuthorization({ formID, zoomWebinarConf, setZoomWebinarConf, step, setStep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const { zoomWebinar } = tutorialLinks

  const handleInput = e => {
    const newConf = { ...zoomWebinarConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setZoomWebinarConf(newConf)
  }
  const nextPage = () => {
    zoomAllWebinar(formID, zoomWebinarConf, setZoomWebinarConf, setIsLoading, setSnackbar)
    setStep(2)
  }

  const ZoomInstructions = `<h4>Pro or higher plan only .</h4>
  <h4>Client Id and Client Secret generate with OAuth .</h4>
  <h4>Scope:</h4>
  <ul>
      <li>User:<b>'user:master, user:read:admin, user:write:admin'</b> </li>
      <li>Webinar:<b>'webinar:master, webinar:read:admin, webinar:write:admin'</b> </li>
  </ul>
  <h4>Redirect URIs add also in <b>'Add allow lists'</b></h4>
  <h4>Zoom Settings :</h4>
  <ul>
      <li>Registration:<b>Required</b> </li>
      <li>Participant:<b>On</b> </li>
  </ul>
  `
  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && `${100}%` } }}>
      {zoomWebinar?.youTubeLink && (
        <TutorialLink
          title={zoomWebinar?.title}
          youTubeLink={zoomWebinar?.youTubeLink}
        />
      )}
      {zoomWebinar?.docLink && (
        <TutorialLink
          title={zoomWebinar?.title}
          docLink={zoomWebinar?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={zoomWebinarConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Homepage URL:', 'bit-integrations')}</b></div>
      <CopyText value={`${window.location.origin}`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />

      <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b></div>
      <CopyText value={redirectLocation || `${btcbi.api.base}/redirect`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />

      <small className="d-blk mt-5">
        {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}
        {' '}
        <a className="btcd-link" href="https://marketplace.zoom.us/develop/create" target="_blank" rel="noreferrer">{__('Get Zoom client id and secret', 'bit-integrations')}</a>
      </small>

      <div className="mt-3"><b>{__('Client id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={zoomWebinarConf.clientId} type="text" placeholder={__('Client id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>

      <div className="mt-3"><b>{__('Client secret:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientSecret" value={zoomWebinarConf.clientSecret} type="text" placeholder={__('Client secret...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>
      {!isInfo && (
        <>
          <button onClick={() => handleAuthorize(zoomWebinarConf, setZoomWebinarConf, setError, setisAuthorized, setIsLoading, setSnackbar)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized}>
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
        note={ZoomInstructions}
      />
    </div>
  )
}
