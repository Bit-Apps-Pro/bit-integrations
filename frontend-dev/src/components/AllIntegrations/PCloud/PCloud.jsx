/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import PCloudAuthorization from './PCloudAuthorization'
import { checkMappedFields } from './PCloudCommonFunc'
import PCloudIntegLayout from './PCloudIntegLayout'

function PCloud({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [pCloudConf, setPCloudConf] = useState({
    name: 'PCloud',
    type: 'PCloud',
    clientId: process.env.NODE_ENV === 'development' ? 'AhqlFhr1Dnk' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'wsWwLNCI3nLiQlJVMYFry0V1rJg7' : '',
    field_map: [{ formField: '', pCloudFormField: '' }],
    foldersList: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('pCloud')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: pCloudConf, navigate, setIsLoading, setSnackbar })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <PCloudAuthorization
        flowID={flowID}
        pCloudConf={pCloudConf}
        setPCloudConf={setPCloudConf}
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
        <PCloudIntegLayout
          flowID={flowID}
          formFields={formFields}
          pCloudConf={pCloudConf}
          setPCloudConf={setPCloudConf}
        />

        <button
          onClick={() => setStep(3)}
          disabled={!checkMappedFields(pCloudConf)}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
      />
    </div>
  )
}

export default PCloud
