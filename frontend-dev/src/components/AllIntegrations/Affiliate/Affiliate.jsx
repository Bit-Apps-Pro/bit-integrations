import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './AffiliateCommonFunc'
import { $btcbi } from '../../../GlobalStates'
import AffiliateAuthorization from './AffiliateAuthorization'
import AffiliateIntegLayout from './AffiliateIntegLayout'

function Affiliate({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const btcbi = useRecoilValue($btcbi)
  const { siteURL } = btcbi

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Create a referral for specific affiliate Id' },
    { key: '2', label: 'Create a referral for the user' },
  ]

  const allStatus = [
    { key: '1', label: 'Paid' },
    { key: '2', label: 'Unpaid' },
    { key: '3', label: 'Pending' },
    { key: '4', label: 'Reject' },
  ]

  const allReferralType = [
    { key: '1', label: 'Sale' },
    { key: '2', label: 'Opt-in' },
    { key: '3', label: 'Lead' },
  ]

  const createAffiliateFields = [
    { key: 'amount', label: 'Amount', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'reference', label: 'Reference', required: false },
    { key: 'context', label: 'Context', required: false },
  ]
  const [affiliateConf, setAffiliateConf] = useState({
    name: 'Affiliate',
    type: 'Affiliate',
    mainAction: '',
    affiliate_id: '',
    referralId: '',
    statusId: '',
    field_map: [
      { formField: '', affiliateFormField: '' },
    ],
    allReferralType,
    allStatus,
    allActions,
    createAffiliateFields,
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(affiliateConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (affiliateConf.mainAction !== '') {
      setStep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <AffiliateAuthorization
        formID={formID}
        affiliateConf={affiliateConf}
        setAffiliateConf={setAffiliateConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}

      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <AffiliateIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, affiliateConf, setAffiliateConf, setIsLoading, setSnackbar, formID)}
          affiliateConf={affiliateConf}
          setAffiliateConf={setAffiliateConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!affiliateConf.statusId || !affiliateConf.referralId || isLoading}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}

      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: affiliateConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={affiliateConf}
        setDataConf={setAffiliateConf}
        formFields={formFields}
      />

    </div>
  )
}

export default Affiliate
