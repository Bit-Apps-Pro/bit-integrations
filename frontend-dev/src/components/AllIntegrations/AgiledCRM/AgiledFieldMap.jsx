/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './AgiledCommonFunc'
import CustomField from './CustomField'

export default function AgiledFieldMap({ i, formFields, field, agiledConf, setAgiledConf }) {
  let allFields = []
  if (agiledConf.actionName === 'account') {
    allFields = agiledConf?.accountFields
  } else if (agiledConf.actionName === 'contact') {
    allFields = agiledConf?.contactFields
  } else {
    allFields = agiledConf?.dealFields
  }

  const requiredFields = allFields.filter(fld => fld.required === true) || []
  const allNonRequiredFields = allFields.filter(fld => fld.required === false) || []

  if (agiledConf?.field_map?.length === 1 && field.agiledFormField === '') {
    const newConf = { ...agiledConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setAgiledConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, agiledConf, setAgiledConf)}>
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
              conf={agiledConf}
              setConf={setAgiledConf}
              fieldValue="customValue"
              fieldLabel="Custom Value"
              className="mr-2"
            />
          )}

          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="agiledFormField" value={i < requiredFields ? (requiredFields[i].label || '') : (field.agiledFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, agiledConf, setAgiledConf)}>
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
            {(agiledConf.actionName === 'account' || agiledConf.actionName === 'contact')
              && <option value="customFieldKey">{__('Custom Field', 'bit-integrations')}</option>}
          </select>
          {field.agiledFormField === 'customFieldKey'
            && (
              <CustomField
                field={field}
                index={i}
                conf={agiledConf}
                setConf={setAgiledConf}
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
                onClick={() => addFieldMap(i, agiledConf, setAgiledConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, agiledConf, setAgiledConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
