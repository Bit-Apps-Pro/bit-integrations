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
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './FluentCommunityCommonFunc'
import FluentCommunityIntegLayout from './FluentCommunityIntegLayout'

function EditFluentCommunity({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [fluentCommunityConf, setFluentCommunityConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const saveConfig = () => {
    if (!checkMappedFields(fluentCommunityConf)) {
      setSnackbar({
        show: true,
        msg: __('Please map all required fields to continue.', 'bit-integrations')
      })
      return
    }
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: fluentCommunityConf,
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
          onChange={e => handleInput(e, fluentCommunityConf, setFluentCommunityConf)}
          name="name"
          value={fluentCommunityConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <FluentCommunityIntegLayout
        formID={formID}
        formFields={formFields}
        fluentCommunityConf={fluentCommunityConf}
        setFluentCommunityConf={setFluentCommunityConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={fluentCommunityConf.space_id === '' || fluentCommunityConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={fluentCommunityConf}
        setDataConf={setFluentCommunityConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditFluentCommunity
