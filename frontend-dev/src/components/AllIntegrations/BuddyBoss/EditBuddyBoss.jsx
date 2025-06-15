/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import {
  ADD_POST_GRP_ACTIVITY_STREAM_PRO,
  ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO,
  ADD_POST_USER_ACTIVITY_STREAM_PRO,
  ADD_USER_GROUP,
  CREATE_GROUP_PRO,
  END_FRIENDSHIP_WITH_USER_PRO,
  FOLLOW_USER_PRO,
  isDisabled,
  POST_REPLY_TOPIC_FORUM_PRO,
  POST_TOPIC_FORUM_PRO,
  REMOVE_USER_FROM_GROUP_PRO,
  SEND_FRIENDSHIP_REQ_USER_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_USER_PRO,
  SET_USER_STATUS_PRO,
  STOP_FOLLOWING_USER_PRO,
  SUBSCRIBE_USER_FORUM_PRO
} from './IntegrationHelpers'
import { checkMappedFields, handleInput } from './BuddyBossCommonFunc'
import BuddyBossIntegLayout from './BuddyBossIntegLayout'

function EditBuddyBoss({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [buddyBossConf, setBuddyBossConf] = useRecoilState($actionConf)
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
          onChange={(e) => handleInput(e, buddyBossConf, setBuddyBossConf)}
          name="name"
          value={buddyBossConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <BuddyBossIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
        buddyBossConf={buddyBossConf}
        setBuddyBossConf={setBuddyBossConf}
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
            conf: buddyBossConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={
          !buddyBossConf.mainAction ||
          !checkMappedFields(buddyBossConf) ||
          isLoading ||
          isDisabled(buddyBossConf)
        }
        isLoading={isLoading}
        dataConf={buddyBossConf}
        setDataConf={setBuddyBossConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditBuddyBoss
