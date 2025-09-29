import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import WishlistMemberAuthorization from './WishlistMemberAuthorization'
import { checkMappedFields, refreshNewsLetter } from './WishlistMemberCommonFunc'
import WishlistMemberIntegLayout from './WishlistMemberIntegLayout'
import Steps from '../../Utilities/Steps'

export default function WishlistMember({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [wishlistMemberConf, setWishlistMemberConf] = useState({
    name: 'Wishlist Member',
    type: 'Wishlist Member',
    field_map: [{ formField: '', wishlistMemberField: '' }],
    wishlistFields: [],
    actions: {}
  })

  const nextPage = val => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(wishlistMemberConf)) {
        setSnackbar({
          show: true,
          msg: __('Please map all required fields to continue.', 'bit-integrations')
        })
        return
      }
      if (wishlistMemberConf.name !== '' && wishlistMemberConf.field_map.length > 0) {
        setStep(val)
      }
    } else {
      setStep(val)
      if (val === 2 && wishlistMemberConf.name) {
        refreshNewsLetter(formID, wishlistMemberConf, setWishlistMemberConf, setIsLoading, setSnackbar)
      }
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <WishlistMemberAuthorization
        formID={formID}
        wishlistMemberConf={wishlistMemberConf}
        setWishlistMemberConf={setWishlistMemberConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <WishlistMemberIntegLayout
          formID={formID}
          formFields={formFields}
          wishlistMemberConf={wishlistMemberConf}
          setWishlistMemberConf={setWishlistMemberConf}
          setSnackbar={setSnackbar}
          setIsLoading={setIsLoading}
        />
        <br />
        <br />
        <br />
        <button
          onClick={() => nextPage(3)}
          disabled={wishlistMemberConf.lists === '' || wishlistMemberConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveIntegConfig(flow, setFlow, allIntegURL, wishlistMemberConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={wishlistMemberConf}
        setDataConf={setWishlistMemberConf}
        formFields={formFields}
      />
    </div>
  )
}
