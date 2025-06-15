/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react'
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
import { checkMappedFields, getAllCustomActionModules, handleInput } from './SalesforceCommonFunc'
import SelesforceIntegLayout from './SalesforceIntegLayout'
import { create } from 'mutative'

function EditSalesforce({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [salesforceConf, setSalesforceConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  useEffect(() => {
    if (!salesforceConf.action_modules) {
      setSalesforceConf((prevConf) =>
        create(prevConf, (draftConf) => {
          const action_modules = [
            { label: __('Create Contact', 'bit-integrations'), value: 'contact-create' },
            { label: __('Create lead', 'bit-integrations'), value: 'lead-create' },
            { label: __('Create Account', 'bit-integrations'), value: 'account-create' },
            { label: __('Create Campaign', 'bit-integrations'), value: 'campaign-create' },
            { label: __('Add campaign member', 'bit-integrations'), value: 'add-campaign-member' },
            { label: __('Create Task', 'bit-integrations'), value: 'task-create' },
            { label: __('Oportunity Create', 'bit-integrations'), value: 'opportunity-create' },
            { label: __('Event Create', 'bit-integrations'), value: 'event-create' },
            { label: __('Create Case', 'bit-integrations'), value: 'case-create' }
          ]
          draftConf['action_modules'] = action_modules
          draftConf['selesforceActionModules'] = action_modules
        })
      )
      getAllCustomActionModules(salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)
    }
  }, [])

  const checkedActionFieldsMapType = [
    'contact-create',
    'lead-create',
    'account-create',
    'campaign-create',
    'opportunity-create',
    'event-create',
    'case-create'
  ].includes(salesforceConf?.actionName)
  const saveConfig = () => {
    if (checkedActionFieldsMapType && !checkMappedFields(salesforceConf)) {
      toast.error('Please map mandatory fields !')
      return
    }
    saveActionConf({
      flow,
      allIntegURL,
      conf: salesforceConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
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
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, salesforceConf, setSalesforceConf)}
          name="name"
          value={salesforceConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <SelesforceIntegLayout
        formFields={formField}
        handleInput={(e) =>
          handleInput(e, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)
        }
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
