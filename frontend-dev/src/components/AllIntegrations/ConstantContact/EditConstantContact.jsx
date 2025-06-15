import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ConstantContactCommonFunc'
import ConstantContactIntegLayout from './ConstantContactIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'

function EditConstantContact({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [constantContactConf, setConstantContactConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, constantContactConf, setConstantContactConf)} name="name" value={constantContactConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />


      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <ConstantContactIntegLayout
        id={id}
        formFields={formFields}
        handleInput={(e) => handleInput(e, constantContactConf, setConstantContactConf, id, setIsLoading, setSnackbar)}
        constantContactConf={constantContactConf}
        setConstantContactConf={setConstantContactConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: constantContactConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={constantContactConf.listId === '' || constantContactConf.field_map.length < 1}
        // eslint-disable-next-line no-unneeded-ternary
        isLoading={isLoading === true ? true : false}
        dataConf={constantContactConf}
        setDataConf={setConstantContactConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditConstantContact
