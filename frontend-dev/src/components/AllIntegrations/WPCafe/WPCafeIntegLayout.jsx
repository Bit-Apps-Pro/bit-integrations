import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './WPCafeCommonFunc'
import WPCafeFieldMap from './WPCafeFieldMap'
import { modules, ReservationFields, ReservationIdField, UpdateReservationFields } from './staticData'

export default function WPCafeIntegLayout({
  formID,
  formFields,
  wpcafeConf,
  setWpcafeConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setWpcafeConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        switch (value) {
          case 'create_reservation':
            draftConf.wpcafeFields = ReservationFields
            break
          case 'update_reservation':
            draftConf.wpcafeFields = UpdateReservationFields
            break
          case 'delete_reservation':
            draftConf.wpcafeFields = ReservationIdField
            break
          default:
            draftConf.wpcafeFields = []
        }

        draftConf.field_map = generateMappedField(draftConf.wpcafeFields)
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
          defaultValue={wpcafeConf?.mainAction ?? null}
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

      {wpcafeConf?.mainAction && wpcafeConf.wpcafeFields && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('WPCafe Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {wpcafeConf?.field_map?.map((itm, i) => (
            <WPCafeFieldMap
              key={`wpcafe-m-${i + 9}`}
              i={i}
              field={itm}
              wpcafeConf={wpcafeConf}
              formFields={formFields}
              setWpcafeConf={setWpcafeConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => addFieldMap(wpcafeConf.field_map.length, wpcafeConf, setWpcafeConf)}
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
