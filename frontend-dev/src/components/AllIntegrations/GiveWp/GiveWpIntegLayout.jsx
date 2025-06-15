import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { } from './GiveWpCommonFunc'
import GiveWpFieldMap from './GiveWpFieldMap'

export default function GiveWpIntegLayout({ formFields, handleInput, giveWpConf, setGiveWpConf, isLoading, setIsLoading, setSnackbar, allIntegURL, isInfo, edit }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="mainAction" value={giveWpConf?.mainAction} className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {
          giveWpConf?.allActions && giveWpConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <br />
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

      <>
        {['1'].includes(giveWpConf?.mainAction) && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('GiveWp Fields', 'bit-integrations')}</b></div>
            </div>
            {giveWpConf.field_map.map((itm, i) => (
              <GiveWpFieldMap
                key={`dash-m-${i + 9}`}
                i={i}
                field={itm}
                giveWpConf={giveWpConf}
                formFields={formFields}
                setGiveWpConf={setGiveWpConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(giveWpConf.field_map.length, giveWpConf, setGiveWpConf)} className="icn-btn sh-sm" type="button">+</button></div>
          </>
        )}

      </>
      <br />
    </>
  )
}
