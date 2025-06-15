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
import FluentSupportIntegLayout from './FluentSupportIntegLayout'
import { checkMappedFields, handleInput } from './FluentSupportCommonFunc'

function EditFluentSupport({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [fluentSupportConf, setFluentSupportConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, fluentSupportConf, setFluentSupportConf)}
          name="name"
          value={fluentSupportConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <FluentSupportIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, fluentSupportConf, setFluentSupportConf, null, setIsLoading, setSnackbar)
        }
        fluentSupportConf={fluentSupportConf}
        setFluentSupportConf={setFluentSupportConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            allIntegURL,
            conf: fluentSupportConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={
          isLoading ||
          fluentSupportConf.field_map.length < 1 ||
          !checkMappedFields(fluentSupportConf) ||
          !fluentSupportConf.actions.support_staff
        }
        isLoading={isLoading}
        dataConf={fluentSupportConf}
        setDataConf={setFluentSupportConf}
        formFields={formFields}
      />

      <br />
    </div>
  )
}

export default EditFluentSupport
