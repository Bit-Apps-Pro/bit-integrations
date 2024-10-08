import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentSupportActions from './FluentSupportActions'
import { getCustomFields } from './FluentSupportCommonFunc'
import FluentSupportFieldMap from './FluentSupportFieldMap'

export default function FluentSupportIntegLayout({
  formID,
  formFields,
  handleInput,
  fluentSupportConf,
  setFluentSupportConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  return (
    <>
      <br />
      <br />
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

      {!isLoading && fluentSupportConf.field_map && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            <button
              onClick={() =>
                getCustomFields(fluentSupportConf, setFluentSupportConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh Custom Ticket Fields', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('fluentSupport Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {fluentSupportConf.field_map.map((itm, i) => (
            <FluentSupportFieldMap
              key={`desk-m-${i + 9}`}
              i={i}
              field={itm}
              fluentSupportConf={fluentSupportConf}
              formFields={formFields}
              setFluentSupportConf={setFluentSupportConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(
                  fluentSupportConf.field_map.length,
                  fluentSupportConf,
                  setFluentSupportConf
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />

          <FluentSupportActions
            fluentSupportConf={fluentSupportConf}
            setFluentSupportConf={setFluentSupportConf}
            formID={formID}
            formFields={formFields}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
