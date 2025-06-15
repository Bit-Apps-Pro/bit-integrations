import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import KeapActions from './KeapActions'
import KeapFieldMap from './KeapFieldMap'
import { addFieldMap } from './KeapIntegrationHelpers'

export default function KeapIntegLayout({ formID, formFields, handleInput, keapConf, setKeapConf, isLoading, setIsLoading, setSnackbar, a }) {
  const setTags = (val) => {
    const newConf = { ...keapConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setKeapConf({ ...newConf })
  }

  return (
    <>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <>
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        </div>
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
          <div className="txt-dp"><b>{__('Keap Fields', 'bit-integrations')}</b></div>
        </div>

        {keapConf.field_map.map((itm, i) => (
          <KeapFieldMap
            key={`keap-m-${i + 9}`}
            i={i}
            field={itm}
            keapConf={keapConf}
            formFields={formFields}
            setKeapConf={setKeapConf}
          />
        ))}
        <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(keapConf.field_map.length, keapConf, setKeapConf)} className="icn-btn sh-sm" type="button">+</button></div>
        <br />
        <br />
        <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
        <div className="btcd-hr mt-1" />
        <KeapActions
          keapConf={keapConf}
          setKeapConf={setKeapConf}
          formFields={formFields}
          loading={isLoading}
          setLoading={setIsLoading}
        />
        {/* {keapConf.actions?.address && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Address Field Map', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Address Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Mail Chimp Address Fields', 'bit-integrations')}</b></div>
            </div>
            {keapConf?.address_field?.map((itm, i) => (
              <AddressFieldMap
                key={`sheet-m-${i + 9}`}
                i={i}
                field={itm}
                keapConf={keapConf}
                formFields={formFields}
                setKeapConf={setKeapConf}
                addressField={address}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addAddressFieldMap(keapConf.address_field.length, keapConf, setKeapConf)} className="icn-btn sh-sm" type="button">+</button></div>
          </>
        )} */}
        <br />
        <br />
      </>

    </>
  )
}
