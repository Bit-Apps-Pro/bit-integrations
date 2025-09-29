import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import LoaderSm from '../../Loaders/LoaderSm'
import BackIcn from '../../../Icons/BackIcn'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import { handleAuthorize } from './WishlistMemberCommonFunc'
import { create } from 'mutative'

export default function WishlistMemberAuthorization({
  formID,
  wishlistMemberConf,
  setWishlistMemberConf,
  step,
  nextPage,
  setSnackbar,
  isInfo
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { wishlistMember } = tutorialLinks

  const setIntegrationName = e => {
    setWishlistMemberConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[e.target.name] = e.target.value
      })
    )
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: '800px', height: 'auto' } }}>
      {wishlistMember?.youTubeLink && (
        <TutorialLink title="WishlistMember" youTubeLink={wishlistMember?.youTubeLink} />
      )}
      {wishlistMember?.docLink && (
        <TutorialLink title="WishlistMember" docLink={wishlistMember?.docLink} />
      )}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-7 mt-1"
        onChange={setIntegrationName}
        name="name"
        value={wishlistMemberConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <button
        onClick={() => handleAuthorize(setIsAuthorized, setIsLoading, setSnackbar)}
        className="btn btcd-btn-lg purple sh-sm flx"
        type="button"
        disabled={isAuthorized || isLoading}>
        {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
        {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
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
    </div>
  )
}
