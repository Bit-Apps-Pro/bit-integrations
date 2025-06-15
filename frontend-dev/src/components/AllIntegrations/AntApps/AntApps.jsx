// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import TutorialLink from '../../Utilities/TutorialLink'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'

function AntApps({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { antsAndApps } = tutorialLinks
  const [antapps, setAntapps] = useState({
    name: 'Ants & Apps',
    type: 'Ant Apps',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://antsandapps.com/....' : '',
    apiConsole: 'https://my.antsandapps.com/',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 1100 }, ...{ height: step === 1 && 'auto' } }}>
        {antsAndApps?.youTubeLink && (
          <TutorialLink
            title={antsAndApps?.title}
            youTubeLink={antsAndApps?.youTubeLink}
          />
        )}
        {antsAndApps?.docLink && (
          <TutorialLink
            title={antsAndApps?.title}
            docLink={antsAndApps?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={antapps}
          setWebHooks={setAntapps}
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
          saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: antapps, navigate, setIsLoading, setSnackbar })}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default AntApps
