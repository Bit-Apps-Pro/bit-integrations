import { __ } from '../../../Utils/i18nwrap'

export const TASK_LIST_VALUES = {
  USER_REPUTATION: 'userReputation',
  ADD_TO_GROUP: 'addToGroup',
  REMOVE_FROM_GROUP: 'removeFromGroup',
  CREATE_TOPIC: 'createTopic',
  DELETE_TOPIC: 'deleteTopic'
}

export const TASK_LIST = [
  { label: __('Set User Reputation', 'bit-integrations'), value: TASK_LIST_VALUES.USER_REPUTATION },
  { label: __('Add User to Group', 'bit-integrations'), value: TASK_LIST_VALUES.ADD_TO_GROUP },
  {
    label: __('Remove User from Group', 'bit-integrations'),
    value: TASK_LIST_VALUES.REMOVE_FROM_GROUP
  },
  { label: __('Create a New Topic', 'bit-integrations'), value: TASK_LIST_VALUES.CREATE_TOPIC },
  { label: __('Delete a Topic', 'bit-integrations'), value: TASK_LIST_VALUES.DELETE_TOPIC }
]
