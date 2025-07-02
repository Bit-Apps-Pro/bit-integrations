import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { handleAuthorize } from './LineCommonFunc'
import Note from '../../Utilities/Note'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function LineAuthorization({
  formID,
  lineConf,
  setLineConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isInfo
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ accessToken: '' })
  const { line } = tutorialLinks
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }
  const handleInput = e => {
    const newConf = { ...lineConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setLineConf(newConf)
  }

  const lineInstructions = `
            <h4>${__('Get Access Token few step', 'bit-integrations')}</h4>
            <ul>
                <li>${__('First create app.', 'bit-integrations')}</li>
                <li>${__("Add an OAuth Scope <b>'channels:read, channels:write, chat:write, files:read, files:write'</b>.", 'bit-integrations')}</li>
                <li>${__("Generate Access Token clicking <b> 'install to Workspace'</b>.", 'bit-integrations')}</li>
            </ul>`

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && 'auto' }
      }}>
      {line?.youTubeLink && <TutorialLink title="Line" youTubeLink={line?.youTubeLink} />}
      {line?.docLink && <TutorialLink title="Line" docLink={line?.docLink} />}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={lineConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <small className="d-blk mt-5">
        {__('To get access Token , Please Visit', 'bit-integrations')}{' '}
        <a
          className="btcd-link"
          href="https://developers.line.biz/console/"
          target="_blank"
          rel="noreferrer">
          {__('Line Console', 'bit-integrations')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Access Token:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="accessToken"
        value={lineConf.accessToken}
        type="text"
        placeholder={__('Access Token...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.accessToken}</div>

      {!isInfo && (
        <>
          <button
            onClick={() =>
              handleAuthorize(
                lineConf,
                setLineConf,
                setError,
                setisAuthorized,
                setIsLoading,
                setSnackbar
              )
            }
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}>
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}

      {/* <Note note={lineInstructions} /> */}
    </div>
  )
}
