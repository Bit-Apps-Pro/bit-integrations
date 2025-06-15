/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import { checkMappedFields, handleInput } from './SalesforceCommonFunc'
import SelesforceIntegLayout from './SalesforceIntegLayout'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SalesforceAuthorization from './SalesforceAuthorization'

function Salesforce({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const contactFields = [
    { key: 'LastName', label: 'Last Name', required: true },
    { key: 'FirstName', label: 'First Name', required: false },
    { key: 'Email', label: 'Email', required: false },
    { key: 'Salutation', label: 'Salutation', required: false },
    { key: 'OtherStreet', label: 'Other Street', required: false },
    { key: 'OtherCity', label: 'Other City', required: false },
    { key: 'Title', label: 'Title', required: false },
    { key: 'Department', label: 'Department', required: false },
    { key: 'MailingStreet', label: 'Mailing Street', required: false },
    { key: 'MailingCity', label: 'Mailing City', required: false },
    { key: 'MailingCountry', label: 'Mailing Country', required: false },
  ]
  const leadFields = [
    { key: 'LastName', label: 'Last Name', required: true },
    { key: 'Email', label: 'Email', required: true },
    { key: 'Company', label: 'Company', required: true },
    { key: 'FirstName', label: 'First Name', required: false },
    { key: 'City', label: 'City', required: false },
    { key: 'State', label: 'State', required: false },
    { key: 'Salutation', label: 'Salutation', required: false },
    { key: 'Title', label: 'Title', required: false },
    { key: 'URL', label: 'URL', required: false },
    { key: 'Phone', label: 'Phone', required: false },
    { key: 'Mobile', label: 'Mobile', required: false },
    { key: 'Fax', label: 'Fax', required: false },
    { key: 'Street', label: 'Street', required: false },
    { key: 'Zip', label: 'Zip', required: false },
    { key: 'Country', label: 'Country', required: false },
    { key: 'Description', label: 'Description', required: false },
    { key: 'LeadSource', label: 'Lead source', required: false },
    { key: 'Industry', label: 'Industry', required: false },
    { key: 'Rating', label: 'Rating', required: false },
    { key: 'Revenue', label: 'Revenue', required: false },
    { key: 'Employees', label: 'Employees', required: false },
  ]

  const accountFields = [
    { key: 'Name', label: 'Account Name', required: true },
    { key: 'Phone', label: 'Phone', required: false },
    { key: 'BillingStreet', label: 'Billing Street', required: false },
    { key: 'BillingCity', label: 'Billing City', required: false },
    { key: 'BillingState', label: 'Billing State', required: false },
    { key: 'BillingPostalCode', label: 'Billing Postal Code', required: false },
    { key: 'BillingCountry', label: 'Billing Country', required: false },
    { key: 'ShippingStreet', label: 'Shipping Street', required: false },
    { key: 'ShippingCity', label: 'Shipping City', required: false },
    { key: 'ShippingState', label: 'Shipping State', required: false },
    { key: 'ShippingPostalCode', label: 'Shipping Postal Code', required: false },
    { key: 'ShippingCountry', label: 'Shipping Country', required: false },
    { key: 'Website', label: 'Website', required: false },
    { key: 'Industry', label: 'Industry', required: false },
    { key: 'NumberOfEmployees', label: 'Number Of Employees', required: false },
    { key: 'Description', label: 'Description', required: false },
    { key: 'Rating', label: 'Rating', required: false },
    { key: 'Site', label: 'Site', required: false },
    { key: 'CleanStatus', label: 'Clean Status', required: false },
    { key: 'NaicsDesc', label: 'Naics Desc', required: false },
    { key: 'SicDesc', label: 'Sic Desc', required: false },
    { key: 'Fax', label: 'Fax', required: false },
    { key: 'TickerSymbol', label: 'Ticker Symbol', required: false },
    { key: 'AnnualRevenue', label: 'Annual Revenue', required: false },
  ]

  const campaignFields = [
    { key: 'Name', label: 'Name', required: true },
    { key: 'Type', label: 'Type', required: false },
    { key: 'Description', label: 'Description', required: false },
    { key: 'Status', label: 'Status', required: false },
    { key: 'StartDate', label: 'StartDate', required: false },
    { key: 'EndDate', label: 'EndDate', required: false },
    { key: 'ExpectedRevenue', label: 'ExpectedRevenue', required: false },
    { key: 'BudgetedCost', label: 'BudgetedCost', required: false },
    { key: 'ActualCost', label: 'ActualCost', required: false },
  ]

  const campaignMemberStatus = [
    { label: 'Planned', value: 'Planned' },
    { label: 'Received', value: 'Received' },
    { label: 'Responded', value: 'Responded' },
    { label: 'Sent', value: 'Sent' },
  ]

  const opportunityFields = [
    { key: 'Name', label: 'Name', required: true },
    { key: 'CloseDate', label: 'Close Date', required: true },
    { key: 'Description', label: 'Description', required: false },
    { key: 'Amount', label: 'Amount', required: false },
  ]

  const eventFields = [
    { key: 'StartDateTime', label: 'Start Date', required: true },
    { key: 'EndDateTime', label: 'End Date', required: true },
    { key: 'Location', label: 'Location', required: false },
    { key: 'Description', label: 'Description', required: false },

  ]

  const caseFields = [
    { key: 'SuppliedName', label: 'Name', required: true },
    { key: 'SuppliedEmail', label: 'Email', required: false },
    { key: 'SuppliedPhone', label: 'Phone', required: false },
    { key: 'SuppliedCompany', label: 'Company', required: false },
    { key: 'Subject', label: 'Subject', required: false },
    { key: 'Description', label: 'Description', required: false },

  ]

  const [salesforceConf, setSalesforceConf] = useState({
    name: 'Salesforce',
    type: 'Salesforce',
    clientId: process.env.NODE_ENV === 'development' ? '3MVG9fe4g9fhX0E44ebIn.zn5KgPBKCuDGqLDPSpP5dIg8pf3XIPRMooVLLpLp5UvPMWegD00Vv_PE4_oQLGN' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '558BA6981F35209E3A89F617BD25C017E6354188F3C8C776E76EF116307AB522' : '',
    field_map: [
      { formField: '', selesforceField: '' },
    ],
    contactFields,
    leadFields,
    accountFields,
    campaignFields,
    campaignMemberStatus,
    opportunityFields,
    eventFields,
    caseFields,
    actions: {},
  })
  useEffect(() => {
    window.opener && setGrantTokenResponse('salesforce')
  }, [])

  const checkedActionFieldsMapType = ['contact-create', 'lead-create', 'account-create', 'campaign-create', 'opportunity-create', 'event-create', 'case-create'].includes(salesforceConf?.actionName)

  const nextPage = val => {
    if (checkedActionFieldsMapType && !checkMappedFields(salesforceConf)) {
      toast.error('Please map mandatory fields !')
      return
    }

    setStep(val)
  }
  const isDisabled = () => {
    if (salesforceConf?.actionName === 'opportunity-create') {
      return !salesforceConf.actions?.opportunityStageId
    }
    if (salesforceConf?.actionName === 'event-create') {
      return !salesforceConf.actions?.eventSubjectId
    }
    if (salesforceConf?.actionName === 'add-campaign-member') {
      return !salesforceConf.campaignId
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <SalesforceAuthorization
        formID={formID}
        salesforceConf={salesforceConf}
        setSalesforceConf={setSalesforceConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <SelesforceIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, salesforceConf, setSalesforceConf, formID, setIsLoading, setSnackbar)}
          salesforceConf={salesforceConf}
          setSalesforceConf={setSalesforceConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={isDisabled() || isLoading}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: salesforceConf, setIsLoading, setSnackbar })}
      />
    </div>
  )
}

export default Salesforce
