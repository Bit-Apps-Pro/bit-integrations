import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    name: 'update_post_meta',
    label: __('Update Post SEO Meta', 'bit-integrations'),
    is_pro: true
  }
]

export const UpdatePostMetaFields = [
  {
    key: 'post_id',
    label: __('Post ID', 'bit-integrations'),
    required: true
  },
  {
    key: 'title',
    label: __('Title', 'bit-integrations'),
    required: false
  },
  {
    key: 'description',
    label: __('Description', 'bit-integrations'),
    required: false
  },
  {
    key: 'keywords',
    label: __('Keywords', 'bit-integrations'),
    required: false
  },
  {
    key: 'canonical',
    label: __('Canonical URL', 'bit-integrations'),
    required: false
  },
  {
    key: 'robots_index',
    label: __('Robots Index', 'bit-integrations'),
    required: false
  },
  {
    key: 'robots_follow',
    label: __('Robots Follow', 'bit-integrations'),
    required: false
  },
  {
    key: 'robots_archive',
    label: __('Robots Archive', 'bit-integrations'),
    required: false
  },
  {
    key: 'robots_snippet',
    label: __('Robots Snippet', 'bit-integrations'),
    required: false
  },
  {
    key: 'robots_imageindex',
    label: __('Robots Image Index', 'bit-integrations'),
    required: false
  },
  {
    key: 'target_kw',
    label: __('Target Keyword', 'bit-integrations'),
    required: false
  },
  {
    key: 'primary_cat',
    label: __('Primary Category', 'bit-integrations'),
    required: false
  },
  {
    key: 'og_title',
    label: __('Open Graph Title', 'bit-integrations'),
    required: false
  },
  {
    key: 'og_description',
    label: __('Open Graph Description', 'bit-integrations'),
    required: false
  },
  {
    key: 'og_img',
    label: __('Open Graph Image', 'bit-integrations'),
    required: false
  },
  {
    key: 'twitter_title',
    label: __('Twitter Title', 'bit-integrations'),
    required: false
  },
  {
    key: 'twitter_desc',
    label: __('Twitter Description', 'bit-integrations'),
    required: false
  },
  {
    key: 'twitter_img',
    label: __('Twitter Image', 'bit-integrations'),
    required: false
  }
]
