import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { highLevelAuthentication } from './HighLevelCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import toast from 'react-hot-toast'

export default function HighLevelAuthorization({
  formID,
  highLevelConf,
  setHighLevelConf,
  step,
  setstep,
  isInfo,
  loading,
  setLoading
}) {
  const { highLevel } = tutorialLinks
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', api_key: '' })

  const handleInput = (e) => {
    const newConf = { ...highLevelConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setHighLevelConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }

  const ActiveInstructions = `
            <h4>${__('Get GoHighLevel Api Key', 'bit-integrations')}</h4>
            <ul>
                <li>${__('First go to your GoHighLevel sub account settings then business profile tab', 'bit-integrations')}.</li>
                <li>${__('Copy the the API key.', 'bit-integrations')}</li>
                <li>${__('You can also get the API key from Agency view. Navigate to settings then API keys tab.', 'bit-integrations')}</li>
            </ul>`

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {highLevel?.youTubeLink && (
        <TutorialLink title="HighLevel" youTubeLink={highLevel?.youTubeLink} />
      )}
      {highLevel?.docLink && <TutorialLink title="HighLevel" docLink={highLevel?.docLink} />}

      <div className="mt-3 wdt-200">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={highLevelConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <div className="mt-3 wdt-250">
        <b>{__('GoHighLevel Api Key:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="api_key"
        value={highLevelConf.api_key}
        type="text"
        placeholder={__('GoHighLevel Api Key...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__(
          'To get API key, go to Settings > Business Profile and copy the API Key from there.',
          'bit-integrations'
        )}
      </small>
      <br />

      {!isInfo && (
        <>
          <button
            onClick={() =>
              highLevelAuthentication(
                highLevelConf,
                setHighLevelConf,
                setError,
                setisAuthorized,
                loading,
                setLoading
              )
            }
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isAuthorized || loading.auth}>
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {loading.auth && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button
            onClick={() => nextPage(2)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
      <Note note={ActiveInstructions} />
    </div>
  )
}
