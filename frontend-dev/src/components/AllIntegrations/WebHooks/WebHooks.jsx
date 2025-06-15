// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function WebHooks({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { webHooksLinks } = tutorialLinks
  const [webHooks, setWebHooks] = useState({
    name: 'Web Hooks',
    type: 'Web Hooks',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://webhook.is/api/v1/46f7ffc3-4d0c-4d61-b8ee-4a7efa1ac29a' : '',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
        {webHooksLinks?.youTubeLink && (
          <TutorialLink
            title={webHooksLinks?.title}
            youTubeLink={webHooksLinks?.youTubeLink}
          />
        )}
        {webHooksLinks?.docLink && (
          <TutorialLink
            title={webHooksLinks?.title}
            docLink={webHooksLinks?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={webHooks}
          setWebHooks={setWebHooks}
          step={step}
          setStep={setStep}
          setSnackbar={setSnackbar}
          create
        />
      </div>

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && '100%', height: step === 2 && 'auto' }}>

        <WebHooksStepTwo
          step={step}
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, webHooks, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default WebHooks
