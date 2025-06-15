// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function FlowMattic({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { flowMatticLinks } = tutorialLinks
  const [flowMattic, setFlowMattic] = useState({
    name: 'FlowMattic Web Hooks',
    type: 'FlowMattic',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://connect.flowMattic.com/workflow/sendwebhookdata/IjIyMjIxNiI_3D' : '',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 1100 }, ...{ height: step === 1 && 'auto' } }}>
        {flowMatticLinks?.youTubeLink && (
          <TutorialLink
            title={flowMatticLinks?.title}
            youTubeLink={flowMatticLinks?.youTubeLink}
          />
        )}
        {flowMatticLinks?.docLink && (
          <TutorialLink
            title={flowMatticLinks?.title}
            docLink={flowMatticLinks?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={flowMattic}
          setWebHooks={setFlowMattic}
          step={step}
          setStep={setStep}
          setSnackbar={setSnackbar}
          create
        />
      </div>

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && `${100}%`, height: step === 2 && 'auto' }}>

        <WebHooksStepTwo
          step={step}
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, flowMattic, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default FlowMattic
