/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './SmailyCommonFunc'
import CustomField from './CustomField'

export default function SmailyFieldMap({ i, formFields, field, smailyConf, setSmailyConf }) {
  const requiredFields = smailyConf?.staticFields.filter(fld => fld.required === true) || []
  const nonRequiredFields = smailyConf?.staticFields.filter(fld => fld.required === false) || []

  if (smailyConf?.field_map?.length === 1 && field.smailyFormField === '') {
    const newConf = { ...smailyConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setSmailyConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, smailyConf, setSmailyConf)}>
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
              smailyConf={smailyConf}
              setSmailyConf={setSmailyConf}
              fieldValue="customValue"
              fieldLabel="Custom Value"
              className="mr-2"
            />
          )}
          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="smailyFormField" value={i < requiredFields ? (requiredFields[i].label || '') : (field.smailyFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, smailyConf, setSmailyConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].key} value={requiredFields[i].key}>
                  {requiredFields[i].label}
                </option>
              ) : (
                nonRequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
            <option value="customFieldKey">{__('Custom Field', 'bit-integrations')}</option>
          </select>
          {field.smailyFormField === 'customFieldKey' && (
            <CustomField
              field={field}
              index={i}
              smailyConf={smailyConf}
              setSmailyConf={setSmailyConf}
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
                onClick={() => addFieldMap(i, smailyConf, setSmailyConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, smailyConf, setSmailyConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
