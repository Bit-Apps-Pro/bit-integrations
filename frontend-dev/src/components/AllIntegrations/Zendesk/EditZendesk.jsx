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
import { checkMappedFields, handleInput } from './ZendeskCommonFunc'
import ZendeskIntegLayout from './ZendeskIntegLayout'

function EditZendesk({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [zendeskConf, setZendeskConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(zendeskConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (zendeskConf.actionName === 'lead' || zendeskConf.actionName === 'deal') {
      if (!zendeskConf.selectedCRMCompany) {
        toast.error(__('Please select a company', 'bit-integrations'))
        return
      }
      if (!zendeskConf.selectedCRMContact) {
        toast.error(__('Please select a contact', 'bit-integrations'))
        return
      }
      if (!zendeskConf.selectedCRMSources && zendeskConf.actionName === 'lead') {
        toast.error(__('Please select a Source', 'bit-integrations'))
        return
      }
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: zendeskConf,
      navigate,
      edit: 1,
      setLoading,
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
          onChange={(e) => handleInput(e, zendeskConf, setZendeskConf)}
          name="name"
          value={zendeskConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ZendeskIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, zendeskConf, setZendeskConf, setLoading, setSnackbar)}
        zendeskConf={zendeskConf}
        setZendeskConf={setZendeskConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(zendeskConf)}
        isLoading={isLoading}
        dataConf={zendeskConf}
        setDataConf={setZendeskConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditZendesk
