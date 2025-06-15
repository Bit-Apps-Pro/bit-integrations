/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf, saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import UserFieldMap from './UserFieldMap'
import UserMetaField from './UserMetaField'
import { userFields } from '../../../Utils/StaticData/userField'
import { checkMappedUserFields } from './UserHelperFunction'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import LoaderSm from '../../Loaders/LoaderSm'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'
import TableCheckBox from '../../Utilities/TableCheckBox'
import ConditionalLogic from '../../ConditionalLogic'
import CheckBox from '../../Utilities/CheckBox'
import Note from '../../Utilities/Note'
import RegistrationActions from './RegistrationActions'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
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
  const { registration } = tutorialLinks

  useEffect(() => {
    const tmpConf = { ...userConf }

    if (!tmpConf?.user_map?.[0]?.userField) {
      tmpConf.user_map = userFields
        .filter((fld) => fld.required)
        .map((fl) => ({ formField: '', userField: fl.key, required: fl.required }))
    }

    setUserConf(tmpConf)
  }, [])

  const saveConfig = () => {
    if (!userConf.action_type) {
      setSnackbar({ show: true, msg: __('Please select action type', 'bit-integrations') })
      return
    }
    if (!userConf.user_role && userConf.action_type !== 'updated_user') {
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

  const actionHandler = (e) => {
    const newConf = { ...userConf }
    const { name, value } = e.target
    if (e.target.checked) {
      newConf[name] = value
    }
    setUserConf({ ...newConf })
  }

  const userUpdateInstruction = `
  <ul>
  <li>${__('The user must be logged in when updating profile', 'bit-integrations')}</li>
  <li>${__('The user cannot change the value of the username field when updating the user profile.', 'bit-integrations')}</li>
     
  </ul>`
  const userCreateInstruction = `
  <ul>
  <li>${__('If the Username and Password fields are blank then the user will take the value of the email field as the field and the password will be auto-generated.', 'bit-integrations')}</li>  
  </ul>`

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {registration?.youTubeLink && (
        <TutorialLink title="WP User Registration" youTubeLink={registration?.youTubeLink} />
      )}
      {registration?.docLink && (
        <TutorialLink title="WP User Registration" docLink={registration?.docLink} />
      )}
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <div className="wdt-200 d-in-b">{__('Action type', 'bit-integrations')}</div>
        <CheckBox
          radio
          name="action_type"
          onChange={actionHandler}
          checked={userConf?.action_type === 'new_user'}
          value="new_user"
          title={__('New User Create', 'bit-integrations')}
        />
        <CheckBox
          radio
          name="action_type"
          onChange={actionHandler}
          checked={userConf?.action_type === 'updated_user'}
          value="updated_user"
          title={__('Updated User', 'bit-integrations')}
        />
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
          userFields={userFields}
        />
        <br />
      </div>
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
        note={
          userConf?.action_type === 'updated_user' ? userUpdateInstruction : userCreateInstruction
        }
      />

      {userConf?.condition && (
        <>
          <div className="flx">
            <TableCheckBox
              onChange={(e) => checkedCondition(e.target.value, e.target.checked)}
              checked={userConf?.condition?.action_behavior === 'cond'}
              className="wdt-200 mt-4 mr-2"
              value="cond"
              title={__('Conditional Logics', 'bit_integration')}
            />
          </div>
          <br />
          {userConf?.condition?.action_behavior === 'cond' && (
            <ConditionalLogic
              formFields={formFields}
              dataConf={userConf}
              setDataConf={setUserConf}
            />
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
