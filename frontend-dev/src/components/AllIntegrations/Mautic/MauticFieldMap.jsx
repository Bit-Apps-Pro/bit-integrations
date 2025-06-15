import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../IntegrationHelpers/MauticIntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function MauticFieldMap({ i, formFields, field, mauticConf, setMauticConf }) {
  const requiredFields = mauticConf?.default?.fields && mauticConf.default.fields.filter(fld => fld.required === true) || []
  const allNonRequiredFields = mauticConf?.default?.fields && mauticConf.default.fields.filter(fld => fld.required === false) || []

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, mauticConf, setMauticConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {

                formFields?.map(f => f.type !== 'file' && (
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

          {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, mauticConf, setMauticConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="mauticField" value={i < requiredFields.length ? (requiredFields[i].fieldAlias || '') : (field.mauticField || '')} onChange={(ev) => handleFieldMapping(ev, i, mauticConf, setMauticConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>

            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].fieldAlias} value={requiredFields[i].fieldAlias}>
                  {requiredFields[i].fieldName}
                </option>
              ) : (
                allNonRequiredFields.map(({ fieldAlias, fieldName }) => (
                  <option key={fieldAlias} value={fieldAlias}>
                    {fieldName}
                  </option>
                ))
              )
            }
          </select>
        </div>
        <button
          onClick={() => addFieldMap(i, mauticConf, setMauticConf)}
          className="icn-btn sh-sm ml-2 mr-1"
          type="button"
        >
          +
        </button>
        <button onClick={() => delFieldMap(i, mauticConf, setMauticConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
          <span className="btcd-icn icn-trash-2" />
        </button>
      </div>
    </div>
  )
}
