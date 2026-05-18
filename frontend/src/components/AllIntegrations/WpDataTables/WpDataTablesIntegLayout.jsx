import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './WpDataTablesCommonFunc'
import WpDataTablesFieldMap from './WpDataTablesFieldMap'
import { AddRowFields, modules } from './staticData'

export default function WpDataTablesIntegLayout({
  formFields,
  wpDataTablesConf,
  setWpDataTablesConf
}) {
  const handleMainAction = value => {
    setWpDataTablesConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        switch (value) {
          case 'add_row':
            draftConf.wpDataTablesFields = AddRowFields
            break
          default:
            draftConf.wpDataTablesFields = []
        }

        draftConf.field_map = generateMappedField(draftConf.wpDataTablesFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={wpDataTablesConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: action.label,
            value: action.value
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {wpDataTablesConf?.mainAction && wpDataTablesConf.wpDataTablesFields && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('wpDataTables Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {wpDataTablesConf?.field_map?.map((itm, i) => (
            <WpDataTablesFieldMap
              key={`wpdatatables-m-${i + 9}`}
              i={i}
              field={itm}
              wpDataTablesConf={wpDataTablesConf}
              formFields={formFields}
              setWpDataTablesConf={setWpDataTablesConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(wpDataTablesConf.field_map.length, wpDataTablesConf, setWpDataTablesConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
        </div>
      )}
    </>
  )
}
