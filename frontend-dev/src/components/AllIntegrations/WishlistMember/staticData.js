import { create } from 'lodash'
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

const levelNameField = [{ key: 'name', label: __('Level Name', 'bit-integrations'), required: true }]

const LevelIdField = [{ key: 'id', label: __('Level Id', 'bit-integrations'), required: true }]

const userEmailField = [
  { key: 'user_email', label: __('Email Address', 'bit-integrations'), required: true }
]

const memberFields = [
  { key: 'user_login', label: __('Username', 'bit-integrations'), required: true },
  { key: 'user_email', label: __('Email Address', 'bit-integrations'), required: true },
  { key: 'first_name', label: __('First Name', 'bit-integrations'), required: false },
  { key: 'last_name', label: __('Last Name', 'bit-integrations'), required: false },
  { key: 'user_pass', label: __('Password', 'bit-integrations'), required: false },
  { key: 'company', label: __('Company', 'bit-integrations'), required: false },
  { key: 'address1', label: __('Street Address Line 1', 'bit-integrations'), required: false },
  { key: 'address2', label: __('Street Address Line 2', 'bit-integrations'), required: false },
  { key: 'city', label: __('City/Town', 'bit-integrations'), required: false },
  { key: 'state', label: __('State/Province', 'bit-integrations'), required: false },
  { key: 'zip', label: __('Zip Code', 'bit-integrations'), required: false },
  { key: 'country', label: __('Country', 'bit-integrations'), required: false }
]

const updateMemberFields = memberFields.map(field =>
  field.key === 'user_login' ? { ...field, required: false } : field
)

export const actionFieldsMap = {
  create_level: levelNameField,
  update_level: [...LevelIdField, ...levelNameField],
  delete_level: LevelIdField,
  create_member: memberFields,
  update_member: updateMemberFields,
  delete_member: userEmailField
}
