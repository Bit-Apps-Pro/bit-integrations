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
import AcumbamailIntegLayout from './AcumbamailIntegLayout'
import { checkMappedFields, handleInput } from './AcumbamailCommonFunc'

function EditAcumbamail({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [acumbamailConf, setAcumbamailConf] = useRecoilState($actionConf)
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
          onChange={(e) => handleInput(e, acumbamailConf, setAcumbamailConf)}
          name="name"
          value={acumbamailConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <AcumbamailIntegLayout
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar, formID)
        }
        acumbamailConf={acumbamailConf}
        setAcumbamailConf={setAcumbamailConf}
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
            conf: acumbamailConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={!acumbamailConf.mainAction || !checkMappedFields(acumbamailConf)}
        isLoading={isLoading}
        dataConf={acumbamailConf}
        setDataConf={setAcumbamailConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditAcumbamail
