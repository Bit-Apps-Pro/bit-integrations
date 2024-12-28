import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import BuddyBossActions from './BuddyBossActions'
import { getAllBuddyBossGroup, getAllForum, getAllTopic, getAllUser } from './BuddyBossCommonFunc'
import BuddyBossFieldMap from './BuddyBossFieldMap'
import Note from '../../Utilities/Note'
import {
  ADD_POST_GRP_ACTIVITY_STREAM_PRO,
  ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO,
  ADD_POST_USER_ACTIVITY_STREAM_PRO,
  ADD_USER_GROUP,
  CREATE_GROUP_PRO,
  END_FRIENDSHIP_WITH_USER_PRO,
  FOLLOW_USER_PRO,
  POST_REPLY_TOPIC_FORUM_PRO,
  POST_TOPIC_FORUM_PRO,
  REMOVE_USER_FROM_GROUP_PRO,
  SEND_FRIENDSHIP_REQ_USER_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_NOTIFICATION_USER_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_USER_PRO,
  SET_USER_STATUS_PRO,
  STOP_FOLLOWING_USER_PRO,
  SUBSCRIBE_USER_FORUM_PRO
} from './IntegrationHelpers'

export default function BuddyBossIntegLayout({
  formFields,
  handleInput,
  buddyBossConf,
  setBuddyBossConf,
  isLoading,
  setIsLoading,
  setSnackbar,
  allIntegURL,
  isInfo,
  edit
}) {
  useEffect(() => {
    if (toFetchGroups.includes(Number(buddyBossConf?.mainAction))) {
      getAllBuddyBossGroup(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
    if (toFetchUsers.includes(Number(buddyBossConf?.mainAction))) {
      getAllUser(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
    if (toFetchForum.includes(Number(buddyBossConf?.mainAction))) {
      getAllForum(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
    }
  }, [buddyBossConf.mainAction])

  const changeHandler = (val, name) => {
    const newConf = { ...buddyBossConf }

    if (val !== '') {
      newConf[name] = val
    } else {
      delete newConf[name]
    }

    setBuddyBossConf({ ...newConf })
  }

  const getFields = (e) => {
    let buddyBossFields

    switch (Number(buddyBossConf?.mainAction)) {
      case CREATE_GROUP_PRO:
        buddyBossFields = buddyBossConf?.createGroupFields || []
        break

      case POST_TOPIC_FORUM_PRO:
        buddyBossFields = buddyBossConf?.topicInForumFields || []
        break

      case SEND_NOTIFICATION_MEMBER_GRP_PRO:
      case SEND_NOTIFICATION_USER_PRO:
        buddyBossFields = buddyBossConf?.sendAllUserNotificationFields || []
        break

      case SEND_PRIVATE_MSG_MEMBER_GRP_PRO:
      case SEND_PRIVATE_MSG_USER_PRO:
        buddyBossFields = buddyBossConf?.sendAllGroupPrivateMessageFields || []
        break

      case ADD_POST_GRP_ACTIVITY_STREAM_PRO:
        buddyBossFields = buddyBossConf?.addPostToGroupFields || []
        break

      case ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO:
      case ADD_POST_USER_ACTIVITY_STREAM_PRO:
        buddyBossFields = buddyBossConf?.addPostSiteWideActivityStreamFields || []
        break

      case POST_REPLY_TOPIC_FORUM_PRO:
        buddyBossFields = buddyBossConf?.postReplyTopicForumFields || []
        break

      default:
        buddyBossFields = []
    }

    return buddyBossFields
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="mainAction"
        value={buddyBossConf?.mainAction}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {buddyBossConf?.allActions &&
          buddyBossConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
      </select>
      <br />
      <br />
      {showGroupActions.includes(Number(buddyBossConf?.mainAction)) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select group:', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.groupId}
              options={
                buddyBossConf?.default?.allGroup &&
                buddyBossConf.default.allGroup.map((item) => ({ label: item.name, value: item.id }))
              }
              onChange={(val) => changeHandler(val, 'groupId')}
              singleSelect
            />
            <button
              onClick={() =>
                getAllBuddyBossGroup(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Fetch All Groups', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {showUserActions.includes(Number(buddyBossConf?.mainAction)) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">
              {`${
                Number(buddyBossConf.mainAction) === SEND_NOTIFICATION_MEMBER_GRP_PRO ||
                Number(buddyBossConf.mainAction) === SEND_PRIVATE_MSG_USER_PRO
                  ? __('Sender User', 'bit-integrations')
                  : __('Select User', 'bit-integrations')
              }`}
            </b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.friendId}
              options={
                buddyBossConf?.default?.allUser &&
                buddyBossConf.default.allUser.map((item) => ({
                  label: item.display_name,
                  value: item.ID
                }))
              }
              onChange={(val) => changeHandler(val, 'friendId')}
              singleSelect={Number(buddyBossConf?.mainAction) !== STOP_FOLLOWING_USER_PRO}
            />
            <button
              onClick={() => getAllUser(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Fetch All User', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {Number(buddyBossConf?.mainAction) === SEND_PRIVATE_MSG_USER_PRO && (
        <>
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Recipient User', 'bit-integrations')}</b>
            <select
              className="btcd-paper-inp w-5"
              name="formField"
              value={buddyBossConf?.recipientUserId || ''}
              onChange={(e) => changeHandler(e.target.value, 'recipientUserId')}>
              <option value="">{__('Select User', 'bit-integrations')}</option>
              <optgroup label={__('Logged In User', 'bit-integrations')}>
                <option value="loggedInUser">{__('Logged In User', 'bit-integrations')}</option>
              </optgroup>
              <optgroup label={__('All User', 'bit-integrations')}>
                {buddyBossConf?.default?.allUser &&
                  buddyBossConf.default.allUser.map((item) => (
                    <option key={`ff-rm-${item.ID}`} value={item.ID}>
                      {item.display_name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label={__('Select user id from Form Fields', 'bit-integrations')}>
                {formFields?.map((f) => (
                  <option key={`ff-rm-${f.name}`} value={'${' + f.name + '}'}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={() => getAllUser(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Fetch All User', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {showForumActions.includes(Number(buddyBossConf?.mainAction)) && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Forum:', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.forumId}
              options={
                buddyBossConf?.default?.allForum &&
                buddyBossConf.default.allForum.map((item) => ({
                  label: item.forum_title,
                  value: item.forum_id.toString()
                }))
              }
              onChange={(val) => changeHandler(val, 'forumId')}
              singleSelect={Number(buddyBossConf?.mainAction) !== SUBSCRIBE_USER_FORUM_PRO}
            />
            <button
              onClick={() => getAllForum(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Fetch All Forum', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}
      {buddyBossConf?.forumId !== undefined &&
        Number(buddyBossConf?.mainAction) === POST_REPLY_TOPIC_FORUM_PRO && (
          <>
            <br />
            <div className="flx mt-4">
              <b className="wdt-200 d-in-b">{__('Select Topic:', 'bit-integrations')}</b>
              <MultiSelect
                className="w-5"
                defaultValue={buddyBossConf?.topicId}
                options={
                  buddyBossConf?.default?.allTopic &&
                  buddyBossConf.default.allTopic.map((item) => ({
                    label: item.topic_title,
                    value: item.topic_id.toString()
                  }))
                }
                onChange={(val) => changeHandler(val, 'topicId')}
                singleSelect
              />
              <button
                onClick={() => getAllTopic(buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Fetch All Topic', 'bit-integrations')}'` }}
                type="button"
                disabled={isLoading}>
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {Number(buddyBossConf?.mainAction) === SET_USER_STATUS_PRO && (
        <>
          <br />
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Select Status:', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={buddyBossConf?.userStatusId}
              options={buddyBossConf.userStatusOptions.map((item) => ({
                label: item.label,
                value: item.key
              }))}
              onChange={(val) => changeHandler(val, 'userStatusId')}
              singleSelect
            />
          </div>
        </>
      )}

      <br />
      <br />
      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      <>
        {showFieldMapping.includes(Number(buddyBossConf?.mainAction)) && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp">
                <b>{__('Form Fields', 'bit-integrations')}</b>
              </div>
              <div className="txt-dp">
                <b>{__('BuddyBoss Fields', 'bit-integrations')}</b>
              </div>
            </div>
            {buddyBossConf.field_map.map((itm, i) => (
              <BuddyBossFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                buddyBossConf={buddyBossConf}
                formFields={formFields}
                setBuddyBossConf={setBuddyBossConf}
                setSnackbar={setSnackbar}
                mainAction={buddyBossConf?.mainAction}
                buddyBossFields={getFields()}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(buddyBossConf.field_map.length, buddyBossConf, setBuddyBossConf)
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
          </>
        )}
        <br />
        <br />
        {Number(buddyBossConf.mainAction) === CREATE_GROUP_PRO && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <BuddyBossActions
              buddyBossConf={buddyBossConf}
              setBuddyBossConf={setBuddyBossConf}
              formFields={formFields}
            />
          </>
        )}
      </>
      <br />
      <Note note={__('Some integrations will only work for logged-in users.', 'bit-integrations')} />
    </>
  )
}

const toFetchGroups = [
  ADD_USER_GROUP,
  REMOVE_USER_FROM_GROUP_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO
]

const toFetchUsers = [
  END_FRIENDSHIP_WITH_USER_PRO,
  FOLLOW_USER_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_USER_PRO,
  STOP_FOLLOWING_USER_PRO,
  ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO,
  ADD_POST_USER_ACTIVITY_STREAM_PRO
]

const showGroupActions = [
  ADD_USER_GROUP,
  REMOVE_USER_FROM_GROUP_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  ADD_POST_GRP_ACTIVITY_STREAM_PRO
]

const showUserActions = [
  END_FRIENDSHIP_WITH_USER_PRO,
  FOLLOW_USER_PRO,
  SEND_FRIENDSHIP_REQ_USER_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_USER_PRO,
  STOP_FOLLOWING_USER_PRO,
  ADD_POST_GRP_ACTIVITY_STREAM_PRO,
  ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO,
  ADD_POST_USER_ACTIVITY_STREAM_PRO
]

const showFieldMapping = [
  CREATE_GROUP_PRO,
  POST_TOPIC_FORUM_PRO,
  SEND_NOTIFICATION_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_MEMBER_GRP_PRO,
  SEND_PRIVATE_MSG_USER_PRO,
  SEND_NOTIFICATION_USER_PRO,
  ADD_POST_GRP_ACTIVITY_STREAM_PRO,
  ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO,
  ADD_POST_USER_ACTIVITY_STREAM_PRO,
  POST_REPLY_TOPIC_FORUM_PRO
]

const toFetchForum = [POST_TOPIC_FORUM_PRO, SUBSCRIBE_USER_FORUM_PRO, POST_REPLY_TOPIC_FORUM_PRO]
const showForumActions = [POST_TOPIC_FORUM_PRO, SUBSCRIBE_USER_FORUM_PRO, POST_REPLY_TOPIC_FORUM_PRO]
