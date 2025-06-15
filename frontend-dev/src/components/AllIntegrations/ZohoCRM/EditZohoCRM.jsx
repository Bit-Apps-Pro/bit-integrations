/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoCRMCommonFunc'
import ZohoCRMIntegLayout from './ZohoCRMIntegLayout'

function EditZohoCRM({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [crmConf, setCrmConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const formFields = useRecoilValue($formFields)
  const saveConfig = () => {
    if (!checkMappedFields(crmConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: crmConf,
      navigate,
      id,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 ">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, tab, crmConf, setCrmConf)}
          name="name"
          value={crmConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <ZohoCRMIntegLayout
        tab={tab}
        settab={settab}
        formID={flow.triggered_entity_id}
        formFields={formFields}
        handleInput={(e) => handleInput(e, tab, crmConf, setCrmConf, setIsLoading, setSnackbar)}
        crmConf={crmConf}
        setCrmConf={setCrmConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={crmConf.module === '' || crmConf.layout === '' || crmConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={crmConf}
        setDataConf={setCrmConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditZohoCRM
