import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'

export default function AuthorizeButton({ onclick, nextPage, auth, loading }) {
  return (
    <div className="w-6 d-flx flx-between ">
      <button onClick={onclick} className="btn btcd-btn-lg green sh-sm" type="button" disabled={auth || loading}>
        {auth ? __('Authorized ✔') : __('Authorize')}
        {loading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
      </button>
      <br />
      <button onClick={nextPage} className="btn btcd-btn-lg green sh-sm" type="button" disabled={!auth}>
        {__('Next')}
        <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
      </button>
    </div>
  )
}
