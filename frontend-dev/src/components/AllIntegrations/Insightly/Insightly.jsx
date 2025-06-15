/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import InsightlyAuthorization from './InsightlyAuthorization'
import { checkMappedFields, checkRequiredFields, handleInput } from './InsightlyCommonFunc'
import InsightlyIntegLayout from './InsightlyIntegLayout'

function Insightly({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const organisationFields = [
    { key: 'ORGANISATION_NAME', label: 'Name', required: true },
    { key: 'PHONE', label: 'Phone', required: false },
    { key: 'PHONE_FAX', label: 'Fax', required: false },
    { key: 'WEBSITE', label: 'Website', required: false },
    { key: 'SOCIAL_FACEBOOK', label: 'Facebook', required: false },
    { key: 'SOCIAL_LINKEDIN', label: 'Linkedin', required: false },
    { key: 'SOCIAL_TWITTER', label: 'Twitter', required: false },
    { key: 'ADDRESS_BILLING_STREET', label: 'Address Billing Street', required: false },
    { key: 'ADDRESS_BILLING_CITY', label: 'Address Billing City', required: false },
    { key: 'ADDRESS_BILLING_STATE', label: 'Address Billing State', required: false },
    { key: 'ADDRESS_BILLING_COUNTRY', label: 'Address Billing Country', required: false },
    { key: 'ADDRESS_BILLING_POSTCODE', label: 'Address Billing Postcode', required: false },
    { key: 'ADDRESS_SHIP_STREET', label: 'Address Shipping Street', required: false },
    { key: 'ADDRESS_SHIP_STATE', label: 'Address Shipping State', required: false },
    { key: 'ADDRESS_SHIP_POSTCODE', label: 'Address Shipping Postcode', required: false },
    { key: 'ADDRESS_SHIP_COUNTRY', label: 'Address Shipping Country', required: false },
  ]

  const taskFields = [
    { key: 'TITLE', label: 'Task Name', required: true },
    { key: 'DUE_DATE', label: 'Due Date', required: false },
    { key: 'COMPLETED_DATE_UTC', label: 'Completed Date', required: false },
    { key: 'DETAILS', label: 'Description', required: false },
    { key: 'PERCENT_COMPLETE', label: 'Progress ( % )', required: false },
    { key: 'START_DATE', label: 'Start Date', required: false },
  ]

  const leadFields = [
    { key: 'FIRST_NAME', label: 'First Name', required: false },
    { key: 'LAST_NAME', label: 'Last Name', required: true },
    { key: 'TITLE', label: 'Title', required: false },
    { key: 'ORGANISATION_NAME', label: 'Organization', required: false },
    { key: 'LEAD_RATING', label: 'Lead Rating', required: false },
    { key: 'EMAIL', label: 'Email Address', required: false },
    { key: 'PHONE', label: 'Phone', required: false },
    { key: 'MOBILE', label: 'Mobile Phone', required: false },
    { key: 'FAX', label: 'Fax', required: false },
    { key: 'WEBSITE', label: 'Website', required: false },
    { key: 'INDUSTRY', label: 'Industry', required: false },
    { key: 'EMPLOYEE_COUNT', label: 'Number of Employees', required: false },
    { key: 'ADDRESS_STREET', label: 'Address Street', required: false },
    { key: 'ADDRESS_CITY', label: 'Address City', required: false },
    { key: 'ADDRESS_STATE', label: 'Address State', required: false },
    { key: 'ADDRESS_POSTCODE', label: 'Address Postcode', required: false },
    { key: 'ADDRESS_COUNTRY', label: 'Address Country', required: false },
    { key: 'LEAD_DESCRIPTION', label: 'Description', required: false },
  ]

  const contactFields = [
    { key: 'FIRST_NAME', label: 'First Name', required: true },
    { key: 'EMAIL_ADDRESS', label: 'Email', required: true },
    { key: 'LAST_NAME', label: 'Last Name', required: false },
    { key: 'TITLE', label: 'Title', required: false },
    { key: 'PHONE', label: 'Phone', required: false },
    { key: 'PHONE_FAX', label: 'Fax', required: false },
    { key: 'DATE_OF_BIRTH', label: 'Date of Birth', required: false },
    { key: 'SOCIAL_FACEBOOK', label: 'Facebook', required: false },
    { key: 'SOCIAL_LINKEDIN', label: 'Linkedin', required: false },
    { key: 'SOCIAL_TWITTER', label: 'Twitter', required: false },
    { key: 'ADDRESS_MAIL_STREET', label: 'Address Mail Street', required: false },
    { key: 'ADDRESS_MAIL_CITY', label: 'Address Mail City', required: false },
    { key: 'ADDRESS_MAIL_STATE', label: 'Address Mail State', required: false },
    { key: 'ADDRESS_MAIL_COUNTRY', label: 'Address Mail Country', required: false },
    { key: 'ADDRESS_MAIL_POSTCODE', label: 'Address Mail Postcode', required: false },
    { key: 'ADDRESS_OTHER_STREET', label: 'Address Other Street', required: false },
    { key: 'ADDRESS_OTHER_STATE', label: 'Address Other State', required: false },
    { key: 'ADDRESS_OTHER_POSTCODE', label: 'Address Other Postcode', required: false },
    { key: 'ADDRESS_OTHER_COUNTRY', label: 'Address Other Country', required: false },
  ]

  const opportunityFields = [
    { key: 'OPPORTUNITY_NAME', label: 'Opportunity Name', required: true },
    { key: 'OPPORTUNITY_DETAILS', label: 'Opportunity Details', required: false },
    { key: 'BID_AMOUNT', label: 'Bid Amount', required: false },
    { key: 'ACTUAL_CLOSE_DATE', label: 'Actual Close Date', required: false },
    { key: 'PROBABILITY', label: 'Probability Of Winning', required: false },
    { key: 'FORECAST_CLOSE_DATE', label: 'Forecast Close Date', required: false },
  ]

  const projectFields = [
    { key: 'PROJECT_NAME', label: 'Project Name', required: true },
    { key: 'PROJECT_DETAILS', label: 'Description', required: false },
  ]

  const [insightlyConf, setInsightlyConf] = useState({
    name: 'Insightly',
    type: 'Insightly',
    api_key: process.env.NODE_ENV === 'development' ? 'ce8c4bf8-df7a-428a-8080-cfd701592114' : '',
    api_url: process.env.NODE_ENV === 'development' ? 'na1.insightly.com' : '',
    field_map: [
      { formField: '', insightlyFormField: '' },
    ],
    actionName: '',
    organisationFields,
    contactFields,
    taskFields,
    leadFields,
    opportunityFields,
    projectFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, insightlyConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(insightlyConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (insightlyConf.actionName === 'opportunity' || insightlyConf.actionName === 'project') {
      if (!insightlyConf.selectedCRMPipeline) {
        toast.error('Please select a pipeline')
        return
      }
      if (!insightlyConf.selectedCRMPipelineStages) {
        toast.error('Please select a pipeline stage')
        return
      }
    }

    if (insightlyConf.actionName === 'lead' && !checkRequiredFields(insightlyConf)) {
      toast.error('Please select Lead Status or Lead Source')
      return
    }

    insightlyConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <InsightlyAuthorization
        insightlyConf={insightlyConf}
        setInsightlyConf={setInsightlyConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <InsightlyIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, insightlyConf, setInsightlyConf, setLoading, setSnackbar)}
          insightlyConf={insightlyConf}
          setInsightlyConf={setInsightlyConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {insightlyConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(insightlyConf))}
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
      {insightlyConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={insightlyConf}
          setDataConf={setInsightlyConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Insightly
