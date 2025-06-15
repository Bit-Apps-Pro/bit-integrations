import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { handleAuthorize } from './FreshdeskCommonFunc'
import Note from '../../Utilities/Note'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function FreshdeskAuthorization({ formID,
  freshdeskConf,
  setFreshdeskConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ api_key: '' })
  const { freshdesk } = tutorialLinks
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }
  const handleInput = (e) => {
    const newConf = { ...freshdeskConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setFreshdeskConf(newConf)
  }

  const freshdeskInstructions = `
            <h4>App Domain Exmple</h4>
            <ul>
                <li>https://domain-help.freshdesk.com/</li>
            </ul>`

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && 'auto' },
      }}
    >
      {freshdesk?.youTubeLink && (
        <TutorialLink
          title={freshdesk?.title}
          youTubeLink={freshdesk?.youTubeLink}
        />
      )}
      {freshdesk?.docLink && (
        <TutorialLink
          title={freshdesk?.title}
          docLink={freshdesk?.docLink}
        />
      )}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={freshdeskConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <small className="d-blk mt-5">
        {__('To get access Token , Please Visit', 'bit-integrations')}
        {' '}
        <a
          className="btcd-link"
          href="https://bitcode-help.freshdesk.com/a/profiles/72009210017/edit"
          target="_blank"
          rel="noreferrer"
        >
          {__('FreshDesk Console', 'bit-integrations')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Your App Domain:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="app_domain"
        value={freshdeskConf.app_domain}
        type="text"
        placeholder={__('App Domain...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.app_domain}</div>

      <div className="mt-3">
        <b>{__('App api key:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="api_key"
        value={freshdeskConf.api_key}
        type="text"
        placeholder={__('Access Token...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red' }}>{error.api_key}</div>

      {!isInfo && (
        <>
          <button
            onClick={() => handleAuthorize(
              freshdeskConf,
              setFreshdeskConf,
              setError,
              setisAuthorized,
              setIsLoading,
              setSnackbar,
            )}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!isAuthorized}
          >
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}

      <Note
        note={freshdeskInstructions}
      />
    </div>
  )
}
