import { __ } from '../../../Utils/i18nwrap'

export const TASK_LIST_VALUES = {
  NEW_POST: 'newPost',
  NEW_COLLECTION_POST: 'newCollectionPost'
}

export const TASK_LIST = [
  { label: __('Create New Post', 'bit-integrations'), value: TASK_LIST_VALUES.NEW_POST },
  { label: __('Create New Collection Post', 'bit-integrations'), value: TASK_LIST_VALUES.NEW_COLLECTION_POST },
]

export const POST_TYPE_TASK_ARRAY = [
  TASK_LIST_VALUES.NEW_POST,
  TASK_LIST_VALUES.NEW_COLLECTION_POST
]

// constants for static post type

export const COLLECTION_POST_TYPE = 'collection'