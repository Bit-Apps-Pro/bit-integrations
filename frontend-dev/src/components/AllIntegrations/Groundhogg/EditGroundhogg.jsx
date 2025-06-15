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
import { checkMetaMappedFields, handleInput } from './GroundhoggCommonFunc'
import GroundhoggIntegLayout from './GroundhoggIntegLayout'

function EditGroundhogg({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [groundhoggConf, setGroundhoggConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const isDisabled = !(
    groundhoggConf.mainAction === '2' && groundhoggConf.addTagToUser !== ('' || undefined)
  )
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, groundhoggConf, setGroundhoggConf)}
          name="name"
          value={groundhoggConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <GroundhoggIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, groundhoggConf, setGroundhoggConf, setIsLoading, setSnackbar)
        }
        groundhoggConf={groundhoggConf}
        setGroundhoggConf={setGroundhoggConf}
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
            conf: groundhoggConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={
          (groundhoggConf.mainAction === '2'
            ? isDisabled
            : !(groundhoggConf.field_map?.length >= 1)) || isLoading
        }
        isLoading={isLoading}
        dataConf={groundhoggConf}
        setDataConf={setGroundhoggConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditGroundhogg
