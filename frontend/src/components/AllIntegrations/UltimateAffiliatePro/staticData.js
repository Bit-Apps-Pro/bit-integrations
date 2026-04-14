import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  { name: 'create_affiliate', label: __('Create Affiliate', 'bit-integrations'), is_pro: true },
  { name: 'create_referral', label: __('Create Referral', 'bit-integrations'), is_pro: true },
  { name: 'insert_payment', label: __('Insert Payment', 'bit-integrations'), is_pro: true },
  {
    name: 'change_transaction_status',
    label: __('Change Transaction Status', 'bit-integrations'),
    is_pro: true
  }
]

export const createAffiliateFields = [
  { key: 'user_identifier', label: __('User Identifier', 'bit-integrations'), required: true }
]

export const createReferralFields = [
  { key: 'affiliate_id', label: __('Affiliate ID', 'bit-integrations'), required: true },
  { key: 'referred_user', label: __('Referred User', 'bit-integrations'), required: false },
  { key: 'amount', label: __('Amount', 'bit-integrations'), required: true },
  { key: 'source', label: __('Source', 'bit-integrations'), required: true },
  { key: 'reference', label: __('Reference', 'bit-integrations'), required: true },
  { key: 'campaign', label: __('Campaign', 'bit-integrations'), required: false },
  { key: 'description', label: __('Description', 'bit-integrations'), required: false },
  {
    key: 'reference_details',
    label: __('Reference Details', 'bit-integrations'),
    required: false
  },
  { key: 'currency', label: __('Currency', 'bit-integrations'), required: false },
  { key: 'status', label: __('Referral Status', 'bit-integrations'), required: false },
  { key: 'payment_status', label: __('Payment Status', 'bit-integrations'), required: false },
  { key: 'visit_id', label: __('Visit ID', 'bit-integrations'), required: false },
  {
    key: 'parent_referral_id',
    label: __('Parent Referral ID', 'bit-integrations'),
    required: false
  },
  {
    key: 'child_referral_id',
    label: __('Child Referral ID', 'bit-integrations'),
    required: false
  }
]

export const insertPaymentFields = [
  { key: 'affiliate_id', label: __('Affiliate ID', 'bit-integrations'), required: true },
  { key: 'amount', label: __('Amount', 'bit-integrations'), required: true },
  { key: 'payment_type', label: __('Payment Type', 'bit-integrations'), required: false },
  { key: 'transaction_id', label: __('Transaction ID', 'bit-integrations'), required: false },
  { key: 'referral_ids', label: __('Referral IDs', 'bit-integrations'), required: false },
  { key: 'currency', label: __('Currency', 'bit-integrations'), required: false },
  { key: 'status', label: __('Status', 'bit-integrations'), required: false }
]

export const changeTransactionStatusFields = [
  { key: 'payment_id', label: __('Payment ID', 'bit-integrations'), required: true },
  { key: 'status', label: __('Status', 'bit-integrations'), required: true }
]

export const actionToFields = {
  create_affiliate: createAffiliateFields,
  create_referral: createReferralFields,
  insert_payment: insertPaymentFields,
  change_transaction_status: changeTransactionStatusFields
}
