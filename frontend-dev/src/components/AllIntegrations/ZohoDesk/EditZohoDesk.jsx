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
import { saveActionConf, saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoDeskCommonFunc'
import ZohoDeskIntegLayout from './ZohoDeskIntegLayout'

function EditZohoDesk({ allIntegURL }) {
  const { id, formID } = useParams()
  const navigate = useNavigate()
  const [deskConf, setDeskConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(deskConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (!deskConf.actions?.ticket_owner) {
      setSnackbar({ show: true, msg: __('Please select a ticket owner', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: deskConf,
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
          className="btcd-paper-inp w-7"
          onChange={(e) => handleInput(e, deskConf, setDeskConf)}
          name="name"
          value={deskConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ZohoDeskIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, deskConf, setDeskConf, formID, setIsLoading, setSnackbar)
        }
        deskConf={deskConf}
        setDeskConf={setDeskConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={
          deskConf.department === '' || deskConf.table === '' || deskConf.field_map.length < 1
        }
        dataConf={deskConf}
        setDataConf={setDeskConf}
        formFields={formFields}
      />
    </div>
  )
}

export default EditZohoDesk
