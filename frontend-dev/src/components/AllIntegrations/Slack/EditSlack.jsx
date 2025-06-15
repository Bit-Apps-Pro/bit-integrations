/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SlackIntegLayout from './SlackIntegLayout'
import { handleInput } from './SlackCommonFunc'

function EditSlack({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [slackConf, setSlackConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, slackConf, setSlackConf)} name="name" value={slackConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <SlackIntegLayout
        formID={formID}
        formFields={formFields}
        slackConf={slackConf}
        setSlackConf={setSlackConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, allIntegURL, conf: slackConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={slackConf.channel_id === '' || isLoading}
        isLoading={isLoading}
        dataConf={slackConf}
        setDataConf={setSlackConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditSlack
