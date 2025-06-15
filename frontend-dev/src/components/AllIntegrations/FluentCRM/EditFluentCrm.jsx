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
import { handleInput, checkMappedFields } from './FluentCrmCommonFunc'
import FluentCrmIntegLayout from './FluentCrmIntegLayout'

function EditFluentCrm({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [fluentCrmConf, setFluentCrmConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const saveConfig = () => {
    if (!checkMappedFields(fluentCrmConf)) {
      setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
      return
    }
    saveActionConf({ flow, setFlow, allIntegURL, conf: fluentCrmConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, fluentCrmConf, setFluentCrmConf)} name="name" value={fluentCrmConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <FluentCrmIntegLayout
        formID={formID}
        formFields={formFields}
        fluentCrmConf={fluentCrmConf}
        setFluentCrmConf={setFluentCrmConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={fluentCrmConf.list_id === '' || fluentCrmConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={fluentCrmConf}
        setDataConf={setFluentCrmConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditFluentCrm
