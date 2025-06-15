/* eslint-disable no-param-reassign */
import { useState } from 'react'
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
import MailupIntegLayout from './MailupIntegLayout'
import { checkMappedFields, handleInput } from './MailupCommonFunc'

function EditMailup({ allIntegURL }) {
  const navigate = useNavigate()
  const [mailupConf, setMailupConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const saveConfig = () => {
    if (!checkMappedFields(mailupConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      allIntegURL,
      conf: mailupConf,
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
          onChange={(e) => handleInput(e, mailupConf, setMailupConf)}
          name="name"
          value={mailupConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <MailupIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formFields}
        handleInput={(e) => handleInput(e, mailupConf, setMailupConf, setIsLoading, setSnackbar)}
        mailupConf={mailupConf}
        setMailupConf={setMailupConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!mailupConf?.listId}
        isLoading={isLoading}
        dataConf={mailupConf}
        setDataConf={setMailupConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditMailup
