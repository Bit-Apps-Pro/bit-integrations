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
import { checkMappedFields, handleInput } from './DemioCommonFunc'
import DemioIntegLayout from './DemioIntegLayout'

function EditDemio({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [demioConf, setDemioConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(demioConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!demioConf.selectedEvent) {
      toast.error(__('Please select a Event', 'bit-integrations'))
      return
    }
    saveActionConf({
      flow,
      allIntegURL,
      conf: demioConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, demioConf, setDemioConf)}
          name="name"
          value={demioConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <DemioIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        demioConf={demioConf}
        setDemioConf={setDemioConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(demioConf)}
        isLoading={isLoading}
        dataConf={demioConf}
        setDataConf={setDemioConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditDemio
