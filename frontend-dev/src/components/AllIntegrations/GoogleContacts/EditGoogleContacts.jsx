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
import { checkMappedFields, handleInput } from './GoogleContactsCommonFunc'
import GoogleContactsIntegLayout from './GoogleContactsIntegLayout'

function EditGoogleContacts({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [googleContactsConf, setGoogleContactsConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: googleContactsConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }} className="p-2">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, googleContactsConf, setGoogleContactsConf)}
          name="name"
          value={googleContactsConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <GoogleContactsIntegLayout
        flowID={id}
        formFields={formFields}
        googleContactsConf={googleContactsConf}
        setGoogleContactsConf={setGoogleContactsConf}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={
          !checkMappedFields(googleContactsConf?.field_map) ||
          googleContactsConf.mainAction === '' ||
          isLoading
        }
        isLoading={isLoading}
        dataConf={googleContactsConf}
        setDataConf={setGoogleContactsConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditGoogleContacts
