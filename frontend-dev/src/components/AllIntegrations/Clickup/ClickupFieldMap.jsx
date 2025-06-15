/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './ClickupCommonFunc'
import CustomField from './CustomField'

export default function ClickupFieldMap({ i, formFields, field, clickupConf, setClickupConf }) {
  let allFields = []
  let newFields = []
  if (clickupConf.actionName === 'task') {
    allFields = clickupConf?.taskFields
  }
  // newFields = [...allFields, ...clickupConf?.customFields]
  const requiredFields = allFields.filter(fld => fld.required === true) || []
  const nonRequiredFields = allFields.filter(fld => fld.required === false) || []
  const allNonRequiredFields = [...nonRequiredFields, ...clickupConf?.customFields || []]

  if (clickupConf?.field_map?.length === 1 && field.clickupFormField === '') {
    const newConf = { ...clickupConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setClickupConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, clickupConf, setClickupConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {
                formFields?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <CustomField
              field={field}
              index={i}
              conf={clickupConf}
              setConf={setClickupConf}
              fieldValue="customValue"
              fieldLabel="Custom Value"
              className="mr-2"
            />
          )}

          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="clickupFormField" value={i < requiredFields ? (requiredFields[i].label || '') : (field.clickupFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, clickupConf, setClickupConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].key} value={requiredFields[i].key}>
                  {requiredFields[i].label}
                </option>
              ) : (
                allNonRequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
            {(clickupConf.actionName === 'task')
              && <option value="customFieldKey">{__('Custom Field', 'bit-integrations')}</option>}
          </select>
          {field.clickupFormField === 'customFieldKey'
            && (
              <CustomField
                field={field}
                index={i}
                conf={clickupConf}
                setConf={setClickupConf}
                fieldValue="customFieldKey"
                fieldLabel="Custom Field Key"
                className="ml-2"
              />
            )}
        </div>
        {
          i >= requiredFields.length && (
            <>
              <button
                onClick={() => addFieldMap(i, clickupConf, setClickupConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, clickupConf, setClickupConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
