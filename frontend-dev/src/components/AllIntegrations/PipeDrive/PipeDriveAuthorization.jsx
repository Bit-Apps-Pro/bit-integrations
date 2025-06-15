/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { handleAuthorize } from './PipeDriveCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function PipeDriveAuthorization({ pipeDriveConf, setPipeDriveConf, step, setstep, isLoading, setIsLoading, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })
  const { pipeDrive } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
  }

  const handleInput = (e) => {
    const newConf = { ...pipeDriveConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setPipeDriveConf(newConf)
  }
  const note = `
    <h4> Step of generate API token:</h4>
    <ul>
      <li>Goto <a href="https://app.pipedrive.com/settings/api">Generate API Token</a></li>
      <li>Copy the <b>Token</b> and paste into <b>API Token</b> field of your authorization form.</li>
      <li>Finally, click <b>Authorize</b> button.</li>
  </ul>
  `

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && 'auto' },
      }}
    >
      {pipeDrive?.youTubeLink && (
        <TutorialLink
          title={pipeDrive?.title}
          youTubeLink={pipeDrive?.youTubeLink}
        />
      )}
      {pipeDrive?.docLink && (
        <TutorialLink
          title={pipeDrive?.title}
          docLink={pipeDrive?.docLink}
        />
      )}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={pipeDriveConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('API Token:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="api_key"
        value={pipeDriveConf.api_key}
        type="text"
        placeholder={__('API Token...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get API token, Please Visit', 'bit-integrations')}
        &nbsp;
        <a
          className="btcd-link"
          href="https://app.pipedrive.com/settings/api"
          target="_blank"
          rel="noreferrer"
        >
          {__('PipeDrive API Token', 'bit-integrations')}
        </a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button
            onClick={() => handleAuthorize(
              pipeDriveConf,
              setError,
              setisAuthorized,
              setIsLoading,
            )}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {isLoading && (
              <LoaderSm size="20" clr="#022217" className="ml-2" />
            )}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn ml-auto btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!isAuthorized}
          >
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}
      <Note note={note} />
    </div>
  )
}
