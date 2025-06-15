/* eslint-disable no-unused-vars */
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import GravitecActions from './GravitecActions'
import GravitecFieldMap from './GravitecFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function GravitecIntegLayout({ formFields, gravitecConf, setGravitecConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...gravitecConf }
    const { name } = e.target

    if (e.target.value !== '') {
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }
    setGravitecConf(newConf)
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={gravitecConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="notification" data-action_name="notification">{__('Push Notification', 'bit-integrations')}</option>
      </select>

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
      {gravitecConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Gravitec Fields', 'bit-integrations')}</b></div>
          </div>

          {gravitecConf?.field_map.map((itm, i) => (
            <GravitecFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              gravitecConf={gravitecConf}
              formFields={formFields}
              setGravitecConf={setGravitecConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(gravitecConf.field_map.length, gravitecConf, setGravitecConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <GravitecActions
            gravitecConf={gravitecConf}
            setGravitecConf={setGravitecConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

