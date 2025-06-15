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
import { checkMappedFields, handleInput } from './PropovoiceCrmCommonFunc'
import PropovoiceCrmIntegLayout from './PropovoiceCrmIntegLayout'

function EditPropovoiceCrm({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [propovoiceCrmConf, setPropovoiceCrmConf] = useRecoilState($actionConf)
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
          onChange={(e) => handleInput(e, propovoiceCrmConf, setPropovoiceCrmConf)}
          name="name"
          value={propovoiceCrmConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <PropovoiceCrmIntegLayout
        formID={formID}
        formFields={formFields}
        propovoiceCrmConf={propovoiceCrmConf}
        setPropovoiceCrmConf={setPropovoiceCrmConf}
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
            conf: propovoiceCrmConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={isLoading}
        isLoading={isLoading}
        dataConf={propovoiceCrmConf}
        setDataConf={setPropovoiceCrmConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditPropovoiceCrm
