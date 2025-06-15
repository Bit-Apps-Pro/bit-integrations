import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { editHandleInput, saveUpdateConfig } from './KlaviyoCommonFunc'
import KlaviyoIntegLayout from './KlaviyoIntegLayout'

function EditKlaviyo({ allIntegURL }) {
  const navigate = useNavigate()
  const [snack, setSnackbar] = useState({ show: false })
  const [flow, setFlow] = useRecoilState($newFlow)
  const [klaviyoConf, setKlaviyoConf] = useRecoilState($actionConf)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false,
  })
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" name="name" onChange={(e) => editHandleInput(e, klaviyoConf, setKlaviyoConf)} value={klaviyoConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <div className="my-3">
        <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      </div>

      <KlaviyoIntegLayout
        formFields={formFields}
        klaviyoConf={klaviyoConf}
        setKlaviyoConf={setKlaviyoConf}
        loading={loading}
        setLoading={setLoading}
      />
      <IntegrationStepThree
        edit
        saveConfig={() => { saveUpdateConfig(flow, allIntegURL, klaviyoConf, navigate, { edit: 1 }, setIsLoading) }}
        disabled={klaviyoConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={klaviyoConf}
        setDataConf={setKlaviyoConf}
        formFields={formFields}
      />

    </div>
  )
}

export default EditKlaviyo
