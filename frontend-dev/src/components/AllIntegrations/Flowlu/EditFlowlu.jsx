/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './FlowluCommonFunc'
import FlowluIntegLayout from './FlowluIntegLayout'

function EditFlowlu({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [flowluConf, setFlowluConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(flowluConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (flowluConf.actionName === 'account') {
      if (!flowluConf.selectedAccountType) {
        toast.error('Please select an Account Type')
        return
      }
    }
    if (flowluConf.actionName === 'opportunity') {
      if (!flowluConf.selectedPipeline) {
        toast.error('Please select a Opportunity Pipeline')
        return
      }
      if (!flowluConf.selectedOpportunityStage) {
        toast.error('Please select a Opportunity Stage')
        return
      }
    }

    saveActionConf({ flow, allIntegURL, conf: flowluConf, history, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, flowluConf, setFlowluConf)} name="name" value={flowluConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <FlowluIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, flowluConf, setFlowluConf, setLoading, setSnackbar)}
        flowluConf={flowluConf}
        setFlowluConf={setFlowluConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(flowluConf)}
        isLoading={isLoading}
        dataConf={flowluConf}
        setDataConf={setFlowluConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditFlowlu

