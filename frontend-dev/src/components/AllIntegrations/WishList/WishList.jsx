/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './WishListCommonFunc'
import WishListAuthorization from './WishListAuthorization'
import WishListIntegLayout from './WishListIntegLayout'

function WishList({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const memberFields = [
    { key: 'user_login', label: 'User Name', required: true },
    { key: 'user_email', label: 'Email', required: true },
    { key: 'user_pass', label: 'User Password', required: false },
    { key: 'first_name', label: 'First name', required: false },
    { key: 'last_name', label: 'Last name', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'address1', label: 'Address Line 1', required: false },
    { key: 'address2', label: 'Address Line 2', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'country', label: 'Country', required: false },
  ]

  const levelFields = [
    { key: 'name', label: 'Level Name', required: true },
  ]

  const actionLists = [
    { key: 'level-member', label: 'Add Member Under Level' },
    { key: 'member-level', label: 'Add Level Under Member' },
  ]

  const [wishlistConf, setWishlistConf] = useState({
    name: 'Wish List',
    type: 'WishList',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://bitpress.test' : '',
    apiKey: process.env.NODE_ENV === 'development' ? 'wcQDy3UJ2bvHCFg9K5uFCIEH4mSudEMf8etKIpyNgi41zIMURs' : '',
    field_map: [
      { formField: '', wishlistField: '' },
    ],
    memberFields,
    actionLists,
    levelFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveActionConf({ flow, setFlow, allIntegURL, conf: wishlistConf, navigate, setIsLoading, setSnackbar })
  }
  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(wishlistConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    wishlistConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <WishListAuthorization
        wishlistConf={wishlistConf}
        setWishlistConf={setWishlistConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <WishListIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, wishlistConf, setWishlistConf, setIsLoading, setSnackbar)}
          wishlistConf={wishlistConf}
          setWishlistConf={setWishlistConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!wishlistConf?.level_id && !wishlistConf?.member_id}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={wishlistConf}
        setDataConf={setWishlistConf}
        formFields={formFields}
      />
    </div>
  )
}

export default WishList
