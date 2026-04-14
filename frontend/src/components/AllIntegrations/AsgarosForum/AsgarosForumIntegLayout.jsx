import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Note from '../../Utilities/Note'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField, getActionFields } from './AsgarosForumCommonFunc'
import AsgarosForumFieldMap from './AsgarosForumFieldMap'
import { modules } from './staticData'

export default function AsgarosForumIntegLayout({ formFields, asgarosForumConf, setAsgarosForumConf }) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

  const handleMainAction = value => {
    const actionFields = getActionFields(value)

    setAsgarosForumConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value
        draftConf.asgarosForumFields = actionFields
        draftConf.field_map = generateMappedField(actionFields)
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
          defaultValue={asgarosForumConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: !checkIsPro(isPro, action.is_pro)
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {!!asgarosForumConf?.asgarosForumFields?.length && !!asgarosForumConf?.field_map?.length && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Asgaros Forum Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {asgarosForumConf?.field_map?.map((itm, i) => (
            <AsgarosForumFieldMap
              key={`asgaros-forum-m-${i + 1}`}
              i={i}
              field={itm}
              asgarosForumConf={asgarosForumConf}
              formFields={formFields}
              setAsgarosForumConf={setAsgarosForumConf}
            />
          ))}

          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(asgarosForumConf.field_map.length, asgarosForumConf, setAsgarosForumConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </div>
      )}

      {['create_topic', 'post_reply_in_topic'].includes(asgarosForumConf?.mainAction) && (
        <>
          <br />
          <Note
            note={__(
              'Author ID is optional. If empty, the current logged-in user will be used.',
              'bit-integrations'
            )}
          />
        </>
      )}

      {asgarosForumConf?.mainAction === 'create_forum' && (
        <>
          <br />
          <Note
            note={__(
              'Use a valid parent/category ID. Otherwise, root forum will be created.',
              'bit-integrations'
            )}
          />
        </>
      )}
    </>
  )
}
