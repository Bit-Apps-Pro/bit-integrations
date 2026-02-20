import { __ } from '../i18nwrap'

// eslint-disable-next-line import/prefer-default-export
export const postFields = [
  {
    key: 'post_title',
    name: __('Post Title', 'bit-integrations'),
    required: true
  },
  {
    key: 'post_name',
    name: __('Post Name', 'bit-integrations')
  },
  {
    key: 'post_content',
    name: __('Post Content', 'bit-integrations')
  },
  {
    key: 'post_excerpt',
    name: __('Post Excerpt', 'bit-integrations')
  },
  {
    key: '_thumbnail_id',
    name: __('Featured Image', 'bit-integrations')
  }
]
