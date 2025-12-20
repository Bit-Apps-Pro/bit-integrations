import { create } from 'mutative'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './FluentCartCommonFunc'
import FluentCartFieldMap from './FluentCartFieldMap'
import {
  CouponFields,
  CouponIdField,
  CustomerFields,
  CustomerIdField,
  CustomerUpdateFields,
  modules,
  OrderFields,
  OrderIdField,
  OrderStatusField,
  OrderUpdateFields,
  PaymentStatusField,
  ProductFields,
  ProductIdField,
  ShippingStatusField
} from './staticData'

export default function FluentCartIntegLayout({
  formID,
  formFields,
  fluentCartConf,
  setFluentCartConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setFluentCartConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        // Set fields based on action type
        switch (value) {
          case 'create_order':
            draftConf.fluentCartFields = OrderFields
            break
          case 'update_order':
            draftConf.fluentCartFields = OrderUpdateFields
            break
          case 'delete_order':
            draftConf.fluentCartFields = OrderIdField
            break
          case 'update_order_status':
            draftConf.fluentCartFields = OrderStatusField
            break
          case 'update_payment_status':
            draftConf.fluentCartFields = PaymentStatusField
            break
          case 'update_shipping_status':
            draftConf.fluentCartFields = ShippingStatusField
            break
          case 'create_customer':
            draftConf.fluentCartFields = CustomerFields
            break
          case 'update_customer':
            draftConf.fluentCartFields = CustomerUpdateFields
            break
          case 'delete_customer':
            draftConf.fluentCartFields = CustomerIdField
            break
          case 'create_product':
            draftConf.fluentCartFields = ProductFields
            break
          case 'delete_product':
            draftConf.fluentCartFields = ProductIdField
            break
          case 'create_coupon':
            draftConf.fluentCartFields = CouponFields
            break
          case 'delete_coupon':
            draftConf.fluentCartFields = CouponIdField
            break
          default:
            draftConf.fluentCartFields = []
        }

        draftConf.field_map = generateMappedField(draftConf.fluentCartFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          className="btcd-paper-inp w-5"
          name="mainAction"
          value={fluentCartConf?.mainAction || ''}
          onChange={e => handleMainAction(e.target.value)}>
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {modules?.map(action => (
            <option
              key={action.name}
              value={action.name}
              disabled={!checkIsPro(isPro, action.is_pro)}>
              {checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label)}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      {fluentCartConf?.mainAction && fluentCartConf.fluentCartFields && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('FluentCart Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {fluentCartConf?.field_map?.map((itm, i) => (
            <FluentCartFieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              field={itm}
              fluentCartConf={fluentCartConf}
              formFields={formFields}
              setFluentCartConf={setFluentCartConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => addFieldMap(fluentCartConf.field_map.length, fluentCartConf, setFluentCartConf)}
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
        </div>
      )}
    </>
  )
}
