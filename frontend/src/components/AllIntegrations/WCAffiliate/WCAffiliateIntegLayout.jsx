import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import WCAffiliateFieldMap from './WCAffiliateFieldMap'
import { generateMappedField } from './WCAffiliateCommonFunc'
import {
  affiliateStatusOptions,
  commissionTypeOptions,
  createAffiliateFields,
  referralStatusOptions,
  referralTypeOptions,
  createReferralFields,
  transactionPaymentMethodOptions,
  transactionStatusOptions,
  createTransactionFields,
  modules,
  updateAffiliateStatusFields,
  updateReferralStatusFields,
  updateTransactionStatusFields
} from './staticData'
import Note from '../../Utilities/Note'

const getFieldsByAction = action => {
  switch (action) {
    case 'create_affiliate':
      return createAffiliateFields
    case 'update_affiliate_status':
      return updateAffiliateStatusFields
    case 'create_referral':
      return createReferralFields
    case 'update_referral_status':
      return updateReferralStatusFields
    case 'create_transaction':
      return createTransactionFields
    case 'update_transaction_status':
      return updateTransactionStatusFields
    default:
      return []
  }
}

const getDefaultFixedFieldValues = action => {
  switch (action) {
    case 'create_affiliate':
      return {
        status: 'pending',
        commission_type: 'default'
      }
    case 'update_affiliate_status':
      return { status: 'pending' }
    case 'create_referral':
      return {
        type: 'sale',
        payment_status: 'pending'
      }
    case 'update_referral_status':
      return { status: 'pending' }
    case 'create_transaction':
      return {
        payment_method: 'manual',
        status: 'pending'
      }
    case 'update_transaction_status':
      return { status: 'pending' }
    default:
      return {}
  }
}

const fixedFieldOptionsByAction = {
  create_affiliate: [
    {
      key: 'status',
      label: __('Affiliate Status', 'bit-integrations'),
      options: affiliateStatusOptions
    },
    {
      key: 'commission_type',
      label: __('Commission Type', 'bit-integrations'),
      options: commissionTypeOptions
    }
  ],
  update_affiliate_status: [
    {
      key: 'status',
      label: __('New Status', 'bit-integrations'),
      options: affiliateStatusOptions
    }
  ],
  create_referral: [
    {
      key: 'type',
      label: __('Referral Type', 'bit-integrations'),
      options: referralTypeOptions
    },
    {
      key: 'payment_status',
      label: __('Payment Status', 'bit-integrations'),
      options: referralStatusOptions
    }
  ],
  update_referral_status: [
    {
      key: 'status',
      label: __('New Status', 'bit-integrations'),
      options: referralStatusOptions
    }
  ],
  create_transaction: [
    {
      key: 'payment_method',
      label: __('Payment Method', 'bit-integrations'),
      options: transactionPaymentMethodOptions
    },
    {
      key: 'status',
      label: __('Transaction Status', 'bit-integrations'),
      options: transactionStatusOptions
    }
  ],
  update_transaction_status: [
    {
      key: 'status',
      label: __('New Status', 'bit-integrations'),
      options: transactionStatusOptions
    }
  ]
}

export default function WCAffiliateIntegLayout({ formFields, wcAffiliateConf, setWCAffiliateConf }) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

  const handleMainAction = value => {
    const wcAffiliateFields = getFieldsByAction(value)
    const fixedFieldValues = getDefaultFixedFieldValues(value)

    setWCAffiliateConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value
        draftConf.wcAffiliateFields = wcAffiliateFields
        draftConf.fixedFieldValues = fixedFieldValues
        draftConf.field_map = generateMappedField(wcAffiliateFields)
      })
    )
  }

  const handleFixedFieldValue = (fieldKey, value) => {
    setWCAffiliateConf(prevConf =>
      create(prevConf, draftConf => {
        if (!draftConf.fixedFieldValues) {
          draftConf.fixedFieldValues = {}
        }

        draftConf.fixedFieldValues[fieldKey] = value
      })
    )
  }

  const fixedFieldOptions = fixedFieldOptionsByAction[wcAffiliateConf?.mainAction] || []

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={wcAffiliateConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {fixedFieldOptions.length > 0 &&
        fixedFieldOptions.map(({ key, label, options }) => (
          <div className="flx mt-3" key={`${wcAffiliateConf?.mainAction}-${key}`}>
            <b className="wdt-200 d-in-b">{`${label}:`}</b>
            <MultiSelect
              key={`${wcAffiliateConf?.mainAction}-${key}-select`}
              title={key}
              defaultValue={
                wcAffiliateConf?.fixedFieldValues?.[key] ??
                getDefaultFixedFieldValues(wcAffiliateConf?.mainAction)?.[key]
              }
              className="mt-2 w-5"
              onChange={value => handleFixedFieldValue(key, value)}
              options={options}
              singleSelect
              closeOnSelect
            />
          </div>
        ))}

      {wcAffiliateConf?.mainAction && wcAffiliateConf?.wcAffiliateFields?.length > 0 && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('WC Affiliate Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {wcAffiliateConf?.field_map?.map((itm, i) => (
            <WCAffiliateFieldMap
              key={`wc-aff-map-${i + 1}`}
              i={i}
              field={itm}
              wcAffiliateConf={wcAffiliateConf}
              formFields={formFields}
              setWCAffiliateConf={setWCAffiliateConf}
            />
          ))}

          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(wcAffiliateConf.field_map.length, wcAffiliateConf, setWCAffiliateConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </div>
      )}
    </>
  )
}
