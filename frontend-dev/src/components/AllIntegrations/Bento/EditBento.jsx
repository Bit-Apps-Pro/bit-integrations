/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { checkMappedFields, handleInput } from './BentoCommonFunc'
import BentoIntegLayout from './BentoIntegLayout'

function EditBento({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [bentoConf, setBentoConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(bentoConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: bentoConf,
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
          onChange={e => handleInput(e, bentoConf, setBentoConf)}
          name="name"
          value={bentoConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <BentoIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        bentoConf={bentoConf}
        setBentoConf={setBentoConf}
        loading={loading}
        setLoading={setLoading}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(bentoConf)}
        isLoading={isLoading}
        dataConf={bentoConf}
        setDataConf={setBentoConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditBento
