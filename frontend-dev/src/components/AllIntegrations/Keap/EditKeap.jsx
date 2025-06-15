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
import { handleInput } from './KeapCommonFunc'
import KeapIntegLayout from './KeapIntegLayout'

function EditGoogleSheet({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [keapConf, setKeapConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, keapConf, setKeapConf)} name="name" value={keapConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <KeapIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, keapConf, setKeapConf, formID, setIsLoading, setSnackbar)}
        keapConf={keapConf}
        setKeapConf={setKeapConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: keapConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={keapConf.field_map.length < 2}
        isLoading={isLoading}
        dataConf={keapConf}
        setDataConf={setKeapConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditGoogleSheet
