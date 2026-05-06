import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    name: 'add_post_activity_stream',
    label: __('Add Post to Activity Stream', 'bit-integrations'),
    is_pro: true
  },
  { name: 'change_user_role', label: __('Change User Role', 'bit-integrations'), is_pro: true },
  { name: 'follow_user', label: __('Follow User', 'bit-integrations'), is_pro: true }
]

export const AddPostFields = [
  { key: 'user_email', label: __('User Email', 'bit-integrations'), required: true },
  { key: 'post_title', label: __('Post Title', 'bit-integrations'), required: true },
  { key: 'post_content', label: __('Post Content', 'bit-integrations'), required: true }
]

export const ChangeUserRoleFields = [
  { key: 'user_email', label: __('User Email', 'bit-integrations'), required: true },
  { key: 'new_role', label: __('New Role', 'bit-integrations'), required: true }
]

export const FollowUserFields = [
  { key: 'user_email', label: __('User Email (Follower)', 'bit-integrations'), required: true },
  {
    key: 'follow_user_email',
    label: __('User Email to Follow', 'bit-integrations'),
    required: true
  }
]
