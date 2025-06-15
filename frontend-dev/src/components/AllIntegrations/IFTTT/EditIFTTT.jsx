/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksLayouts from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'

function EditIFTTT({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)

  const [ifttt, setIfttt] = useRecoilState($actionConf)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <div className="mt-3">
        <WebHooksLayouts
          formID={formID}
          formFields={formFields}
          webHooks={ifttt}
          setWebHooks={setIfttt}
          setSnackbar={setSnackbar}
        />
      </div>

      <WebHooksStepTwo
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: ifttt, navigate, edit: 1, setIsLoading, setSnackbar })}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditIFTTT
