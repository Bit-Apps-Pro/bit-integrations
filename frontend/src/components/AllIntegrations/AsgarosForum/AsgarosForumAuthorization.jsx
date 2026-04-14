import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { asgarosForumAuthentication } from './AsgarosForumCommonFunc'

export default function AsgarosForumAuthorization({
  asgarosForumConf,
  setAsgarosForumConf,
  step,
  nextPage,
  isLoading,
  setIsLoading,
  isInfo
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ name: '' })

  const handleInput = e => {
    const newConf = { ...asgarosForumConf }
    newConf[e.target.name] = e.target.value
    setAsgarosForumConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={asgarosForumConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <Note
        note={__(
          'To use Asgaros Forum integration, make sure the Asgaros Forum plugin is installed and active on your site.',
          'bit-integrations'
        )}
      />

      {!isInfo && (
        <>
          <button
            onClick={() =>
              asgarosForumAuthentication(
                asgarosForumConf,
                setAsgarosForumConf,
                setError,
                setIsAuthorized,
                setIsLoading
              )
            }
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
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}
    </div>
  )
}
