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

function UncannyAutomator({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { uncannyAutomatorLinks } = tutorialLinks
  const [uncannyAutomator, setUncannyAutomator] = useState({
    name: 'UncannyAutomator Web Hooks',
    type: 'UncannyAutomator',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://connect.uncannyAutomator.com/workflow/sendwebhookdata/IjIyMjIxNiI_3D' : '',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 1100 }, ...{ height: step === 1 && 'auto' } }}>
        {uncannyAutomatorLinks?.youTubeLink && (
          <TutorialLink
            title={uncannyAutomatorLinks?.title}
            youTubeLink={uncannyAutomatorLinks?.youTubeLink}
          />
        )}
        {uncannyAutomatorLinks?.docLink && (
          <TutorialLink
            title={uncannyAutomatorLinks?.title}
            docLink={uncannyAutomatorLinks?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={uncannyAutomator}
          setWebHooks={setUncannyAutomator}
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
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, uncannyAutomator, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default UncannyAutomator
