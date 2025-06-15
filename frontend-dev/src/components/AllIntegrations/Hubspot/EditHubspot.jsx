/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import toast from 'react-hot-toast'
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
import { checkMappedFields, handleInput } from './HubspotCommonFunc'
import HubspotIntegLayout from './HubspotIntegLayout'

function EditHubspot({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [hubspotConf, setHubspotConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)
  const [loading, setLoading] = useState({
    auth: false,
    customFields: false,
    hubSpotFields: true
  })

  const saveConfig = () => {
    if (!checkMappedFields(hubspotConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (hubspotConf.actionName === 'ticket') {
      if (hubspotConf.pipeline === undefined) {
        toast.error(__('Please select a pipeline', 'bit-integrations'))
        return
      }
      if (hubspotConf.stage === undefined) {
        toast.error(__('Please select a stage', 'bit-integrations'))
        return
      }
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: hubspotConf,
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
          onChange={(e) => handleInput(e, hubspotConf, setHubspotConf)}
          name="name"
          value={hubspotConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <HubspotIntegLayout
        formFields={formField}
        handleInput={(e) => handleInput(e, hubspotConf, setHubspotConf, setIsLoading, setSnackbar)}
        hubspotConf={hubspotConf}
        setHubspotConf={setHubspotConf}
        setSnackbar={setSnackbar}
        loading={loading}
        setLoading={setLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(hubspotConf)}
        isLoading={isLoading}
        dataConf={hubspotConf}
        setDataConf={setHubspotConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditHubspot
