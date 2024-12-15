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
import SmartSuiteAuthorization from './SmartSuiteAuthorization'
import { checkMappedFields, generateMappedField } from './SmartSuiteCommonFunc'
import SmartSuiteIntegLayout from './SmartSuiteIntegLayout'

function SmartSuite({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const smartSuiteFields = [
    { label: __('Name', 'bit-integrations'), key: 'name', required: true },
    { label: __('Logo Icon', 'bit-integrations'), key: 'logo_icon', required: false }
    // { label: __('Last Name', 'bit-integrations'), key: 'last_name', required: false },
    // { label: __('Phone Number', 'bit-integrations'), key: 'phone_number', required: false },
    // { label: __('Company', 'bit-integrations'), key: 'company', required: false },
    // { label: __('Website', 'bit-integrations'), key: 'website', required: false },
    // { label: __('GDPR', 'bit-integrations'), key: 'gdpr', required: false },
    // {
    //   label: __('Event Registration page URL', 'bit-integrations'),
    //   key: 'ref_url',
    //   required: false
    // }
  ]
  const smartSuiteFieldsForSolution = [
    { label: __('Name', 'bit-integrations'), key: 'name', required: true },
    { label: __('Logo Icon', 'bit-integrations'), key: 'logo_icon', required: false }
  ]
  const smartSuiteFieldsForRecord = [
    { label: __('Title', 'bit-integrations'), key: 'title', required: true },
    { label: __('Description', 'bit-integrations'), key: 'description', required: false },
    { label: __('From date', 'bit-integrations'), key: 'due_date', required: false },
    { label: __('To date', 'bit-integrations'), key: 'to_date', required: false }
  ]
  const [smartSuiteConf, setSmartSuiteConf] = useState({
    name: 'SmartSuite',
    type: 'SmartSuite',
    api_key: process.env.NODE_ENV === 'development' ? 'sn5usd27' : '',
    api_secret: process.env.NODE_ENV === 'development' ? '78c6dfdf3ea3d0d28bd1a23144ef16f1ac303237' : '',
    field_map: generateMappedField(smartSuiteFields),
    actionName: '',
    isActionTable: 'no action',
    smartSuiteFields,
    smartSuiteFieldsForRecord,
    actions: {}
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(
      flow,
      setFlow,
      allIntegURL,
      smartSuiteConf,
      navigate,
      '',
      '',
      setIsLoading
    )
    resp.then((res) => {
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

    if (!checkMappedFields(smartSuiteConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (smartSuiteConf.actionName != 'solution' && !smartSuiteConf.selectedEvent) {
      toast.error(__('Please select a solution', 'bit-integrations'))
      return
    }
    if (smartSuiteConf.actionName === 'record' && !smartSuiteConf.selectedSession) {
      toast.error(__('Please select a table', 'bit-integrations'))
      return
    }
    smartSuiteConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <SmartSuiteAuthorization
        smartSuiteConf={smartSuiteConf}
        setSmartSuiteConf={setSmartSuiteConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <SmartSuiteIntegLayout
          formFields={formFields}
          smartSuiteConf={smartSuiteConf}
          setSmartSuiteConf={setSmartSuiteConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {smartSuiteConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(smartSuiteConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {smartSuiteConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={smartSuiteConf}
          setDataConf={setSmartSuiteConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default SmartSuite
