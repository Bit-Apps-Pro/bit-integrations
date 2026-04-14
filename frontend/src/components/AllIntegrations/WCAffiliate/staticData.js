import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  { name: 'create_affiliate', label: __('Create Affiliate', 'bit-integrations'), is_pro: true },
  {
    name: 'update_affiliate_status',
    label: __('Update Affiliate Status', 'bit-integrations'),
    is_pro: true
  },
  { name: 'create_referral', label: __('Create Referral', 'bit-integrations'), is_pro: true },
  {
    name: 'update_referral_status',
    label: __('Update Referral Status', 'bit-integrations'),
    is_pro: true
  },
  { name: 'create_transaction', label: __('Create Transaction', 'bit-integrations'), is_pro: true },
  {
    name: 'update_transaction_status',
    label: __('Update Transaction Status', 'bit-integrations'),
    is_pro: true
  }
]

export const affiliateStatusOptions = [
  { label: __('Pending', 'bit-integrations'), value: 'pending' },
  { label: __('Active', 'bit-integrations'), value: 'active' },
  { label: __('Rejected', 'bit-integrations'), value: 'rejected' },
  { label: __('Suspended', 'bit-integrations'), value: 'suspended' }
]

export const commissionTypeOptions = [
  { label: __('Default', 'bit-integrations'), value: 'default' },
  { label: __('Fixed', 'bit-integrations'), value: 'fixed' },
  { label: __('Percent', 'bit-integrations'), value: 'percent' }
]

export const referralTypeOptions = [{ label: __('Sale', 'bit-integrations'), value: 'sale' }]

export const referralStatusOptions = [
  { label: __('Pending', 'bit-integrations'), value: 'pending' },
  { label: __('Approved', 'bit-integrations'), value: 'approved' },
  { label: __('Paid', 'bit-integrations'), value: 'paid' },
  { label: __('Rejected', 'bit-integrations'), value: 'rejected' },
  { label: __('Cancelled', 'bit-integrations'), value: 'cancelled' }
]

export const transactionStatusOptions = [
  { label: __('Pending', 'bit-integrations'), value: 'pending' },
  { label: __('Processing', 'bit-integrations'), value: 'processing' },
  { label: __('Completed', 'bit-integrations'), value: 'completed' },
  { label: __('Failed', 'bit-integrations'), value: 'failed' },
  { label: __('Cancelled', 'bit-integrations'), value: 'cancelled' }
]

export const transactionPaymentMethodOptions = [
  { label: __('Manual', 'bit-integrations'), value: 'manual' }
]

export const createAffiliateFields = [
  { key: 'user_id', label: __('User ID', 'bit-integrations'), required: true },
  { key: 'commission_amount', label: __('Commission Amount', 'bit-integrations'), required: false }
]

export const updateAffiliateStatusFields = [
  { key: 'affiliate_id', label: __('Affiliate ID', 'bit-integrations'), required: true },
  { key: 'admin_message', label: __('Admin Message', 'bit-integrations'), required: false }
]

export const createReferralFields = [
  { key: 'affiliate_id', label: __('Affiliate ID', 'bit-integrations'), required: true },
  { key: 'commission', label: __('Commission', 'bit-integrations'), required: true },
  { key: 'order_total', label: __('Order Total', 'bit-integrations'), required: true },
  { key: 'order_id', label: __('Order ID', 'bit-integrations'), required: false },
  { key: 'visit', label: __('Visit', 'bit-integrations'), required: false },
  { key: 'transaction_id', label: __('Transaction ID', 'bit-integrations'), required: false },
  { key: 'time', label: __('Time', 'bit-integrations'), required: false },
  { key: 'products', label: __('Products', 'bit-integrations'), required: false }
]

export const updateReferralStatusFields = [
  { key: 'referral_id', label: __('Referral ID', 'bit-integrations'), required: true }
]

export const createTransactionFields = [
  { key: 'affiliate_id', label: __('Affiliate ID', 'bit-integrations'), required: true },
  { key: 'amount', label: __('Amount', 'bit-integrations'), required: true },
  { key: 'txn_id', label: __('External Transaction ID', 'bit-integrations'), required: false },
  { key: 'notes', label: __('Notes', 'bit-integrations'), required: false }
]

export const updateTransactionStatusFields = [
  { key: 'transaction_id', label: __('Transaction ID', 'bit-integrations'), required: true },
  { key: 'txn_id', label: __('External Transaction ID', 'bit-integrations'), required: false }
]
