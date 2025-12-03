import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import {
  generateMappedField,
  refreshMailerPressLists,
  refreshMailerPressTags
} from './MailerPressCommonFunc'
import MailerPressFieldMap from './MailerPressFieldMap'
import { ContactFields, emailField, modules } from './staticData'

export default function MailerPressIntegLayout({
  formID,
  formFields,
  mailerPressConf,
  setMailerPressConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleChange = (value, name) => {
    setMailerPressConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = value
      })
    )
  }

  const handleMainAction = value => {
    setMailerPressConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        draftConf.mailerPressFields = value === 'create_or_update_contact' ? ContactFields : emailField
        draftConf.field_map = generateMappedField(draftConf.mailerPressFields)
      })
    )

    if (['create_or_update_contact', 'add_tags', 'remove_tags'].includes(value)) {
      refreshMailerPressTags(setMailerPressConf, setIsLoading, setSnackbar)
    }

    if (['create_or_update_contact', 'add_to_lists', 'remove_from_lists'].includes(value)) {
      refreshMailerPressLists(setMailerPressConf, setIsLoading, setSnackbar)
    }
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={mailerPressConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value, 'module')}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>
      {['create_or_update_contact', 'add_to_lists', 'remove_from_lists'].includes(
        mailerPressConf?.mainAction
      ) && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Lists:', 'bit-integrations')}</b>
            <MultiSelect
              title="lists"
              defaultValue={mailerPressConf?.lists}
              className="btcd-paper-drpdwn w-5"
              options={
                mailerPressConf?.allLists &&
                Array.isArray(mailerPressConf.allLists) &&
                mailerPressConf.allLists.map(list => ({
                  label: list?.listName,
                  value: list?.listId?.toString()
                }))
              }
              onChange={val => handleChange(val, 'lists')}
            />
            <button
              onClick={() => refreshMailerPressLists(setMailerPressConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh MailerPress Lists', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {['create_or_update_contact', 'add_tags', 'remove_tags'].includes(mailerPressConf?.mainAction) && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Tags:', 'bit-integrations')}</b>
            <MultiSelect
              title="tags"
              defaultValue={mailerPressConf?.tags}
              className="btcd-paper-drpdwn w-5"
              options={
                mailerPressConf?.allTags &&
                Array.isArray(mailerPressConf.allTags) &&
                mailerPressConf.allTags.map(tag => ({
                  label: tag?.tagName,
                  value: tag?.tagId?.toString()
                }))
              }
              onChange={val => handleChange(val, 'tags')}
            />
            <button
              onClick={() => refreshMailerPressTags(setMailerPressConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh MailerPress Tags', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

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

      {mailerPressConf?.mainAction && mailerPressConf?.mailerPressFields && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('MailerPress Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {mailerPressConf?.field_map.map((itm, i) => (
            <MailerPressFieldMap
              key={`mailerpress-m-${i + 9}`}
              i={i}
              field={itm}
              mailerPressConf={mailerPressConf}
              formFields={formFields}
              setMailerPressConf={setMailerPressConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(mailerPressConf.field_map.length, mailerPressConf, setMailerPressConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
        </>
      )}
    </>
  )
}
