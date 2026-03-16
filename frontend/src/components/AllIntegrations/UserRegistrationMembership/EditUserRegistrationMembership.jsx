import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { checkMappedFields, handleInput } from './UserRegistrationMembershipCommonFunc'
import UserRegistrationMembershipIntegLayout from './UserRegistrationMembershipIntegLayout'

export default function EditUserRegistrationMembership({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [userRegistrationConf, setUserRegistrationConf] = useRecoilState($actionConf)
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
          onChange={e => handleInput(e, userRegistrationConf, setUserRegistrationConf)}
          name="name"
          value={userRegistrationConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <UserRegistrationMembershipIntegLayout
        formFields={formFields}
        userRegistrationConf={userRegistrationConf}
        setUserRegistrationConf={setUserRegistrationConf}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: userRegistrationConf,
            navigate,
            id,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={!checkMappedFields(userRegistrationConf)}
        isLoading={isLoading}
        dataConf={userRegistrationConf}
        setDataConf={setUserRegistrationConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}
