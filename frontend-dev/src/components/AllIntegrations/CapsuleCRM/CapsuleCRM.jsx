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
import CapsuleCRMAuthorization from './CapsuleCRMAuthorization'
import { checkMappedFields, handleInput } from './CapsuleCRMCommonFunc'
import CapsuleCRMIntegLayout from './CapsuleCRMIntegLayout'

function CapsuleCRM({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const organisationFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'emailAddresses', label: 'Email', required: false },
    { key: 'about', label: 'About', required: false },
    { key: 'street', label: 'Street', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'phoneNumbers', label: 'Phone', required: false },
    { key: 'websites', label: 'Website', required: false },
  ]

  const personFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: false },
    { key: 'title', label: 'Title', required: false },
    { key: 'jobTitle', label: 'Job Title', required: false },
    { key: 'emailAddresses', label: 'Email', required: false },
    { key: 'about', label: 'About', required: false },
    { key: 'street', label: 'Street', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'Zip Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'phoneNumbers', label: 'Phone', required: false },
    { key: 'websites', label: 'Website', required: false },
  ]

  const opportunityFields = [
    { key: 'name', label: 'Opportunity Name', required: true },
    { key: 'description', label: 'Opportunity Details', required: false },
    { key: 'value', label: 'Bid Amount', required: false },
    { key: 'expectedCloseOn', label: 'Expected Close Date', required: false },
    { key: 'closedOn', label: 'Actual Close Date', required: false },
  ]

  const projectFields = [
    { key: 'name', label: 'Project Name', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'expectedCloseOn', label: 'Expected Close Date', required: false },
  ]

  const [capsulecrmConf, setCapsuleCRMConf] = useState({
    name: 'CapsuleCRM',
    type: 'CapsuleCRM',
    api_key: process.env.NODE_ENV === 'development' ? 'uf/pCrlRjbuDmB2JBxj/weun6p00r41zAtZUQ2GJbD+DnNYQ44A0U3POGB4hE/v1' : '',
    api_url: process.env.NODE_ENV === 'development' ? 'bitcode.capsulecrm.com' : '',
    field_map: [
      { formField: '', capsulecrmFormField: '' },
    ],
    actionName: '',
    organisationFields,
    personFields,
    opportunityFields,
    projectFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, capsulecrmConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(capsulecrmConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (capsulecrmConf.actionName === 'opportunity' || capsulecrmConf.actionName === 'project') {
      if (!capsulecrmConf.selectedCRMParty) {
        toast.error('Please select a party')
        return
      }
      if (!capsulecrmConf.selectedCRMMilestones && capsulecrmConf.actionName === 'opportunity') {
        toast.error('Please select a Milestone')
        return
      }
    }

    capsulecrmConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <CapsuleCRMAuthorization
        capsulecrmConf={capsulecrmConf}
        setCapsuleCRMConf={setCapsuleCRMConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <CapsuleCRMIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, capsulecrmConf, setCapsuleCRMConf, setLoading, setSnackbar)}
          capsulecrmConf={capsulecrmConf}
          setCapsuleCRMConf={setCapsuleCRMConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {capsulecrmConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(capsulecrmConf))}
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
      {capsulecrmConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={capsulecrmConf}
          setDataConf={setCapsuleCRMConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default CapsuleCRM
