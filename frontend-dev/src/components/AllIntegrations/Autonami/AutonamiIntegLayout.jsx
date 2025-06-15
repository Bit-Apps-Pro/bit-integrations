// eslint-disable-next-line import/no-extraneous-dependencies
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import AutonamiActions from './AutonamiActions'
import { refreshAutonamiListsAndTags, getAutonamiFields } from './AutonamiCommonFunc'
import AutonamiFieldMap from './AutonamiFieldMap'

export default function AutonamiIntegLayout({ formID, formFields, autonamiConf, setAutonamiConf, isLoading, setIsLoading, setSnackbar }) {
  const setTags = (val) => {
    const newConf = { ...autonamiConf }
    newConf.tags = val ? val.split(',') : []
    setAutonamiConf({ ...newConf })
  }
  const setLists = (val) => {
    const newConf = { ...autonamiConf }
    newConf.lists = val ? val.split(',') : []
    setAutonamiConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Autonami Lists:', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={autonamiConf?.lists}
          className="btcd-paper-drpdwn w-5"
          options={autonamiConf?.default?.autonamiList && Object.keys(autonamiConf.default.autonamiList).map(list => ({ label: autonamiConf.default.autonamiList[list].title, value: autonamiConf.default.autonamiList[list].id.toString() }))}
          onChange={val => setLists(val)}
        />
        <button onClick={() => refreshAutonamiListsAndTags(autonamiConf, setAutonamiConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Autonami Lists And Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <div className="flx mt-5">
        <b className="wdt-200 d-in-b">{__('Autonami Tags: ', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={autonamiConf?.tags}
          className="btcd-paper-drpdwn w-5"
          options={autonamiConf?.default?.autonamiTags && Object.keys(autonamiConf.default.autonamiTags).map(tag => ({ label: autonamiConf.default.autonamiTags[tag].title, value: autonamiConf.default.autonamiTags[tag].id.toString() }))}
          onChange={val => setTags(val)}
        />
      </div>
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
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => getAutonamiFields(autonamiConf, setAutonamiConf, setIsLoading, setSnackbar, true)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Autonami Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Autonami Fields', 'bit-integrations')}</b></div>
      </div>

      {autonamiConf.field_map.map((itm, i) => (
        <AutonamiFieldMap
          key={`autonami-m-${i + 9}`}
          i={i}
          field={itm}
          autonamiConf={autonamiConf}
          formFields={formFields}
          setAutonamiConf={setAutonamiConf}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2">
        <button onClick={() => addFieldMap(autonamiConf.field_map.length, autonamiConf, setAutonamiConf)} className="icn-btn sh-sm" type="button">+</button>
      </div>
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <AutonamiActions
        autonamiConf={autonamiConf}
        setAutonamiConf={setAutonamiConf}
      />
    </>
  )
}
