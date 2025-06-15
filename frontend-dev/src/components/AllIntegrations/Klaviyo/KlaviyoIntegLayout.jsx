/* eslint-disable default-case */
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../GlobalIntegrationHelper'
import { getAllLists } from './KlaviyoCommonFunc'
import KlaviyoFieldMap from './KlaviyoFieldMap'

function KlaviyoIntegLayout({ klaviyoConf, setKlaviyoConf, formFields, loading, setLoading }) {
  const handleList = (e) => {
    const newConf = { ...klaviyoConf }
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }
    newConf[e.target.name] = e.target.value
    switch (e.target.name) {
      case 'listId':
        newConf.field_map = [{ formField: '', klaviyoFormField: '' }]
        break
    }

    setKlaviyoConf({ ...newConf })
  }

  return (
    <div>
      <b className="wdt-200 d-in-b mt-2">{__('List:', 'bit-integrations')}</b>
      <select name="listId" value={klaviyoConf.listId} onChange={handleList} className="btcd-paper-inp w-5">
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          klaviyoConf?.default?.lists && klaviyoConf.default.lists.map(list => (
            <option key={list.id} value={list.id}>
              {list.attributes.name}
            </option>
          ))
        }
      </select>
      <button onClick={() => getAllLists(klaviyoConf, setKlaviyoConf, loading, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh list"' }} type="button" disabled={loading.list}>&#x21BB;</button>

      {/* When user refresh the List then loader call */}

      {loading.list && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      {klaviyoConf?.listId && (
        <div className="mt-5">
          <b className="wdt-100">
            {__('Field Map', 'bit-integrations')}
          </b>

          <div className="btcd-hr mt-2 mb-4" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Klaviyo Fields', 'bit-integrations')}</b></div>
          </div>
          {klaviyoConf?.field_map.map((itm, i) => (
            <KlaviyoFieldMap
              key={`ko-m-${i + 8}`}
              i={i}
              field={itm}
              formFields={formFields}
              klaviyoConf={klaviyoConf}
              setKlaviyoConf={setKlaviyoConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(klaviyoConf.field_map.length, klaviyoConf, setKlaviyoConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
        </div>
      )}
    </div>
  )
}

export default KlaviyoIntegLayout
