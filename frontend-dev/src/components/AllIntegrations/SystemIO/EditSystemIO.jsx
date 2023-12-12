/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import { handleInput } from './SystemIOCommonFunc'
import SystemIOIntegLayout from './SystemIOIntegLayout'
import EditFormInteg from '../EditFormInteg'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'

function EditSystemIO({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [systemIOConf, setSystemIOConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, systemIOConf, setSystemIOConf)} name="name" value={systemIOConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <SystemIOIntegLayout
        formID={formID}
        formFields={formFields}
        systemIOConf={systemIOConf}
        setSystemIOConf={setSystemIOConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: systemIOConf, edit: 1, setIsLoading, setSnackbar })}
        disabled={systemIOConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={systemIOConf}
        setDataConf={setSystemIOConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditSystemIO
