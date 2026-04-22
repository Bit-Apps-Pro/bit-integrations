/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router'
import { useRecoilState, useRecoilValue } from 'recoil'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf, saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import UserFieldMap from './UserFieldMap'
import UserMetaField from './UserMetaField'
import {
  checkMappedUserFields,
  generateRegistrationFieldMap,
  getRegistrationFieldsByAction,
  isLegacyRegistrationAction,
  registrationExtraActions
} from './UserHelperFunction'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import LoaderSm from '../../Loaders/LoaderSm'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'
import TableCheckBox from '../../Utilities/TableCheckBox'
import ConditionalLogic from '../../ConditionalLogic'
import Note from '../../Utilities/Note'
import RegistrationActions from './RegistrationActions'
import TutorialLink from '../../Utilities/TutorialLink'

export default function EditRegistration({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [userConf, setUserConf] = useRecoilState($actionConf)
  useEffect(() => {
    const tmpConf = { ...userConf }

    if (!tmpConf.action_type) {
      tmpConf.action_type = 'new_user'
    }

    if (!tmpConf?.user_map?.[0]?.userField) {
      tmpConf.user_map = generateRegistrationFieldMap(tmpConf.action_type)
    }

    setUserConf(tmpConf)
  }, [])

  const setActionType = actionType => {
    const nextAction = actionType || 'new_user'
    setUserConf(prevConf => ({
      ...prevConf,
      action_type: nextAction,
      user_map: generateRegistrationFieldMap(nextAction)
    }))
  }

  const isLegacyAction = isLegacyRegistrationAction(userConf?.action_type)
  const selectedUserFields = getRegistrationFieldsByAction(userConf?.action_type || 'new_user')
  const registrationMainActions = [
    { value: 'new_user', label: __('New User Create', 'bit-integrations') },
    { value: 'updated_user', label: __('Updated User', 'bit-integrations') },
    ...registrationExtraActions
  ]

  const saveConfig = () => {
    if (!userConf.action_type) {
      setSnackbar({ show: true, msg: __('Please select action type', 'bit-integrations') })
      return
    }
    if (userConf.action_type === 'new_user' && !userConf.user_role) {
      setSnackbar({ show: true, msg: __("User Role can't be empty", 'bit-integrations') })
      return
    }
    if (!checkMappedUserFields(userConf) && userConf.action_type !== 'updated_user') {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: userConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  const checkedCondition = (val, checked) => {
    const tmpConf = { ...userConf }
    if (checked) {
      tmpConf.condition.action_behavior = val
    } else {
      tmpConf.condition.action_behavior = ''
    }
    setUserConf(tmpConf)
  }

  const actionTypeHandler = e => {
    if (!e.target.value) {
      return
    }
    setActionType(e.target.value)
  }

  const userUpdateInstruction = `
  <ul>
  <li>${__('The user must be logged in when updating profile', 'bit-integrations')}</li>
  <li>${__(
    'The user cannot change the value of the username field when updating the user profile.',
    'bit-integrations'
  )}</li>
     
  </ul>`
  const userCreateInstruction = `
  <ul>
  <li>${__(
    'If the Username and Password fields are blank then the user will take the value of the email field as the field and the password will be auto-generated.',
    'bit-integrations'
  )}</li>  
  </ul>`

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <TutorialLink linkKey="registration" />
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <div className="wdt-200 d-in-b">{__('Action type', 'bit-integrations')}</div>
        <select
          className="btcd-paper-inp w-5 ml-2"
          value={userConf?.action_type || 'new_user'}
          onChange={actionTypeHandler}>
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {registrationMainActions.map(action => (
            <option key={action.value} value={action.value}>
              {action.label}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />

      <div>
        <UserFieldMap
          formFields={formFields}
          formID={formID}
          userConf={userConf}
          setUserConf={setUserConf}
          roles={roles}
          userFields={selectedUserFields}
        />
        <br />
      </div>
      {isLegacyAction && (
        <>
          <div>
            <UserMetaField
              formFields={formFields}
              formID={formID}
              userConf={userConf}
              setUserConf={setUserConf}
            />
            <br />
          </div>

          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <RegistrationActions userConf={userConf} setUserConf={setUserConf} />

          <br />
          <Note
            note={userConf?.action_type === 'updated_user' ? userUpdateInstruction : userCreateInstruction}
          />
        </>
      )}

      {userConf?.condition && (
        <>
          <div className="flx">
            <TableCheckBox
              onChange={e => checkedCondition(e.target.value, e.target.checked)}
              checked={userConf?.condition?.action_behavior === 'cond'}
              className="wdt-200 mt-4 mr-2"
              value="cond"
              title={__('Conditional Logics', 'bit_integration')}
            />
          </div>
          <br />
          {userConf?.condition?.action_behavior === 'cond' && (
            <ConditionalLogic formFields={formFields} dataConf={userConf} setDataConf={setUserConf} />
          )}
        </>
      )}

      <button
        className="btn f-left btcd-btn-lg purple sh-sm flx"
        type="button"
        onClick={saveConfig}
        disabled={isLoading}>
        {__('Update', 'bit-integrations')}

        {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
      </button>
    </div>
  )
}
