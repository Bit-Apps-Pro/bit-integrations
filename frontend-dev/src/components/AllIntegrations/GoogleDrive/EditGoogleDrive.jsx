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
import { handleInput } from './GoogleDriveCommonFunc'
import GoogleDriveIntegLayout from './GoogleDriveIntegLayout'

function EditGoogleDrive({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [googleDriveConf, setGoogleDriveConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: googleDriveConf,
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
          onChange={(e) => handleInput(e, googleDriveConf, setGoogleDriveConf)}
          name="name"
          value={googleDriveConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <GoogleDriveIntegLayout
        flowID={id}
        formFields={formFields}
        googleDriveConf={googleDriveConf}
        setGoogleDriveConf={setGoogleDriveConf}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={googleDriveConf.field_map.length < 1}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditGoogleDrive
