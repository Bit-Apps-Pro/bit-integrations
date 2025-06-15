import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './MailChimpCommonFunc'
import MailChimpIntegLayout from './MailChimpIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'

function EditMailChimp({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [mailChimpConf, setMailChimpConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [loading, setLoading] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, mailChimpConf, setMailChimpConf)}
          name="name"
          value={mailChimpConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <MailChimpIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(
            e,
            mailChimpConf,
            setMailChimpConf,
            formID,
            loading,
            setLoading,
            setSnackbar,
            setIsLoading
          )
        }
        mailChimpConf={mailChimpConf}
        setMailChimpConf={setMailChimpConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        loading={loading}
        setLoading={setLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: mailChimpConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={
          mailChimpConf.module === '' ||
          mailChimpConf.listId === '' ||
          mailChimpConf.field_map.length < 1 ||
          !checkMappedFields(mailChimpConf)
        }
        isLoading={isLoading}
        dataConf={mailChimpConf}
        setDataConf={setMailChimpConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditMailChimp
