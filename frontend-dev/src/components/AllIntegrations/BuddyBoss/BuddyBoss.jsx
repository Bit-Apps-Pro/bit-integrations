import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './BuddyBossCommonFunc'
import BuddyBossAuthorization from './BuddyBossAuthorization'
import BuddyBossIntegLayout from './BuddyBossIntegLayout'

function BuddyBoss({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Create Group Pro' },
    { key: '2', label: 'Add the user to a group' },
    { key: '3', label: 'End friendship with a user Pro' },
    { key: '4', label: 'Follow a user Pro' },
    { key: '5', label: 'Post a topic in a forum Pro' },
    { key: '6', label: 'Remove user from a group Pro' },
    { key: '7', label: 'Send a friendship request to a user Pro' },
    { key: '8', label: 'Send a notification to all members of a group Pro' },
    { key: '9', label: 'Send a private message to all members of a group Pro' },
    { key: '10', label: 'Send a private message to a user Pro' },
    { key: '11', label: 'Send a notification to a user Pro' },
    { key: '12', label: 'Stop following a user Pro' },
    { key: '13', label: 'Subscribe the user to a forum Pro' },
    { key: '14', label: 'Add a post to the activity stream of a group Pro' },
    { key: '15', label: 'Add a post to the site wide activity stream Pro' },
    { key: '16', label: 'Add a post to the user\'s activity stream Pro' },
    { key: '17', label: 'Post a reply to a topic in a forum' },
    { key: '18', label: 'Set the user\'s status to a specific status' },
  ]

  // for action 1
  const createGroupFields = [
    { key: 'group_name', label: 'Group Name', required: true },
  ]

  // for action 5
  const topicInForumFields = [
    { key: 'topic_content', label: 'Topic Content', required: true },
    { key: 'topic_title', label: 'Topic Title', required: false },
  ]

  // for action 8

  const sendAllUserNotificationFields = [
    { key: 'notification_content', label: 'Notification Content', required: true },
    { key: 'notification_link', label: 'Notification Link', required: false },
  ]

  // for action 9
  const sendAllGroupPrivateMessageFields = [
    { key: 'message_content', label: 'Message Content', required: true },
    { key: 'message_subject', label: 'Message subject', required: false },
  ]

  // for action 14

  const addPostToGroupFields = [
    { key: 'activity_action', label: 'activity_action', required: true },
    { key: 'activity_content', label: 'activity_content', required: true },
  ]

  // for action 15

  const addPostSiteWideActivityStreamFields = [
    { key: 'activity_action', label: 'activity_action', required: false },
    { key: 'activity_action_link', label: 'activity_action_link', required: false },
    { key: 'activity_content', label: 'activity_content', required: true },

  ]

  // for action 17
  const postReplyTopicForumFields = [
    { key: 'reply_content', label: 'Reply Content', required: true },
  ]

  const groupPrivacyOptions = [
    { key: '1', label: 'Public' },
    { key: '2', label: 'Private' },
    { key: '3', label: 'Hidden' },
  ]

  // for action 18
  const userStatusOptions = [
    { key: '1', label: 'Active' },
    { key: '2', label: 'Suspend' },
  ]

  const [buddyBossConf, setBuddyBossConf] = useState({
    name: 'BuddyBoss',
    type: 'BuddyBoss',
    mainAction: '',
    field_map: [
      { formField: '', buddyBossFormField: '' },
    ],
    allActions,
    groupPrivacyOptions,
    userStatusOptions,
    createGroupFields,
    topicInForumFields,
    sendAllUserNotificationFields,
    sendAllGroupPrivateMessageFields,
    addPostToGroupFields,
    addPostSiteWideActivityStreamFields,
    postReplyTopicForumFields,
    actions: {},
  })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (['1', '5', '8', '9', '10', '11', '14', '15', '16', '17'].includes(buddyBossConf.mainAction) && !checkMappedFields(buddyBossConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (buddyBossConf.mainAction !== '') {
      setStep(3)
    }
  }

  function isDisabled() {
    switch (buddyBossConf.mainAction) {
      case '1':
        return buddyBossConf.privacyId === undefined
      case '2':
        return buddyBossConf.groupId === undefined
      case '3':
        return buddyBossConf.friendId === undefined
      case '4':
        return buddyBossConf.friendId === undefined
      case '5':
        return buddyBossConf.forumId === undefined
      case '6':
        return buddyBossConf.groupId === undefined
      case '7':
        return buddyBossConf.friendId === undefined
      case '8':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '9':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '10':
        return buddyBossConf.friendId === undefined
      case '12':
        return buddyBossConf.friendId === undefined
      case '13':
        return buddyBossConf.forumId === undefined
      case '14':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '15':
        return buddyBossConf.friendId === undefined
      case '16':
        return buddyBossConf.friendId === undefined
      case '17':
        return buddyBossConf.topicId === undefined || buddyBossConf.forumId === undefined
      case '18':
        return buddyBossConf.userStatusId === undefined
      default:
        return false
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <BuddyBossAuthorization
        formID={formID}
        buddyBossConf={buddyBossConf}
        setBuddyBossConf={setBuddyBossConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <BuddyBossIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar, formID)}
          buddyBossConf={buddyBossConf}
          setBuddyBossConf={setBuddyBossConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!buddyBossConf.mainAction || isLoading || isDisabled()}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>

      </div>
      {/* STEP 3 */}

      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: buddyBossConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={buddyBossConf}
        setDataConf={setBuddyBossConf}
        formFields={formFields}
      />

    </div>
  )
}

export default BuddyBoss
