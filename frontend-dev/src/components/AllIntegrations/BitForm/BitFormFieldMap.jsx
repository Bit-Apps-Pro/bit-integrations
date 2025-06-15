import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'

export default function BitFormFieldMap({ i, field, formFields, bitFormConf, setBitFormConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, bitFormConf, setBitFormConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="Form Fields">
            {
              formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, bitFormConf, setBitFormConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="BitFormMapField" value={field.BitFormMapField || ''} onChange={(ev) => handleFieldMapping(ev, i, bitFormConf, setBitFormConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            bitFormConf?.default?.fields && Object.entries(bitFormConf.default.fields).map((listField, indx) => (
              listField[1].typ !== 'button' && (
                <option key={`bitform-${indx * 2}`} value={listField[0]}>
                  {listField[1].lbl}

                </option>
              )
            ))
          }
        </select>

      </div>
      <button
        onClick={() => addFieldMap(i, bitFormConf, setBitFormConf)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button"
      >
        +
      </button>
      <button onClick={() => delFieldMap(i, bitFormConf, setBitFormConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
        <TrashIcn />
      </button>
    </div>
  )
}
