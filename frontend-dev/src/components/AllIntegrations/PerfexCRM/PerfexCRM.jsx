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
import PerfexCRMAuthorization from './PerfexCRMAuthorization'
import { checkMappedFields, handleInput } from './PerfexCRMCommonFunc'
import PerfexCRMIntegLayout from './PerfexCRMIntegLayout'

function PerfexCRM({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const customerFields = [
    { key: 'company', label: 'Company', required: true },
    { key: 'vat', label: 'VAT Number', required: false },
    { key: 'phonenumber', label: 'Phone Number', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'billing_street', label: 'Billing Street', required: false },
    { key: 'billing_city', label: 'Billing City', required: false },
    { key: 'billing_state', label: 'Billing State', required: false },
    { key: 'billing_zip', label: 'Billing Zip', required: false },
    { key: 'billing_country', label: 'Billing Country', required: false },
    { key: 'shipping_street', label: 'Shipping Street', required: false },
    { key: 'shipping_city', label: 'Shipping City', required: false },
    { key: 'shipping_state', label: 'Shipping State', required: false },
    { key: 'shipping_zip', label: 'Shipping Zip', required: false },
    { key: 'shipping_country', label: 'Shipping Country', required: false },
  ]

  const contactFields = [
    { key: 'firstname', label: 'First Name', required: true },
    { key: 'lastname', label: 'Last Name', required: true },
    { key: 'email', label: 'Email Address', required: true },
    { key: 'title', label: 'Position', required: false },
    { key: 'phonenumber', label: 'Phone Number', required: false },
    { key: 'password', label: 'Password', required: false }
  ]

  const leadFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'title', label: 'Position', required: false },
    { key: 'email', label: 'Email Address', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'phonenumber', label: 'Phone Number', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'custom_contact_date', label: 'Date Contacted', required: false },
  ]

  const projectFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'start_date', label: 'Start Date', required: true },
    { key: 'deadline', label: 'Dead Line', required: false },
    { key: 'project_cost ', label: 'project Cost', required: false },
    { key: 'estimated_hours', label: 'Estimated Hours', required: false },
    { key: 'description', label: 'Project Description', required: false }
  ]

  const [perfexCRMConf, setPerfexCRMConf] = useState({
    name: 'PerfexCRM',
    type: 'PerfexCRM',
    api_token: process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiIiwibmFtZSI6IlRlc3QiLCJBUElfVElNRSI6MTY4OTQ4NzExOH0.sdDrgh19H08sLvpL8ArvT-rZvv_QP9KtoSLCAtOEyXM' : '',
    domain: process.env.NODE_ENV === 'development' ? 'https://bit.nandocardoso.com.br' : '',
    field_map: [
      { formField: '', perfexCRMFormField: '' },
    ],
    actionName: '',
    selectedLeadSourceId: 1,
    selectedLeadStatusId: 1,
    actionId: '',
    customerFields,
    contactFields,
    leadFields,
    projectFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, perfexCRMConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(perfexCRMConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (perfexCRMConf.actionName === 'contact' && !perfexCRMConf.selectedCustomer) {
      toast.error('Please select a Customer')
      return
    }
    if (perfexCRMConf.actionName === 'lead' && (!perfexCRMConf.selectedLeadStatusId || !perfexCRMConf.selectedLeadSourceId)) {
      toast.error('Lead Status Id and Lead Source Id are required!')
      return
    }
    if (perfexCRMConf.actionName === 'project') {
      if (!perfexCRMConf.selectedProjectStatus) {
        toast.error('Please select Project status')
        return
      }
      if (!perfexCRMConf.selectedProjectType) {
        toast.error('Please select Project Related With...')
        return
      }
      if (!perfexCRMConf.selectedbillingType) {
        toast.error('Please select a Billing type')
        return
      }
      if (!perfexCRMConf.selectedCustomer) {
        toast.error('Please select a Customer')
        return
      }
      if (Number(perfexCRMConf.selectedbillingType) === 1 && !perfexCRMConf.totalRate) {
        toast.error('Please select a Total Rate')
        return
      }
      if (Number(perfexCRMConf.selectedbillingType) === 2 && !perfexCRMConf.ratePerHour) {
        toast.error('Please select a Rate Per Hour')
        return
      }
    }

    perfexCRMConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <PerfexCRMAuthorization
        perfexCRMConf={perfexCRMConf}
        setPerfexCRMConf={setPerfexCRMConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <PerfexCRMIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, perfexCRMConf, setPerfexCRMConf, setLoading, setSnackbar)}
          perfexCRMConf={perfexCRMConf}
          setPerfexCRMConf={setPerfexCRMConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {perfexCRMConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(perfexCRMConf))}
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
      {perfexCRMConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={perfexCRMConf}
          setDataConf={setPerfexCRMConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default PerfexCRM
