import { __ } from '../../../Utils/i18nwrap'

export const ContactFields = [
  { label: __('Email Address', 'bit-integrations'), key: 'email', required: true },
  { label: __('First Name', 'bit-integrations'), key: 'first_name', required: false },
  { label: __('Last Name', 'bit-integrations'), key: 'last_name', required: false },
  { label: __('Status', 'bit-integrations'), key: 'status', required: false }
]

export const emailField = [
  { label: __('Email Address', 'bit-integrations'), key: 'email', required: true }
]
