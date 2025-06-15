/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
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
import { checkMappedFields, handleInput } from './CapsuleCRMCommonFunc'
import CapsuleCRMIntegLayout from './CapsuleCRMIntegLayout'

function EditCapsuleCRM({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [capsulecrmConf, setCapsuleCRMConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(capsulecrmConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (capsulecrmConf.actionName === 'opportunity' || capsulecrmConf.actionName === 'project') {
      if (!capsulecrmConf.selectedCRMParty) {
        toast.error('Please select a party')
        return
      }
      if (!capsulecrmConf.selectedCRMMilestones && capsulecrmConf.actionName === 'opportunity') {
        toast.error('Please select a Milestone')
        return
      }
    }

    saveActionConf({ flow, allIntegURL, conf: capsulecrmConf, navigate, edit: 1, setLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, capsulecrmConf, setCapsuleCRMConf)} name="name" value={capsulecrmConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <CapsuleCRMIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, capsulecrmConf, setCapsuleCRMConf, setLoading, setSnackbar)}
        capsulecrmConf={capsulecrmConf}
        setCapsuleCRMConf={setCapsuleCRMConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(capsulecrmConf)}
        isLoading={isLoading}
        dataConf={capsulecrmConf}
        setDataConf={setCapsuleCRMConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditCapsuleCRM
