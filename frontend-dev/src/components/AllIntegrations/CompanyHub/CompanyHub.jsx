/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import CompanyHubAuthorization from './CompanyHubAuthorization'
import { checkMappedFields } from './CompanyHubCommonFunc'
import CompanyHubIntegLayout from './CompanyHubIntegLayout'

function CompanyHub({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const contactFields = [
    { label: "First Name", key: "FirstName", required: false },
    { label: "Last Name", key: "LastName", required: true },
    { label: "Email Address", key: "Email", required: false },
    { label: "Company", key: "Company", required: false },
    { label: "Phone Number", key: "Phone", required: false },
    { label: "Job Title", key: "Designation", required: false },
    { label: "Description", key: "Description", required: false },
    { label: "Source", key: "Source", required: false },
    { label: "Next Follow Up Date", key: "NextFollowUpDate", required: false },
    { label: "Twitter", key: "Twitter", required: false },
    { label: "LinkedIn", key: "LinkedIn", required: false },
    { label: "GooglePlus", key: "GooglePlus", required: false },
    { label: "Facebook", key: "Facebook", required: false },
    { label: "Skype", key: "Skype", required: false },
    { label: "Street", key: "Street", required: false },
    { label: "City", key: "City", required: false },
    { label: "State", key: "State", required: false },
    { label: "Country", key: "Country", required: false },
    { label: "Postal Code", key: "PostalCode", required: false },
    { label: "Postal Code", key: "PostalCode", required: false }
  ]
  const companyFields = [
    { label: "Company Name", key: "Name", required: true },
    { label: "Website", key: "Website", required: false },
    { label: "Phone Number", key: "Phone", required: false },
    { label: "Description", key: "Description", required: false },
    { label: "Billing Street", key: "BillingStreet", required: false },
    { label: "Billing City", key: "BillingCity", required: false },
    { label: "Billing State", key: "BillingState", required: false },
    { label: "Billing Country", key: "BillingCountry", required: false },
    { label: "Billing Postal Code", key: "BillingPostalCode", required: false },
    { label: "Shipping Street", key: "ShippingStreet", required: false },
    { label: "Shipping City", key: "ShippingCity", required: false },
    { label: "Shipping State", key: "ShippingState", required: false },
    { label: "Shipping Country", key: "ShippingCountry", required: false },
    { label: "Shipping Postal Code", key: "ShippingPostalCode", required: false }
  ]
  const dealFields = [
    { label: "Deal Name", key: "Name", required: true },
    { label: "Amount", key: "Amount", required: false },
    { label: "Close Date", key: "CloseDate", required: false }
  ]

  const [companyHubConf, setCompanyHubConf] = useState({
    name: 'CompanyHub',
    type: 'CompanyHub',
    sub_domain: process.env.NODE_ENV === 'development' ? 'bitcode' : '',
    api_key: process.env.NODE_ENV === 'development' ? 'Q0t71Oef8Y9yHj2JLayU' : '',
    field_map: [
      { formField: '', companyHubFormField: '' },
    ],
    actionName: '',
    contactFields,
    companyFields,
    dealFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, companyHubConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(companyHubConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (companyHubConf.actionName === 'deal') {
      if (!companyHubConf.selectedStage) {
        toast.error('Please select a Deal Stage')
        return
      }
    }

    companyHubConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <CompanyHubAuthorization
        companyHubConf={companyHubConf}
        setCompanyHubConf={setCompanyHubConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <CompanyHubIntegLayout
          formFields={formFields}
          companyHubConf={companyHubConf}
          setCompanyHubConf={setCompanyHubConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {companyHubConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(companyHubConf))}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next', 'bit-integrations')}
            {' '}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {companyHubConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={companyHubConf}
          setDataConf={setCompanyHubConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default CompanyHub
