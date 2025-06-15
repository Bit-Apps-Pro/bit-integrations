/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './SendinBlueCommonFunc'
import SendinBlueIntegLayout from './SendinBlueIntegLayout'

function EditSendinBlue({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [sendinBlueConf, setSendinBlueConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [error, setError] = useState({ templateId: '', RedirectionUrl: '' })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, sendinBlueConf, setSendinBlueConf)}
          name="name"
          value={sendinBlueConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <SendinBlueIntegLayout
        formID={formID}
        formFields={formFields}
        sendinBlueConf={sendinBlueConf}
        setSendinBlueConf={setSendinBlueConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        error={error}
        setError={setError}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: sendinBlueConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={sendinBlueConf.listId === '' || sendinBlueConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={sendinBlueConf}
        setDataConf={setSendinBlueConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditSendinBlue
