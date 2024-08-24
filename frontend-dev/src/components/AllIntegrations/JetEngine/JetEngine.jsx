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
import { checkMappedFields } from './jetEngineCommonFunctions'
import JetEngineIntegLayout from './JetEngineIntegLayout'
import JetEngineAuthorization from './JetEngineAuthorization'
import { TASK_LIST_VALUES } from './jetEngineConstants'

function JetEngine({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    cptOptions: false,
    vendors: false
  })

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [jetEngineConf, setJetEngineConf] = useState({
    name: 'JetEngine',
    type: 'JetEngine',
    field_map: [],
    staticFields: [],
    selectedTask: '',
    actions: {},
    deleteVendorFieldMap: false,
    selectedMenuPosition: '',
    selectedMenuIcon: '',
    selectedSupports: '',
    selectedTaxPostTypes: ''
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(
      flow,
      setFlow,
      allIntegURL,
      jetEngineConf,
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

    if (!jetEngineConf.selectedTask) {
      toast.error('Please select a task!')
      return
    }

    if (!checkMappedFields(jetEngineConf)) {
      toast.error('Please map mandatory fields!')
      return
    }

    if (
      jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_TAXONOMY &&
      !jetEngineConf.selectedTaxPostTypes
    ) {
      toast.error('Please select post type(s)!')
      return
    }

    jetEngineConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <JetEngineAuthorization
        jetEngineConf={jetEngineConf}
        setJetEngineConf={setJetEngineConf}
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
        <JetEngineIntegLayout
          formFields={formFields}
          jetEngineConf={jetEngineConf}
          setJetEngineConf={setJetEngineConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!checkMappedFields(jetEngineConf)}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')} &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={jetEngineConf}
        setDataConf={setJetEngineConf}
        formFields={formFields}
      />
    </div>
  )
}

export default JetEngine