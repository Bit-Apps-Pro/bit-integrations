import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addContactFieldMap, addFieldMap } from './FreshdeskIntegrationHelpers'
import FreshdeskFieldMap from './FreshdeskFieldMap'
import FreshdeskActions from './FreshdeskActions'
import TableCheckBox from '../../Utilities/TableCheckBox'
import FreshdeskContactFieldMap from './FreshdeskContactFieldMap'

export default function FreshdeskIntegLayout({ formID, formFields, handleInput, freshdeskConf, setFreshdeskConf, isLoading, setIsLoading, setSnackbar, a }) {
  const actionHandler = (e, type) => {
    const newConf = { ...freshdeskConf }
    if (type === 'contactShow') {
      if (e.target?.checked) {
        newConf.contactShow = true
      } else {
        delete newConf.contactShow
      }
    }
    setFreshdeskConf({ ...newConf })
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
          <div className="txt-dp"><b>{__('Freshdesk Fields', 'bit-integrations')}</b></div>
        </div>

        {freshdeskConf.field_map.map((itm, i) => (
          <FreshdeskFieldMap
            key={`keap-m-${i + 9}`}
            i={i}
            field={itm}
            freshdeskConf={freshdeskConf}
            formFields={formFields}
            setFreshdeskConf={setFreshdeskConf}
          />
        ))}
        <br />
        <br />

        <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(freshdeskConf.field_map.length, freshdeskConf, setFreshdeskConf)} className="icn-btn sh-sm" type="button">+</button></div>

        <TableCheckBox checked={freshdeskConf?.contactShow || false} onChange={(e) => actionHandler(e, 'contactShow')} className="wdt-200 mt-4 mr-2" value="priority" title={__('Show contact field', 'bit-integrations')} subTitle={__('if want add more field in contact', 'bit-integrations')} />

        {freshdeskConf.contactShow && freshdeskConf.field_map_contact.map((itm, i) => (
          <FreshdeskContactFieldMap
            key={`keap-m-${i + 9}`}
            i={i}
            field={itm}
            freshdeskConf={freshdeskConf}
            formFields={formFields}
            setFreshdeskConf={setFreshdeskConf}
          />
        ))}
        <br />
        <br />

        {freshdeskConf.contactShow && <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addContactFieldMap(freshdeskConf.field_map_contact.length, freshdeskConf, setFreshdeskConf)} className="icn-btn sh-sm" type="button">+</button></div>}
        <br />
        <br />
        <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
        <div className="btcd-hr mt-1" />
        <FreshdeskActions
          freshdeskConf={freshdeskConf}
          setFreshdeskConf={setFreshdeskConf}
          formFields={formFields}
        />
      </>

    </>
  )
}
