import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './NotificationXCommonFunc'
import NotificationXEntryFieldMap from './NotificationXEntryFieldMap'
import NotificationXFieldMap from './NotificationXFieldMap'
import { NotificationIdField, modules } from './staticData'

export default function NotificationXIntegLayout({
  formID,
  formFields,
  notificationXConf,
  setNotificationXConf,
  isLoading,
  setIsLoading,
  setSnackbar,
}) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setNotificationXConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        switch (value) {
          case 'delete_notification':
          case 'enable_notification':
          case 'disable_notification':
            draftConf.notificationXFields = NotificationIdField
            draftConf.field_map = generateMappedField(NotificationIdField)
            draftConf.entry_map = []
            break
          case 'add_notification_entry':
            draftConf.notificationXFields = NotificationIdField
            draftConf.field_map = generateMappedField(NotificationIdField)
            draftConf.entry_map = draftConf.entry_map?.length
              ? draftConf.entry_map
              : [{ formField: '', entryKey: '' }]
            break
          default:
            draftConf.notificationXFields = []
            draftConf.field_map = []
            draftConf.entry_map = []
        }
      })
    )
  }

  const showFieldMap = notificationXConf?.mainAction && notificationXConf?.notificationXFields
  const isEntryAction = notificationXConf?.mainAction === 'add_notification_entry'

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={notificationXConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: !checkIsPro(isPro, action.is_pro),
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
            transform: 'scale(0.7)',
          }}
        />
      )}

      {showFieldMap && notificationXConf.field_map?.length > 0 && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('NotificationX Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {notificationXConf?.field_map?.map((itm, i) => (
            <NotificationXFieldMap
              key={`nx-m-${i + 9}`}
              i={i}
              field={itm}
              notificationXConf={notificationXConf}
              formFields={formFields}
              setNotificationXConf={setNotificationXConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(notificationXConf.field_map.length, notificationXConf, setNotificationXConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </div>
      )}

      {isEntryAction && (
        <div className="mt-4">
          <b className="wdt-100">{__('Entry Data Mapping', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Entry Key', 'bit-integrations')}</b>
            </div>
          </div>

          {notificationXConf?.entry_map?.map((itm, i) => (
            <NotificationXEntryFieldMap
              key={`nx-entry-${i + 9}`}
              i={i}
              field={itm}
              notificationXConf={notificationXConf}
              formFields={formFields}
              setNotificationXConf={setNotificationXConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => {
                const newConf = { ...notificationXConf }
                newConf.entry_map = [...(newConf.entry_map || []), { formField: '', entryKey: '' }]
                setNotificationXConf(newConf)
              }}
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
        </div>
      )}

      {showFieldMap && !isEntryAction && <br />}
    </>
  )
}
