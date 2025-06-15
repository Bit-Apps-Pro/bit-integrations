import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './MailChimpCommonFunc'
import MailChimpIntegLayout from './MailChimpIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'

function EditMailChimp({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [sheetConf, setSheetConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, sheetConf, setSheetConf)} name="name" value={sheetConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />


      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <MailChimpIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, sheetConf, setSheetConf, formID, setIsLoading, setSnackbar)}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: sheetConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={sheetConf.listId === '' || sheetConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={sheetConf}
        setDataConf={setSheetConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditMailChimp
