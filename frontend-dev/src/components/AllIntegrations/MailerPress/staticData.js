import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    name: 'create_or_update_contact',
    label: __('Create or Update Contact', 'bit-integrations'),
    is_pro: false
  },
  { name: 'delete_contact', label: __('Delete Contact', 'bit-integrations'), is_pro: true },
  { name: 'add_tags', label: __('Add Tags to Contact', 'bit-integrations'), is_pro: true },
  { name: 'remove_tags', label: __('Remove Tags from Contact', 'bit-integrations'), is_pro: true },
  { name: 'add_to_lists', label: __('Add Contact to Lists', 'bit-integrations'), is_pro: true },
  { name: 'remove_from_lists', label: __('Remove Contact from Lists', 'bit-integrations'), is_pro: true }
]

export const ContactFields = [
  { label: __('Email Address', 'bit-integrations'), key: 'email', required: true },
  { label: __('First Name', 'bit-integrations'), key: 'first_name', required: false },
  { label: __('Last Name', 'bit-integrations'), key: 'last_name', required: false },
  { label: __('Status', 'bit-integrations'), key: 'status', required: false }
]

export const emailField = [
  { label: __('Email Address', 'bit-integrations'), key: 'email', required: true }
]
