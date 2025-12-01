import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import {
  generateMappedField,
  refreshMailerPressLists,
  refreshMailerPressTags
} from './MailerPressCommonFunc'
import MailerPressFieldMap from './MailerPressFieldMap'
import { create } from 'mutative'
import { ContactFields, emailField } from './staticData'
import { generate } from 'nth-check'

export default function MailerPressIntegLayout({
  formID,
  formFields,
  mailerPressConf,
  setMailerPressConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const handleChange = (val, name) => {
    setMailerPressConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = val
      })
    )
  }

  const handleMainAction = e => {
    const { name, value } = e.target

    setMailerPressConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        if (value === 'createContact') {
          draftConf.mailerPressFields = ContactFields
        } else if (
          ['deleteContact', 'addTags', 'removeTags', 'addToLists', 'removeFromLists'].includes(value)
        ) {
          draftConf.mailerPressFields = emailField
        }

        draftConf.field_map = generateMappedField(draftConf.mailerPressFields)
      })
    )

    if (['createContact', 'addTags', 'removeTags'].includes(value)) {
      refreshMailerPressTags(setMailerPressConf, setIsLoading, setSnackbar)
    }

    if (['createContact', 'addToLists', 'removeFromLists'].includes(value)) {
      refreshMailerPressLists(setMailerPressConf, setIsLoading, setSnackbar)
    }
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          className="btcd-paper-inp w-6"
          name="mainAction"
          value={mailerPressConf?.mainAction ?? null}
          onChange={handleMainAction}>
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          <option value="createContact">{__('Create/Update Contact', 'bit-integrations')}</option>
          <option value="deleteContact">{__('Delete Contact', 'bit-integrations')}</option>
          <option value="addTags">{__('Add Tags to Contact', 'bit-integrations')}</option>
          <option value="removeTags">{__('Remove Tags from Contact', 'bit-integrations')}</option>
          <option value="addToLists">{__('Add Contact to Lists', 'bit-integrations')}</option>
          <option value="removeFromLists">{__('Remove Contact from Lists', 'bit-integrations')}</option>
        </select>
      </div>
      {['createContact', 'addToLists', 'removeFromLists'].includes(mailerPressConf?.mainAction) && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Lists:', 'bit-integrations')}</b>
            <MultiSelect
              defaultValue={mailerPressConf?.lists}
              className="btcd-paper-drpdwn w-6"
              options={
                mailerPressConf?.default?.allLists &&
                Object.keys(mailerPressConf.default.allLists).map(list => ({
                  label: mailerPressConf.default.allLists[list].listName,
                  value: mailerPressConf.default.allLists[list].listId.toString()
                }))
              }
              onChange={val => handleChange(val, 'lists')}
            />
            <button
              onClick={() =>
                refreshMailerPressLists(mailerPressConf, setMailerPressConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh MailerPress Lists', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {['createContact', 'addTags', 'removeTags'].includes(mailerPressConf?.mainAction) && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Tags:', 'bit-integrations')}</b>
            <MultiSelect
              defaultValue={mailerPressConf?.tags}
              className="btcd-paper-drpdwn w-6"
              options={
                mailerPressConf?.default?.allTags &&
                Object.keys(mailerPressConf.default.allTags).map(tag => ({
                  label: mailerPressConf.default.allTags[tag].tagName,
                  value: mailerPressConf.default.allTags[tag].tagId.toString()
                }))
              }
              onChange={val => handleChange(val, 'tags')}
            />
            <button
              onClick={() =>
                refreshMailerPressTags(mailerPressConf, setMailerPressConf, setIsLoading, setSnackbar)
              }
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

      {mailerPressConf.mainAction && mailerPressConf?.mailerPressFields && (
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

          {mailerPressConf.field_map.map((itm, i) => (
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
