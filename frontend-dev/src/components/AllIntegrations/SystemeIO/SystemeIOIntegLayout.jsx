/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getAllTags } from './SystemeIOCommonFunc'
import SystemeIOFieldMap from './SystemeIOFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function SystemeIOIntegLayout({ formFields, systemeIOConf, setSystemeIOConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const setChanges = (val, name) => {

    setSystemeIOConf(prevConf => {
      const newConf = { ...prevConf }
      newConf[name] = val

      return newConf
    })
  }

  return (
    <>
      {(isLoading || loading.tag || loading.session) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      {systemeIOConf.actionName && !loading.tag
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Tag:', 'bit-integrations')}</b>
              <MultiSelect
                options={systemeIOConf?.tags && systemeIOConf.tags.map(tag => ({ label: tag.name, value: `${tag.id}` }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={systemeIOConf?.selectedTag}
                onChange={val => setChanges(val, 'selectedTag')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllTags(systemeIOConf, setSystemeIOConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Tags', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.tag}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {systemeIOConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('SystemeIO Fields', 'bit-integrations')}</b></div>
          </div>

          {systemeIOConf?.field_map.map((itm, i) => (
            <SystemeIOFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              systemeIOConf={systemeIOConf}
              formFields={formFields}
              setSystemeIOConf={setSystemeIOConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(systemeIOConf.field_map.length, systemeIOConf, setSystemeIOConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
        </div>

      )}
    </>
  )
}

