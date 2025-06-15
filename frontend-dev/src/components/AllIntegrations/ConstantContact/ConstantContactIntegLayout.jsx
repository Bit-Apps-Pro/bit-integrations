import { __ } from '../../../Utils/i18nwrap'
import { addAddressFieldMap,
  addFieldMap } from '../IntegrationHelpers/ConstantContactIntegrationHelpers'
import AddressFieldMap from './AddressFieldMap'
import PhoneFieldMap from './PhoneFieldMap'
import ConstantContactFieldMap from './ConstantContactFieldMap'
import ConstantContactActions from './ConstantContactActions'

export default function ConstantContactIntegLayout({ id, formFields,
  handleInput,
  constantContactConf,
  setConstantContactConf,
  isLoading,
  setIsLoading,
  setSnackbar }) {
  const address = [
    { tag: 'street', name: 'Street', required: false },
    { tag: 'city', name: 'City', required: false },
    { tag: 'state', name: 'State', required: false },
    { tag: 'postal_code', name: 'Postal Code', required: false },
    { tag: 'country', name: 'Country', required: false },
  ]

  const phone = [{ tag: 'phone_number', name: 'Phone Number', required: true }]
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Source:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="source_type"
        value={constantContactConf.source_type}
        className="btcd-paper-inp w-5"
      >
        <option value="">{__('Select Source', 'bit-integrations')}</option>
        <option value="Contact">Contact</option>
        {' '}
        <option value="Account">Account</option>
      </select>
      <br />
      <br />
      <br />
      {constantContactConf?.source_type !== '' && (
        <>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('ConstantContact Fields', 'bit-integrations')}</b>
            </div>
          </div>
          {constantContactConf?.field_map.map((itm, i) => (
            <ConstantContactFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              constantContactConf={constantContactConf}
              formFields={formFields}
              setConstantContactConf={setConstantContactConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => addFieldMap(
                constantContactConf.field_map.length,
                constantContactConf,
                setConstantContactConf,
                false,
              )}
              className="icn-btn sh-sm"
              type="button"
            >
              +
            </button>
          </div>
        </>
      )}
      <br />
      <br />
      {constantContactConf?.source_type !== ''
        && constantContactConf.actions?.address
        && constantContactConf.address_type !== '' && (
        <>
          <div className="mt-4">
            <b className="wdt-100">
              {__('Address Field Map', 'bit-integrations')}
            </b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Address Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>
                {__('Constant Contact Address Fields', 'bit-integrations')}
              </b>
            </div>
          </div>
          {constantContactConf?.address_field?.map((itm, i) => (
            <AddressFieldMap
              key={`sheet-m-${i + 9}`}
              i={i}
              field={itm}
              constantContactConf={constantContactConf}
              formFields={formFields}
              setConstantContactConf={setConstantContactConf}
              addressField={address}
            />
          ))}
          {constantContactConf?.address_field.length < 5 && (
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() => addAddressFieldMap(
                  constantContactConf.address_field.length,
                  constantContactConf,
                  setConstantContactConf,
                )}
                className="icn-btn sh-sm"
                type="button"
              >
                +
              </button>
            </div>
          )}
        </>
      )}
      <br />
      <br />
      {' '}
      {constantContactConf?.source_type !== ''
        && constantContactConf.actions?.phone
        && constantContactConf.phone_type !== '' && (
        <>
          <div className="mt-4">
            <b className="wdt-100">
              {__('Phone Field Map', 'bit-integrations')}
            </b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Phone Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Constant Contact Phone Fields', 'bit-integrations')}</b>
            </div>
          </div>
          {constantContactConf?.phone_field?.map((itm, i) => (
            <PhoneFieldMap
              key={`sheet-m-${i + 9}`}
              i={i}
              field={itm}
              constantContactConf={constantContactConf}
              formFields={formFields}
              setConstantContactConf={setConstantContactConf}
              phoneField={phone}
            />
          ))}
        </>
      )}
      <br />
      <br />
      {constantContactConf?.source_type !== '' && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Actions', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <ConstantContactActions
            id={id}
            constantContactConf={constantContactConf}
            setConstantContactConf={setConstantContactConf}
            address={address}
            phone={phone}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </>
      )}
    </>
  )
}
