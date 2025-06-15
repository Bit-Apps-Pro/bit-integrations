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
import { checkMappedFields, handleInput } from './MailPoetCommonFunc'
import MailPoetIntegLayout from './MailPoetIntegLayout'

function EditMailPoet({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [mailPoetConf, setMailPoetConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const saveConfig = () => {
    if (!checkMappedFields(mailPoetConf)) {
      setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
      return
    }
    saveActionConf({ flow, setFlow, allIntegURL, conf: mailPoetConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-6" onChange={e => handleInput(e, mailPoetConf, setMailPoetConf)} name="name" value={mailPoetConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <MailPoetIntegLayout
        formID={formID}
        formFields={formFields}
        mailPoetConf={mailPoetConf}
        setMailPoetConf={setMailPoetConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        edit={mailPoetConf.lists}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={mailPoetConf.lists === '' || mailPoetConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={mailPoetConf}
        setDataConf={setMailPoetConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditMailPoet
