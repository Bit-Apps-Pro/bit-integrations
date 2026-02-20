/* eslint-disable no-unused-expressions */
import { __ } from '../../../Utils/i18nwrap'

export const addFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf.field_map.splice(i, 0, {})
  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const isDisabled = buddyBossConf => {
  switch (Number(buddyBossConf.mainAction)) {
    case CREATE_GROUP_PRO:
      return buddyBossConf.privacyId === undefined
    case ADD_USER_GROUP:
      return buddyBossConf.groupId === undefined
    case END_FRIENDSHIP_WITH_USER_PRO:
      return buddyBossConf.friendId === undefined
    case FOLLOW_USER_PRO:
      return buddyBossConf.friendId === undefined
    case POST_TOPIC_FORUM_PRO:
      return buddyBossConf.forumId === undefined
    case REMOVE_USER_FROM_GROUP_PRO:
      return buddyBossConf.groupId === undefined
    case SEND_FRIENDSHIP_REQ_USER_PRO:
      return buddyBossConf.friendId === undefined
    case SEND_NOTIFICATION_MEMBER_GRP_PRO:
      return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
    case SEND_PRIVATE_MSG_MEMBER_GRP_PRO:
      return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
    case SEND_PRIVATE_MSG_USER_PRO:
      return buddyBossConf.friendId === undefined
    case STOP_FOLLOWING_USER_PRO:
      return buddyBossConf.friendId === undefined
    case SUBSCRIBE_USER_FORUM_PRO:
      return buddyBossConf.forumId === undefined
    case ADD_POST_GRP_ACTIVITY_STREAM_PRO:
      return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
    case ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO:
      return buddyBossConf.friendId === undefined
    case ADD_POST_USER_ACTIVITY_STREAM_PRO:
      return buddyBossConf.friendId === undefined
    case POST_REPLY_TOPIC_FORUM_PRO:
      return buddyBossConf.topicId === undefined || buddyBossConf.forumId === undefined
    case SET_USER_STATUS_PRO:
      return buddyBossConf.userStatusId === undefined
    default:
      return false
  }
}

export const CREATE_GROUP_PRO = 1
export const ADD_USER_GROUP = 2
export const END_FRIENDSHIP_WITH_USER_PRO = 3
export const FOLLOW_USER_PRO = 4
export const POST_TOPIC_FORUM_PRO = 5
export const REMOVE_USER_FROM_GROUP_PRO = 6
export const SEND_FRIENDSHIP_REQ_USER_PRO = 7
export const SEND_NOTIFICATION_MEMBER_GRP_PRO = 8
export const SEND_PRIVATE_MSG_MEMBER_GRP_PRO = 9
export const SEND_PRIVATE_MSG_USER_PRO = 10
export const SEND_NOTIFICATION_USER_PRO = 11
export const STOP_FOLLOWING_USER_PRO = 12
export const SUBSCRIBE_USER_FORUM_PRO = 13
export const ADD_POST_GRP_ACTIVITY_STREAM_PRO = 14
export const ADD_POST_SITE_WIDE_ACTIVITY_STREAM_PRO = 15
export const ADD_POST_USER_ACTIVITY_STREAM_PRO = 16
export const POST_REPLY_TOPIC_FORUM_PRO = 17
export const SET_USER_STATUS_PRO = 18
