import { __ } from '../../../Utils/i18nwrap'

export const TASK_LIST_VALUES = {
  CREATE_VENDOR: 'createVendor',
  UPDATE_VENDOR: 'updateVendor',
  DELETE_VENDOR: 'deleteVendor',
  WITHDRAW_REQUEST: 'withdrawRequest',
  REFUND_REQUEST: 'refundRequest'
}

export const TASK_LIST = [
  { label: __('Create A New Vendor', 'bit-integrations'), value: TASK_LIST_VALUES.CREATE_VENDOR },
  { label: __('Update A Vendor', 'bit-integrations'), value: TASK_LIST_VALUES.UPDATE_VENDOR },
  { label: __('Delete A Vendor', 'bit-integrations'), value: TASK_LIST_VALUES.DELETE_VENDOR },
  { label: __('Request A Withdraw', 'bit-integrations'), value: TASK_LIST_VALUES.WITHDRAW_REQUEST },
  {
    label: __('Request A Refund (Dokan pro feature)', 'bit-integrations'),
    value: TASK_LIST_VALUES.REFUND_REQUEST
  }
]
