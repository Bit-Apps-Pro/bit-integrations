import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { __, sprintf } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function AffiliateAuthorization({
  formID,
  affiliateConf,
  setAffiliateConf,
  step,
  setStep,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const { affiliate } = tutorialLinks

  const authorizeHandler = () => {
    setIsLoading('auth')
    bitsFetch({}, 'affiliate_authorize').then((result) => {
      if (result?.success) {
        setisAuthorized(true)
        setSnackbar({
          show: true,
          msg: __('Connected with Affiliate Successfully', 'bit-integrations')
        })
      }
      setIsLoading(false)
      setShowAuthMsg(true)
    })
  }

  const handleInput = (e) => {
    const newConf = deepCopy(affiliateConf)
    newConf[e.target.name] = e.target.value
    setAffiliateConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{
        width: step === 1 && 900,
        height: step === 1 && 'auto'
      }}>
      {affiliate?.youTubeLink && (
        <TutorialLink title="AffiliateWP" youTubeLink={affiliate?.youTubeLink} />
      )}
      {affiliate?.docLink && <TutorialLink title="AffiliateWP" docLink={affiliate?.docLink} />}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={affiliateConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
      />

      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking if LearnDash is active!!!
        </div>
      )}

      {showAuthMsg && !isAuthorized && !isLoading && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          {sprintf(
            __(
              '%s plugin must be activated to integrate with Bit Integrations',
              'bit-integrations'
            ),
            'Affiliate plugin'
          )}
        </div>
      )}

      {!isAuthorized && (
        <button
          onClick={authorizeHandler}
          className="btn btcd-btn-lg purple sh-sm flx mt-5"
          type="button">
          {__('Connect', 'bit-integrations')}
        </button>
      )}

      {isAuthorized && (
        <button
          onClick={() => setStep(2)}
          className="btn btcd-btn-lg purple sh-sm flx mt-5"
          type="button"
          disabled={!isAuthorized}>
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      )}
    </div>
  )
}
