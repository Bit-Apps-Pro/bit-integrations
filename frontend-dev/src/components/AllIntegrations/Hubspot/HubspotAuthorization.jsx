/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { hubspotAuthorization } from './HubspotCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function HubspotAuthorization({ hubspotConf, setHubspotConf, step, setstep, isInfo, loading, setLoading }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })
  const { hubspot } = tutorialLinks

  const handleInput = e => {
    const newConf = { ...hubspotConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setHubspotConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
  }

  const note = `
    <h4> Step of generating Access Token:</h4>
    <ul>
      <li>Login to your HubSpot account, click the <b>Settings</b> icon settings in the main navigation bar..</li>
      <li>In the left sidebar menu, navigate to <b>Integrations > Private App</b>.</li>
      <li>Give name and description and select all necessary scope.</li>
      <li>Then create Access token.</li>
  </ul>
  `

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {hubspot?.youTubeLink && (
        <TutorialLink
          title={hubspot?.title}
          youTubeLink={hubspot?.youTubeLink}
        />
      )}
      {hubspot?.docLink && (
        <TutorialLink
          title={hubspot?.title}
          docLink={hubspot?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={hubspotConf?.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Hubspot Access Token:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={hubspotConf.api_key} type="text" placeholder={__('Access token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.api_key}</div>

      {!isInfo && (
        <>
          <button onClick={() => hubspotAuthorization(hubspotConf, setError, setisAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {loading.auth && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
      <Note note={note} />
    </div>
  )
}
