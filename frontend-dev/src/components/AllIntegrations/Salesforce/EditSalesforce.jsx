/* eslint-disable no-param-reassign */

import { useState } from 'react'
import toast from 'react-hot-toast'
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
import { checkMappedFields, handleInput } from './SalesforceCommonFunc'
import SelesforceIntegLayout from './SalesforceIntegLayout'

function EditSalesforce({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [salesforceConf, setSalesforceConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const checkedActionFieldsMapType = ['contact-create', 'lead-create', 'account-create', 'campaign-create', 'opportunity-create', 'event-create', 'case-create'].includes(salesforceConf?.actionName)
  const saveConfig = () => {
    if (checkedActionFieldsMapType && !checkMappedFields(salesforceConf)) {
      toast.error('Please map mandatory fields !')
      return
    }
    saveActionConf({ flow, allIntegURL, conf: salesforceConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  const isDisabled = () => {
    if (salesforceConf?.actionName === 'opportunity-create') {
      return !salesforceConf.actions?.opportunityStageId
    }
    if (salesforceConf?.actionName === 'event-create') {
      return !salesforceConf.actions?.eventSubjectId
    }
    if (salesforceConf?.actionName === 'add-campaign-member') {
      return !salesforceConf.campaignId
    }
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, salesforceConf, setSalesforceConf)} name="name" value={salesforceConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <SelesforceIntegLayout
        formFields={formField}
        handleInput={(e) => handleInput(e, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)}
        salesforceConf={salesforceConf}
        setSalesforceConf={setSalesforceConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={isDisabled() || isLoading}
        isLoading={isLoading}
        dataConf={salesforceConf}
        setDataConf={setSalesforceConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditSalesforce
