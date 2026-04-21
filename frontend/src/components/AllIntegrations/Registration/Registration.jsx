/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import UserFieldMap from './UserFieldMap'
import UserMetaField from './UserMetaField'
import {
  checkMappedUserFields,
  generateRegistrationFieldMap,
  getRegistrationFieldsByAction,
  isLegacyRegistrationAction,
  registrationExtraActions
} from './UserHelperFunction'
import LoaderSm from '../../Loaders/LoaderSm'
import ConditionalLogic from '../../ConditionalLogic'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Note from '../../Utilities/Note'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import RegistrationActions from './RegistrationActions'

export default function Registration({ formFields, setFlow, flow, allIntegURL }) {
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [userConf, setUserConf] = useState({
    name: 'WP User Registration',
    type: 'WP User Registration',
    action_type: 'new_user',
    user_map: generateRegistrationFieldMap('new_user'),
    meta_map: [{}],
    condition: {
      action_behavior: '',
      actions: [{ field: '', action: 'value' }],
      logics: [{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }]
    }
  })

  useEffect(() => {
    const tmpConf = { ...userConf }
    bitsFetch({}, 'role/list', null, 'GET').then(res => {
      if (res?.success && res !== undefined) {
        setRoles(Object.values(res?.data))
      }
    })
    if (!tmpConf.action_type) {
      tmpConf.action_type = 'new_user'
    }
    if (!tmpConf?.user_map?.[0]?.userField) {
      tmpConf.user_map = generateRegistrationFieldMap(tmpConf.action_type)
    }

    setUserConf(tmpConf)
  }, [])

  const setActionType = actionType => {
    const newAction = actionType || 'new_user'
    setUserConf(prevConf => ({
      ...prevConf,
      action_type: newAction,
      user_map: generateRegistrationFieldMap(newAction)
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
    setIsLoading(true)
    saveIntegConfig(flow, setFlow, allIntegURL, userConf, navigate, '', '', setIsLoading)
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
      <TutorialLink title="WP User Registration" links={tutorialLinks?.registration || {}} />
      <br />{' '}
      <div>
        <div className="mt-2">
          <select
            className="btcd-paper-inp w-5"
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
      </div>
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
        onClick={() => saveConfig()}
        disabled={isLoading}>
        {__('Save', 'bit-integrations')}
        {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
      </button>
    </div>
  )
}
