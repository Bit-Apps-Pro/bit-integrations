import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoMarketingHubFieldMap({ i, formFields, field, marketingHubConf, setMarketingHubConf }) {
  const isNotRequired = field.zohoFormField === '' || marketingHubConf.default.fields[marketingHubConf.list].required?.indexOf(field.zohoFormField) === -1

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, marketingHubConf, setMarketingHubConf)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, marketingHubConf, setMarketingHubConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="zohoFormField" value={field.zohoFormField || ''} disabled={!isNotRequired} onChange={(ev) => handleFieldMapping(ev, i, marketingHubConf, setMarketingHubConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            isNotRequired
              ? marketingHubConf?.default?.fields?.[marketingHubConf.list]?.fields && marketingHubConf.default.fields[marketingHubConf.list].fields.map(contactField => contactField !== 'Contact Email'
                && (
                  <option key={`${contactField}-1`} value={contactField}>
                    {contactField}
                  </option>
                ))
              : (
                <option key="contact_email" value="Contact Email">
                  {__('Contact Email', 'bit-integrations')}
                </option>
              )
          }
        </select>
      </div>
      <button
        onClick={() => addFieldMap(i, marketingHubConf, setMarketingHubConf)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button"
      >
        +
      </button>
      {
        isNotRequired && (
          <button onClick={() => delFieldMap(i, marketingHubConf, setMarketingHubConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
            <TrashIcn />
          </button>
        )
      }
    </div>
  )
}
