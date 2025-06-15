import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../IntegrationHelpers/MailChimpIntegrationHelpers'

export default function MailChimpFieldMap({ i, formFields, field, sheetConf, setSheetConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const requiredFields = sheetConf.default?.fields?.[sheetConf.listId] && Object.values(sheetConf.default.fields[sheetConf.listId]).filter(fld => fld.required === true) || []
  const allNonRequiredFields = sheetConf.default?.fields?.[sheetConf.listId] && Object.values(sheetConf.default.fields[sheetConf.listId]).filter(fld => fld.required === false) || []

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, sheetConf, setSheetConf)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, sheetConf, setSheetConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="mailChimpField" value={field.mailChimpField || ''} onChange={(ev) => handleFieldMapping(ev, i, sheetConf, setSheetConf)} disabled={i < requiredFields.length}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            i < requiredFields.length ? (
              <option key={`mchimp-${requiredFields[i].tag}`} value={requiredFields[i].tag}>
                {requiredFields[i].name}
              </option>
            ) : (
              allNonRequiredFields.map(({ tag, name }) => (
                <option key={`mchimp-${tag}`} value={tag}>
                  {name}
                </option>
              ))
            )
          }
        </select>
      </div>
      <button
        onClick={() => addFieldMap(i, sheetConf, setSheetConf)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button"
      >
        +
      </button>
      <button onClick={() => delFieldMap(i, sheetConf, setSheetConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
        <TrashIcn />
      </button>
    </div>
  )
}
