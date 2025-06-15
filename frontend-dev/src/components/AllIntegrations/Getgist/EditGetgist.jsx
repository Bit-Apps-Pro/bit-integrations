/* eslint-disable no-param-reassign */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GetgistIntegLayout from './GetgistIntegLayout'
import { checkMappedFields, handleInput } from './GetgistCommonFunc'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'

function EditGetgist({ allIntegURL }) {
  const navigate = useNavigate()

  const [flow, setFlow] = useRecoilState($newFlow)
  const [getgistConf, setGetgistConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(getgistConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    saveActionConf({ flow, allIntegURL, conf: getgistConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, getgistConf, setGetgistConf)} name="name" value={getgistConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <GetgistIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, getgistConf, setGetgistConf, setIsLoading)}
        getgistConf={getgistConf}
        setGetgistConf={setGetgistConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={getgistConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={getgistConf}
        setDataConf={setGetgistConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditGetgist
