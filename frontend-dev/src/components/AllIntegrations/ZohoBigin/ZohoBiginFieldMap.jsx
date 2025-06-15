import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoBiginFieldMap({ i, uploadFields, formFields, field, biginConf, setBiginConf, tab }) {
  const module = tab === 0 ? biginConf.module : biginConf.relatedlists?.[tab - 1]?.module

  const isNotRequired = field.zohoFormField === '' || biginConf.default.moduleData?.[module]?.required?.indexOf(field.zohoFormField) === -1

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, biginConf, setBiginConf, uploadFields, tab)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="Form Fields">
            {
              uploadFields ? formFields.map(f => f.type === 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>) : formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)
            }
          </optgroup>
          {!uploadFields && <option value="custom">{__('Custom...', 'bit-integrations')}</option>}
          <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
            {isPro && SmartTagField?.map(f => (
              <option key={`ff-rm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>

        </select>

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, biginConf, setBiginConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" disabled={!isNotRequired} name="zohoFormField" value={field.zohoFormField || ''} onChange={(ev) => handleFieldMapping(ev, i, biginConf, setBiginConf, uploadFields, tab)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            biginConf.default.moduleData?.[module]?.fields && Object.values(biginConf.default.moduleData[module].fields).map(fieldApiName => (
              isNotRequired
                ? (!fieldApiName.required && (
                  <option key={fieldApiName.api_name} value={fieldApiName.api_name}>
                    {fieldApiName.display_label}
                  </option>
                ))
                : (
                  <option key={fieldApiName.api_name} value={fieldApiName.api_name}>
                    {fieldApiName.display_label}
                  </option>
                )
            ))
          }
        </select>
      </div>

      {
        isNotRequired && (
          <>
            <button
              onClick={() => addFieldMap(i, biginConf, setBiginConf, uploadFields, tab)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, biginConf, setBiginConf, uploadFields, tab)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
