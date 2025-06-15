import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addAddressFieldMap, delAddressFieldMap, handleAddress, handleAddressCustomValue } from '../IntegrationHelpers/ConstantContactIntegrationHelpers'

export default function AddressFieldMap({ i, formFields, field, constantContactConf, setConstantContactConf, addressField }) {
  const isRequired = field.required
  const address = addressField.filter((addr) => !addr.required)
  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={(ev) => handleAddress(ev, i, constantContactConf, setConstantContactConf)}
          >
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {formFields.map(
              (f) => f.type !== 'file' && (
                <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ),
            )}
            <option value="custom">
              {__('Custom...', 'bit-integrations')}
            </option>
          </select>
          {field.formField === 'custom' && (
            <MtInput
              onChange={(e) => handleAddressCustomValue(
                e,
                i,
                constantContactConf,
                setConstantContactConf,
              )}
              label={__('Custom Value', 'bit-integrations')}
              className="mr-2"
              type="text"
              value={field.customValue}
              placeholder={__('Custom Value', 'bit-integrations')}
            />
          )}
          <select
            className="btcd-paper-inp"
            name="constantContactAddressField"
            value={field.constantContactAddressField || ''}
            onChange={(ev) => handleAddress(
              ev,
              i,
              constantContactConf,
              setConstantContactConf,
              addressField,
            )}
            disabled={isRequired}
          >
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
        </div>
      </div>
      {!isRequired && (
        <>
          {constantContactConf?.address_field.length < 5 && (
            <button
              onClick={() => addAddressFieldMap(
                i,
                constantContactConf,
                setConstantContactConf,
              )}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
          )}
          <button
            onClick={() => delAddressFieldMap(i, constantContactConf, setConstantContactConf)}
            className="icn-btn sh-sm ml-1"
            type="button"
            aria-label="btn"
          >
            <span className="btcd-icn icn-trash-2" />
          </button>
        </>
      )}
    </div>
  )
}
