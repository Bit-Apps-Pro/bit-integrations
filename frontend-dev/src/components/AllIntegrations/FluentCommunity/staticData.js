import { __ } from '../../../Utils/i18nwrap'

// FluentCommunity action definitions
export const actions = [
  {
    name: 'add-user',
    label: __('Add user to space', 'bit-integrations'),
    is_pro: false
  },
  {
    name: 'remove-user',
    label: __('Remove user from space', 'bit-integrations'),
    is_pro: false
  },
  {
    name: 'add-course',
    label: __('Add user to course', 'bit-integrations'),
    is_pro: false
  },
  {
    name: 'remove-course',
    label: __('Remove user from course', 'bit-integrations'),
    is_pro: false
  },
  {
    name: 'create-post',
    label: __('Create new post in feed', 'bit-integrations'),
    is_pro: false
  }
]

// Field definitions for each action
export const actionFields = {
  // All actions except create-post only need email
  'add-user': [{ label: __('Email', 'bit-integrations'), key: 'email', required: true }],
  'remove-user': [{ label: __('Email', 'bit-integrations'), key: 'email', required: true }],
  'add-course': [{ label: __('Email', 'bit-integrations'), key: 'email', required: true }],
  'remove-course': [{ label: __('Email', 'bit-integrations'), key: 'email', required: true }],
  // create-post needs email, post title, and post message
  'create-post': [
    { label: __('Email', 'bit-integrations'), key: 'email', required: true },
    { label: __('Post Title', 'bit-integrations'), key: 'post_title', required: true },
    { label: __('Post Message', 'bit-integrations'), key: 'post_message', required: true }
  ]
}

// Member roles for add-user action
export const memberRoles = [
  { id: 'member', title: __('Member', 'bit-integrations') },
  { id: 'moderator', title: __('Moderator', 'bit-integrations') },
  { id: 'admin', title: __('Admin', 'bit-integrations') }
]
