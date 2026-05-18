import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import Note from '../../Utilities/Note'
import { generateMappedField } from './WpDataTablesCommonFunc'
import WpDataTablesFieldMap from './WpDataTablesFieldMap'
import { AddRowFields, modules } from './staticData'

export default function WpDataTablesIntegLayout({
  formFields,
  wpDataTablesConf,
  setWpDataTablesConf,
  isLoading
}) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

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
            draftConf.module_note = ''
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
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

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

          {<Note note={note} />}
        </div>
      )}
    </>
  )
}

const note = `<p>${__(
  'Row Data must be a JSON object where keys are column index and values are the corresponding cell values',
  'bit-integrations'
)}. <br/><br/> ${__('Example', 'bit-integrations')}: <b>{"0": "value1", "1": "value2"}</b></p>`