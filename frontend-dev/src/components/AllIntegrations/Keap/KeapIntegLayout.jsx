import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import KeapActions from './KeapActions'
import { refreshCustomFields } from './KeapCommonFunc'
import KeapFieldMap from './KeapFieldMap'
import { addFieldMap } from './KeapIntegrationHelpers'

export default function KeapIntegLayout({
  formID,
  formFields,
  handleInput,
  keapConf,
  setKeapConf,
  isLoading,
  setIsLoading,
  setSnackbar,
  a
}) {
  const { id } = useParams()

  const setTags = val => {
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
      <>
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <button
            onClick={() => refreshCustomFields(id, keapConf, setKeapConf, setIsLoading, setSnackbar)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh Lemlist Field', 'bit-integrations')}'` }}
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
            <b>{__('Keap Fields', 'bit-integrations')}</b>
          </div>
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
        <div className="txt-center btcbi-field-map-button mt-2">
          <button
            onClick={() => addFieldMap(keapConf.field_map.length, keapConf, setKeapConf)}
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
        <KeapActions
          keapConf={keapConf}
          setKeapConf={setKeapConf}
          formFields={formFields}
          loading={isLoading}
          setLoading={setIsLoading}
        />
        <br />
        <br />
      </>
    </>
  )
}
