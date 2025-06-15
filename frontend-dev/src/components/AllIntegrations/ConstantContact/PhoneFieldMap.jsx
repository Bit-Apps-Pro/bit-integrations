import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { delPhoneFieldMap, handlePhone, handlePhoneCustomValue } from '../IntegrationHelpers/ConstantContactIntegrationHelpers'

export default function PhoneFieldMap({ i,
  formFields,
  field,
  constantContactConf,
  setConstantContactConf,
  phoneField }) {
  const isRequired = field.required
  const phone = phoneField.filter((addr) => !addr.required)
  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={(ev) => handlePhone(ev, i, constantContactConf, setConstantContactConf)}
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
              onChange={(e) => handlePhoneCustomValue(
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
            name="constantContactPhoneField"
            value={field.constantContactPhoneField || ''}
            onChange={(ev) => handlePhone(
              ev,
              i,
              constantContactConf,
              setConstantContactConf,
              phoneField,
            )}
            disabled={isRequired}
          >
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {isRequired
              ? Object.values(phoneField).map((listField, indx) => (
                <option key={`add-${indx * 2}`} value={listField.tag}>
                  {listField.name}
                </option>
              ))
              : Object.values(phone).map((listField, indx) => (
                <option key={`add-${indx * 2}`} value={listField.tag}>
                  {listField.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      {!isRequired && (
        <button
          onClick={() => delPhoneFieldMap(i, constantContactConf, setConstantContactConf)}
          className="icn-btn sh-sm ml-1"
          type="button"
          aria-label="btn"
        >
          <TrashIcn />
        </button>
      )}
    </div>
  )
}
