import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export const addFieldMap = (indx, campaignsConf, setCampaignsConf) => {
  const newConf = { ...campaignsConf }
  newConf.field_map.splice(indx, 0, {})
  setCampaignsConf(newConf)
}

export default function ZohoCampaignsFieldMap({ i, formFields, field, campaignsConf, setCampaignsConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const isNotRequired = field.zohoFormField === '' || campaignsConf.default.fields[campaignsConf.list].required?.indexOf(field.zohoFormField) === -1
  const delFieldMap = (indx) => {
    const newConf = { ...campaignsConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }

    setCampaignsConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...campaignsConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }

    setCampaignsConf(newConf)
  }

  return (
    <div
      className={`flx flx-around mt-2 ${isNotRequired && 'mr-1'}`}
    >
      <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, campaignsConf, setCampaignsConf)}>
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

      {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, campaignsConf, setCampaignsConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

      <select className="btcd-paper-inp" name="zohoFormField" value={field.zohoFormField || ''} disabled={!isNotRequired} onChange={(ev) => handleFieldMapping(ev, i, campaignsConf, setCampaignsConf)}>
        <option value="">{__('Select Field', 'bit-integrations')}</option>
        {
          isNotRequired
            ? campaignsConf?.default?.fields?.[campaignsConf.list]?.fields && campaignsConf.default.fields[campaignsConf.list].fields.map(contactField => contactField !== 'Contact Email'
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
      <button
        onClick={() => addFieldMap(i, campaignsConf, setCampaignsConf)}
        className={`icn-btn sh-sm ml-2 ${!isNotRequired && 'mr-8'}`}
        type="button"
      >
        +
      </button>
      {
        isNotRequired && (
          <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
            <TrashIcn />
          </button>
        )
      }
    </div>
  )
}
