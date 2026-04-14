import { create } from 'mutative'
import { __, sprintf } from '../../../Utils/i18nwrap'

export const handleInput = (e, wcAffiliateConf, setWCAffiliateConf) => {
  const { name, value } = e.target

  setWCAffiliateConf(prevConf =>
    create(prevConf, draftConf => {
      draftConf[name] = value
    })
  )
}

export const checkMappedFields = wcAffiliateConf => {
  const mappedFields = wcAffiliateConf?.field_map
    ? wcAffiliateConf.field_map.filter(
        mappedField =>
          !mappedField.formField ||
          !mappedField.wcAffiliateField ||
          (mappedField.formField === 'custom' && !mappedField.customValue)
      )
    : []

  return mappedFields.length === 0
}

const fixedRequiredFieldsByAction = {
  create_affiliate: ['status', 'commission_type'],
  update_affiliate_status: ['status'],
  create_referral: ['type', 'payment_status'],
  update_referral_status: ['status'],
  create_transaction: ['payment_method', 'status'],
  update_transaction_status: ['status']
}

const fixedFieldLabelMap = {
  status: __('Status', 'bit-integrations'),
  commission_type: __('Commission Type', 'bit-integrations'),
  type: __('Referral Type', 'bit-integrations'),
  payment_status: __('Payment Status', 'bit-integrations'),
  payment_method: __('Payment Method', 'bit-integrations')
}

export const validateRequiredFields = wcAffiliateConf => {
  if (!wcAffiliateConf?.mainAction) {
    return {
      isValid: false,
      message: __('Please select an action to continue.', 'bit-integrations')
    }
  }

  const requiredFixedFields = fixedRequiredFieldsByAction[wcAffiliateConf.mainAction] || []
  const fixedFieldValues = wcAffiliateConf?.fixedFieldValues || {}

  const missingFixedField = requiredFixedFields.find(fieldKey => !fixedFieldValues[fieldKey])
  if (missingFixedField) {
    return {
      isValid: false,
      message: sprintf(
        __('Please select %s to continue.', 'bit-integrations'),
        fixedFieldLabelMap[missingFixedField] || missingFixedField
      )
    }
  }

  if (!checkMappedFields(wcAffiliateConf)) {
    return {
      isValid: false,
      message: __('Please map all required fields to continue.', 'bit-integrations')
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

export const generateMappedField = fields => {
  const requiredFlds = fields.filter(fld => fld.required === true)

  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({
        formField: '',
        wcAffiliateField: field.key
      }))
    : [{ formField: '', wcAffiliateField: '' }]
}
