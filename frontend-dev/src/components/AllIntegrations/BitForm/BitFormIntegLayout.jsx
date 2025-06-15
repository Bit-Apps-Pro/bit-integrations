import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { fetchAllForm } from './BitFormCommonFunc'
import BitFormFieldMap from './BitFormFieldMap'

export default function BitFormIntegLayout({ formFields, handleInput, bitFormConf, setBitFormConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Forms:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="id" value={bitFormConf.id} className="btcd-paper-inp w-5">
        <option value="">{__('Select Form', 'bit-integrations')}</option>
        {
          // eslint-disable-next-line camelcase
          bitFormConf?.default?.forms && bitFormConf.default.forms.map(({ id, form_name }) => (
            <option key={id} value={id}>
              {form_name}
            </option>
          ))
        }
      </select>
      <button onClick={() => fetchAllForm(bitFormConf, setBitFormConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Form', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />

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

      {bitFormConf?.id && bitFormConf.default?.fields
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Bit Form Fields', 'bit-integrations')}</b></div>
            </div>

            {bitFormConf?.id && bitFormConf?.field_map.map((itm, i) => (
              <BitFormFieldMap
                key={`sheet-m-${i + 9}`}
                i={i}
                field={itm}
                formFields={formFields}
                bitFormConf={bitFormConf}
                setBitFormConf={setBitFormConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(bitFormConf.field_map.length, bitFormConf, setBitFormConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
          </>
        )}

      <br />
      <br />

    </>
  )
}
