// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksLayouts from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function ZohoFlow({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { zohoFlowLinks } = tutorialLinks
  const [zohoFlow, setZohoFlow] = useState({
    name: 'Zoho Flow Web Hooks',
    type: 'Zoho Flow',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://hooks..com/hooks/catch/8430229/o7gwcin/' : '',
    apiConsole: 'https://flow.zoho.com/#/workspace/default/flows/create',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
        {zohoFlowLinks?.youTubeLink && (
          <TutorialLink
            title={zohoFlowLinks?.title}
            youTubeLink={zohoFlowLinks?.youTubeLink}
          />
        )}
        {zohoFlowLinks?.docLink && (
          <TutorialLink
            title={zohoFlowLinks?.title}
            docLink={zohoFlowLinks?.docLink}
          />
        )}

        <WebHooksLayouts
          formID={formID}
          formFields={formFields}
          webHooks={zohoFlow}
          setWebHooks={setZohoFlow}
          step={step}
          setStep={setStep}
          setSnackbar={setSnackbar}
          create
        />
      </div>

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <WebHooksStepTwo
          step={step}
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, zohoFlow, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default ZohoFlow
