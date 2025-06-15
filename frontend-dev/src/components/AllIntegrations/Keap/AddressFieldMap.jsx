import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'

import { delAddressFieldMap, handleAddress } from '../IntegrationHelpers/MailChimpIntegrationHelpers'

export default function AddressFieldMap({ i, formFields, field, sheetConf, setSheetConf, addressField }) {
  const isRequired = field.required
  const address = addressField.filter((addr => !addr.required))
  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleAddress(ev, i, sheetConf, setSheetConf)}>
        <option value="">{__('Select Field', 'bit-integrations')}</option>
        {
          formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)
        }
      </select>
      <select className="btcd-paper-inp" name="mailChimpAddressField" value={field.mailChimpAddressField || ''} onChange={(ev) => handleAddress(ev, i, sheetConf, setSheetConf, addressField)} disabled={isRequired}>
        <option value="">{__('Select Field', 'bit-integrations')}</option>
        {isRequired
          ? Object.values(addressField).map((listField, indx) => (
            <option key={`add-${indx * 2}`} value={listField.tag}>
              {listField.name}
            </option>
          ))
          : Object.values(address).map((listField, indx) => (
            <option key={`add-${indx * 2}`} value={listField.tag}>
              {listField.name}
            </option>
          ))}
      </select>
      {!isRequired && (
        <button onClick={() => delAddressFieldMap(i, sheetConf, setSheetConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
          <TrashIcn />
        </button>
      )}
    </div>
  )
}
