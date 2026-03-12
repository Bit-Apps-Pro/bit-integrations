import { __ } from '../../../Utils/i18nwrap'

export const TASK_LIST_VALUES = {
  CREATE_POST_TYPE: 'createPostType',
  CREATE_CONTENT_TYPE: 'createContentType',
  CREATE_TAXONOMY: 'createTaxonomy',
  CREATE_RELATION: 'createRelation',
  UPDATE_POST_TYPE: 'updatePostType',
  UPDATE_CONTENT_TYPE: 'updateContentType',
  UPDATE_TAXONOMY: 'updateTaxonomy',
  UPDATE_RELATION: 'updateRelation',
  DELETE_POST_TYPE: 'deletePostType',
  DELETE_CONTENT_TYPE: 'deleteContentType',
  DELETE_TAXONOMY: 'deleteTaxonomy',
  DELETE_RELATION: 'deleteRelation'
}

export const TASK_LIST = [
  { label: __('Add New Post Type', 'bit-integrations'), value: TASK_LIST_VALUES.CREATE_POST_TYPE },
  {
    label: __('Add New Custom Content Type', 'bit-integrations'),
    value: TASK_LIST_VALUES.CREATE_CONTENT_TYPE
  },
  { label: __('Add New Taxonomy', 'bit-integrations'), value: TASK_LIST_VALUES.CREATE_TAXONOMY },
  { label: __('Add New Relation', 'bit-integrations'), value: TASK_LIST_VALUES.CREATE_RELATION },
  { label: __('Update Post Type', 'bit-integrations'), value: TASK_LIST_VALUES.UPDATE_POST_TYPE },
  {
    label: __('Update Custom Content Type', 'bit-integrations'),
    value: TASK_LIST_VALUES.UPDATE_CONTENT_TYPE
  },
  { label: __('Update Taxonomy', 'bit-integrations'), value: TASK_LIST_VALUES.UPDATE_TAXONOMY },
  { label: __('Update Relation', 'bit-integrations'), value: TASK_LIST_VALUES.UPDATE_RELATION },
  { label: __('Delete Post Type', 'bit-integrations'), value: TASK_LIST_VALUES.DELETE_POST_TYPE },
  {
    label: __('Delete Custom Content Type', 'bit-integrations'),
    value: TASK_LIST_VALUES.DELETE_CONTENT_TYPE
  },
  { label: __('Delete Taxonomy', 'bit-integrations'), value: TASK_LIST_VALUES.DELETE_TAXONOMY },
  { label: __('Delete Relation', 'bit-integrations'), value: TASK_LIST_VALUES.DELETE_RELATION }
]

export const DELETE_LIST_ARRAY = [
  TASK_LIST_VALUES.DELETE_POST_TYPE,
  TASK_LIST_VALUES.DELETE_CONTENT_TYPE,
  TASK_LIST_VALUES.DELETE_TAXONOMY,
  TASK_LIST_VALUES.DELETE_RELATION
]
