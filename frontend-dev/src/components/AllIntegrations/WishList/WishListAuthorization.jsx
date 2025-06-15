/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { handleAuthorize } from './WishListCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function WishListAuthorization({ wishlistConf, setWishlistConf, step, setstep, isLoading, setIsLoading, setSnackbar, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ baseUrl: '', apiKey: '' })
  const { wishlist } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
  }
  const handleInput = e => {
    const newConf = { ...wishlistConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setWishlistConf(newConf)
  }
  const note = `
    <h4> Step of creating baseUrl and apiKey:</h4>
    <ul>
      <li><b>Base URL:</b> URL where you installed WordPress<br/> that's running WishList Member</li><br/>
      <li><b>API KEY:</b>Go to your WishList Member dashboard => Advance Options => API => API URL(API KEY)</li>
  </ul>
  `

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {wishlist?.youTubeLink && (
        <TutorialLink
          title={wishlist?.title}
          youTubeLink={wishlist?.youTubeLink}
        />
      )}
      {wishlist?.docLink && (
        <TutorialLink
          title={wishlist?.title}
          docLink={wishlist?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={wishlistConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('WistList Member URL:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="baseUrl" value={wishlistConf.baseUrl} type="text" placeholder={__('https://form.example.pro', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.baseUrl}</div>

      <div className="mt-3"><b>{__('Password:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="apiKey" value={wishlistConf.apiKey} type="text" placeholder={__('Password...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red' }}>{error.apiKey}</div>

      {!isInfo && (
        <div>
          <button onClick={() => handleAuthorize(wishlistConf, setWishlistConf, setError, setisAuthorized, setIsLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
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
