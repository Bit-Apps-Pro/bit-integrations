import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './SureCartIntegrationHelpers'
import SureCartFieldMap from './SureCartFieldMap'

export default function SureCartIntegLayout({ formID, formFields, handleInput, sureCartConf, setSureCartConf, isLoading, setIsLoading, setSnackbar, a }) {
  const inputHandler = (e) => {
    const newConf = { ...sureCartConf }
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }

    newConf[e.target.name] = e.target.value
    setSureCartConf({ ...newConf })
  }

  const changeHandler = (val, name) => {
    const newConf = { ...sureCartConf }
    if (name === 'listId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }

    setSureCartConf({ ...newConf })
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
        <br />
        <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
        <select onChange={inputHandler} name="mainAction" value={sureCartConf?.mainAction} className="btcd-paper-inp w-5">
          <option value="">{__('Select Actions', 'bit-integrations')}</option>
          {
            sureCartConf?.allActions && sureCartConf.allActions.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))
          }
        </select>
        <br />
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        </div>
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
          <div className="txt-dp"><b>{__('SureCart Fields', 'bit-integrations')}</b></div>
        </div>

        {sureCartConf.field_map.map((itm, i) => (
          <SureCartFieldMap
            key={`keap-m-${i + 9}`}
            i={i}
            field={itm}
            formFields={formFields}
            sureCartConf={sureCartConf}
            setSureCartConf={setSureCartConf}
          />
        ))}
        <br />
        <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(sureCartConf.field_map.length, sureCartConf, setSureCartConf)} className="icn-btn sh-sm" type="button">+</button></div>
      </>

    </>
  )
}
