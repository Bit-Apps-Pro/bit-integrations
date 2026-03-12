/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'

function EditAntApps({ allIntegURL }) {
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })

  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)

  const [antapps, setAntapps] = useRecoilState($actionConf)

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <div className="mt-3">
        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={antapps}
          setWebHooks={setAntapps}
          setSnackbar={setSnackbar}
        />
      </div>

      <WebHooksStepTwo
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: antapps,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditAntApps
