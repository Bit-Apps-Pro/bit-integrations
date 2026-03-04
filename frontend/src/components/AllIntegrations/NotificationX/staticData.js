import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    label: __('Add Notification Entry', 'bit-integrations'),
    name: 'add_notification_entry',
    is_pro: true,
  },
  {
    label: __('Delete Notification', 'bit-integrations'),
    name: 'delete_notification',
    is_pro: true,
  },
  {
    label: __('Enable Notification', 'bit-integrations'),
    name: 'enable_notification',
    is_pro: true,
  },
  {
    label: __('Disable Notification', 'bit-integrations'),
    name: 'disable_notification',
    is_pro: true,
  },
]

export const NotificationIdField = [
  { key: 'notification_id', label: __('Notification ID', 'bit-integrations'), required: true },
]

