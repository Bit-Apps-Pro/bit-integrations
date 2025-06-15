import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import TagifyInput from '../../Utilities/TagifyInput'

export default function PipeDriveFieldMap({ i, formFields, uploadFields, field, pipeDriveConf, setPipeDriveConf, tab }) {
  const module = tab === 0 ? pipeDriveConf.moduleData.module : pipeDriveConf.relatedlists?.[tab - 1]?.module
  const requiredFlds = pipeDriveConf.default.modules?.[module]?.fields?.filter(fld => fld.required === true) || []
  const nonRequiredFlds = pipeDriveConf.default.modules?.[module]?.fields?.filter(fld => fld.required === false) || []
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, pipeDriveConf, setPipeDriveConf, uploadFields, tab)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {
                formFields.map(f => (
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, pipeDriveConf, setPipeDriveConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

          <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="pipeDriveFormField" value={i < requiredFlds ? (requiredFlds[i].label || '') : (field.pipeDriveFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, pipeDriveConf, setPipeDriveConf, uploadFields, tab)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFlds.length ? (
                <option key={requiredFlds[i].key} value={requiredFlds[i].key}>
                  {requiredFlds[i].label}
                </option>
              ) : (
                nonRequiredFlds.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        <div className="flx integ-fld-wrp">

          {
            i >= requiredFlds.length && (
              <>
                <button
                  onClick={() => addFieldMap(i, pipeDriveConf, setPipeDriveConf, uploadFields, tab)}
                  className="icn-btn sh-sm ml-2 mr-1"
                  type="button"
                >
                  +
                </button>
                <button onClick={() => delFieldMap(i, pipeDriveConf, setPipeDriveConf, uploadFields, tab)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                  <span className="btcd-icn icn-trash-2" />
                </button>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}
