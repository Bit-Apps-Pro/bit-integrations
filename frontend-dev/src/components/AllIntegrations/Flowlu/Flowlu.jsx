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
import FlowluAuthorization from './FlowluAuthorization'
import { checkMappedFields, handleInput } from './FlowluCommonFunc'
import FlowluIntegLayout from './FlowluIntegLayout'

function Flowlu({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [flowluConf, setFlowluConf] = useState({
    name: 'Flowlu',
    type: 'Flowlu',
    api_key: process.env.NODE_ENV === 'development' ? 'Z2pBZHR5ckZkSERQSU1sN295RU5VQ25IcXd3YzFRUTlfMTA1Mjc0' : '',
    company_name: process.env.NODE_ENV === 'development' ? 'bit-integration' : '',
    field_map: [
      { formField: '', flowluFormField: '' },
    ],
    actionName: '',
    actionId: '',
    flowluFields: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, flowluConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(flowluConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (flowluConf.actionName === 'account') {
      if (!flowluConf.selectedAccountType) {
        toast.error('Please select an Account Type')
        return
      }
    }
    if (flowluConf.actionName === 'opportunity') {
      if (!flowluConf.selectedPipeline) {
        toast.error('Please select a Opportunity Pipeline')
        return
      }
      if (!flowluConf.selectedOpportunityStage) {
        toast.error('Please select a Opportunity Stage')
        return
      }
    }

    flowluConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <FlowluAuthorization
        flowluConf={flowluConf}
        setFlowluConf={setFlowluConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <FlowluIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, flowluConf, setFlowluConf, setLoading, setSnackbar)}
          flowluConf={flowluConf}
          setFlowluConf={setFlowluConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {flowluConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(flowluConf))}
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
      {flowluConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={flowluConf}
          setDataConf={setFlowluConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Flowlu

