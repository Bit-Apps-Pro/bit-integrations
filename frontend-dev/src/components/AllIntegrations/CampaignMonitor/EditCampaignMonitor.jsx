/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './CampaignMonitorCommonFunc'
import CampaignMonitorIntegLayout from './CampaignMonitorIntegLayout'

function EditCampaignMonitor({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [campaignMonitorConf, setCampaignMonitorConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, campaignMonitorConf, setCampaignMonitorConf)}
          name="name"
          value={campaignMonitorConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <CampaignMonitorIntegLayout
        formID={formID}
        formFields={formFields}
        campaignMonitorConf={campaignMonitorConf}
        setCampaignMonitorConf={setCampaignMonitorConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            navigate,
            conf: campaignMonitorConf,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={campaignMonitorConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={campaignMonitorConf}
        setDataConf={setCampaignMonitorConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditCampaignMonitor
