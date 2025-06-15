import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { handleTrelloAuthorize, fetchAllBoard } from './TrelloCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function TrelloAuthorization({ formID, trelloConf, setTrelloConf, step, setstep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '' })
  const { trello } = tutorialLinks
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    fetchAllBoard(formID, trelloConf, setTrelloConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...trelloConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setTrelloConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {trello?.youTubeLink && (
        <TutorialLink
          title={trello?.title}
          youTubeLink={trello?.youTubeLink}
        />
      )}
      {trello?.docLink && (
        <TutorialLink
          title={trello?.title}
          docLink={trello?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={trelloConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b></div>
      <CopyText value={redirectLocation || `${window.location.href}`} className="field-key-cpy w-6 ml-0" readOnly={isInfo} setSnackbar={setSnackbar} />

      <small className="d-blk mt-5">
        {__('To get Client ID , Please Visit', 'bit-integrations')}
        {' '}
        <a className="btcd-link" href="https://trello.com/app-key/" target="_blank" rel="noreferrer">{__('Trello API Console', 'bit-integrations')}</a>
      </small>

      <div className="mt-3"><b>{__('Client id:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="clientId" value={trelloConf.clientId} type="text" placeholder={__('Client id...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>

      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>
      {!isInfo && (
        <>
          <button onClick={() => handleTrelloAuthorize('trello', 'trello', trelloConf, setTrelloConf, setError, setisAuthorized, setIsLoading, setSnackbar)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
    </div>
  )
}
