/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { getAllRecipient, handleAuthorize } from './RapidmailCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function RapidmailAuthorization({ rapidmailConf, setRapidmailConf, step, setstep, isLoading, setIsLoading, setSnackbar, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ username: '', password: '' })
  const { rapidmail } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !rapidmailConf?.default && getAllRecipient(rapidmailConf, setRapidmailConf, setIsLoading, setSnackbar)
    setstep(2)
  }
  const handleInput = e => {
    const newConf = { ...rapidmailConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setRapidmailConf(newConf)
  }
  const note = `
    <h4> Step of creating username and password:</h4>
    <ul>
      <li>Goto <a href="https://my.rapidmail.com/api/v3/userlist.html#/">Generate API User</a> and create an api user.</li>
      <li>Copy the <b>Username</b> and paste into <b>Username</b> field of your authorization form.</li>
      <li>Copy the <b>Password</b> and paste into <b>Password</b> field of your authorization form.</li>
      <li>Finally, click <b>Authorize</b> button.</li>
  </ul>
  `

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {rapidmail?.youTubeLink && (
        <TutorialLink
          title={rapidmail?.title}
          youTubeLink={rapidmail?.youTubeLink}
        />
      )}
      {rapidmail?.docLink && (
        <TutorialLink
          title={rapidmail?.title}
          docLink={rapidmail?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={rapidmailConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('User Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="username" value={rapidmailConf.username} type="text" placeholder={__('User name...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.username}</div>

      <div className="mt-3"><b>{__('Password:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="password" value={rapidmailConf.password} type="text" placeholder={__('Password...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.password}</div>

      {!isInfo && (
        <div>
          <button onClick={() => handleAuthorize(rapidmailConf, setRapidmailConf, setError, setisAuthorized, setIsLoading, setSnackbar)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn ml-auto btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}
      <Note note={note} />
    </div>
  )
}
