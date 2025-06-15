// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import TutorialLink from '../../Utilities/TutorialLink'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'

function AutomatorWP({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { automatorWP: automator } = tutorialLinks
  const [automatorWP, setAutomatorWP] = useState({
    name: 'AutomatorWP Web Hooks',
    type: 'AutomatorWP',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://connect.automatorWP.com/workflow/sendwebhookdata/IjIyMjIxNiI_3D' : '',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 1100 }, ...{ height: step === 1 && 'auto' } }}>
        {automator?.youTubeLink && (
          <TutorialLink
            title={automator?.title}
            youTubeLink={automator?.youTubeLink}
          />
        )}
        {automator?.docLink && (
          <TutorialLink
            title={automator?.title}
            docLink={automator?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={automatorWP}
          setWebHooks={setAutomatorWP}
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
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, automatorWP, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default AutomatorWP
