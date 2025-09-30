import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  { label: __('Create New Level', 'bit-integrations'), value: 'create_level', isPro: false },
  { label: __('Update Level', 'bit-integrations'), value: 'update_level', isPro: true },
  { label: __('Delete Level', 'bit-integrations'), value: 'delete_level', isPro: true },
  { label: __('Create New Member', 'bit-integrations'), value: 'create_member', isPro: true },
  { label: __('Update Member Data', 'bit-integrations'), value: 'update_member', isPro: true },
  { label: __('Delete Member', 'bit-integrations'), value: 'delete_member', isPro: true },
  { label: __('Add Member To Level', 'bit-integrations'), value: 'add_member_to_level', isPro: true },
  {
    label: __('Remove Member From Level', 'bit-integrations'),
    value: 'remove_member_from_level',
    isPro: true
  }
]

export const levelNameFields = [
  { key: 'name', label: __('Level Name', 'bit-integrations'), required: true }
]

export const LevelIdFields = [{ key: 'id', label: __('Level Id', 'bit-integrations'), required: true }]

export const actionFieldsMap = {
  create_level: levelNameFields,
  update_level: [...LevelIdFields, ...levelNameFields],
  delete_level: LevelIdFields
}
