/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoMarketingHubCommonFunc'
import ZohoMarketingHubIntegLayout from './ZohoMarketingHubIntegLayout'

function EditZohoMarketingHub({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [marketingHubConf, setMarketingHubConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const formFields = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(marketingHubConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({ flow, setFlow, allIntegURL, conf: marketingHubConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, formID, marketingHubConf, setMarketingHubConf)} name="name" value={marketingHubConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ZohoMarketingHubIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, formID, marketingHubConf, setMarketingHubConf, setIsLoading, setSnackbar)}
        marketingHubConf={marketingHubConf}
        setMarketingHubConf={setMarketingHubConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={marketingHubConf.list === '' || marketingHubConf.table === '' || marketingHubConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={marketingHubConf}
        setDataConf={setMarketingHubConf}
        formFields={formFields}
      />
    </div>
  )
}

export default EditZohoMarketingHub
