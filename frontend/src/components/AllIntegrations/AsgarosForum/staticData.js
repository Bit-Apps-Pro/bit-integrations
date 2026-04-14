import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    label: __('Create Topic', 'bit-integrations'),
    name: 'create_topic',
    is_pro: true
  },
  {
    label: __('Create Forum', 'bit-integrations'),
    name: 'create_forum',
    is_pro: true
  },
  {
    label: __('Post Reply In Topic', 'bit-integrations'),
    name: 'post_reply_in_topic',
    is_pro: true
  },
  {
    label: __('Subscribe User In Forum', 'bit-integrations'),
    name: 'subscribe_user_in_forum',
    is_pro: true
  }
]

export const asgarosForumActionFields = {
  create_topic: [
    { key: 'forum_id', label: __('Forum ID', 'bit-integrations'), required: true },
    { key: 'topic_name', label: __('Topic Name', 'bit-integrations'), required: true },
    { key: 'topic_content', label: __('Topic Content', 'bit-integrations'), required: true },
    { key: 'author_id', label: __('Author ID', 'bit-integrations'), required: false }
  ],
  create_forum: [
    { key: 'parent_id', label: __('Parent ID', 'bit-integrations'), required: false },
    { key: 'forum_name', label: __('Forum Name', 'bit-integrations'), required: true },
    { key: 'forum_description', label: __('Forum Description', 'bit-integrations'), required: false },
    { key: 'forum_icon', label: __('Forum Icon', 'bit-integrations'), required: false }
  ],
  post_reply_in_topic: [
    { key: 'topic_id', label: __('Topic ID', 'bit-integrations'), required: true },
    { key: 'reply_content', label: __('Reply Content', 'bit-integrations'), required: true },
    { key: 'author_id', label: __('Author ID', 'bit-integrations'), required: false }
  ],
  subscribe_user_in_forum: [
    { key: 'user_id', label: __('User ID', 'bit-integrations'), required: true },
    { key: 'forum_id', label: __('Forum ID', 'bit-integrations'), required: true }
  ]
}
