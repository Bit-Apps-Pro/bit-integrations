/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './SureCartCommonFunc'
import BackIcn from '../../../Icons/BackIcn'
import SureCartAuthorization from './SureCartAuthorization'
import SureCartIntegLayout from './SureCartIntegLayout'

function SureCart({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const customerFields = [
    { key: 'customer_first_name', label: 'Customer First Name ', required: true },
    { key: 'customer_email', label: 'Customer Email ', required: true },
    { key: 'customer_last_name', label: 'Customer Last Name ', required: false },
    { key: 'customer_phone', label: 'Customer Phone ', required: false },
  ]

  const allActions = [
    { key: '1', label: 'Create Customer' },
  ]

  const [sureCartConf, setSureCartConf] = useState({
    name: 'SureCart',
    type: 'SureCart',
    mainAction: '',
    api_key: process.env.NODE_ENV === 'development' ? '5qA9v2NhCzjJqGhSa2bnnwuw' : '',
    field_map: [{ formField: '', SureCartFormField: '' }],
    customerFields,
    allActions,
    actions: {},
  })
  const nextPage = (val) => {
    if (!checkMappedFields(sureCartConf.field_map)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }

    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setStep(3)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <SureCartAuthorization
        formID={formID}
        sureCartConf={sureCartConf}
        setSureCartConf={setSureCartConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: 'auto',
            overflow: 'visible',
          }),
        }}
      >
        <SureCartIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, sureCartConf, setSureCartConf, setIsLoading, setSnackbar)}
          sureCartConf={sureCartConf}
          setSureCartConf={setSureCartConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!sureCartConf.mainAction || isLoading}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: sureCartConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={sureCartConf}
        setDataConf={setSureCartConf}
        formFields={formFields}
      />
    </div>
  )
}

export default SureCart
