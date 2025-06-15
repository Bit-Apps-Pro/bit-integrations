import { __ } from '../i18nwrap'

// eslint-disable-next-line import/prefer-default-export
export const userFields = [
  {
    key: 'user_email',
    name: __('Email', 'bit-integrations'),
    required: true
  },
  {
    key: 'user_login',
    name: __('Username', 'bit-integrations'),
    required: false
  },
  {
    key: 'nickname',
    name: __('Nickname', 'bit-integrations'),
    required: false
  },
  {
    key: 'display_name',
    name: __('Display Name', 'bit-integrations'),
    required: false
  },
  {
    key: 'first_name',
    name: __('First Name', 'bit-integrations'),
    required: false
  },
  {
    key: 'last_name',
    name: __('Last Name', 'bit-integrations'),
    required: false
  },
  {
    key: 'user_pass',
    name: __('Password', 'bit-integrations'),
    required: false
  },
  {
    key: 'user_url',
    name: __('Website', 'bit-integrations'),
    required: false
  },
  {
    key: 'description',
    name: __('Biographical Info', 'bit-integrations'),
    required: false
  }
]
