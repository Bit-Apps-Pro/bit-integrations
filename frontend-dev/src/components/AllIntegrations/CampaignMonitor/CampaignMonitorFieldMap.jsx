// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { generateMappedField } from './CampaignMonitorCommonFunc'

export default function CampaignMonitorFieldMap({ i, formFields, field, campaignMonitorConf, setCampaignMonitorConf }) {
  let allFields = campaignMonitorConf.subscriberFields
  const requiredFields = allFields.filter(fld => fld.required === true) || []
  const nonRequiredFields = allFields.filter(fld => fld.required === false) || []
  const allNonRequiredFields = [...nonRequiredFields, ...campaignMonitorConf?.customFields || []]

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  if (campaignMonitorConf?.field_map?.length === 1 && field.campaignMonitorField === '') {
    setCampaignMonitorConf(prevConf => {
      prevConf.field_map = generateMappedField(prevConf)
      return prevConf;
    })
  }

  const addFieldMap = (indx) => {
    const newConf = { ...campaignMonitorConf }
    newConf.field_map.splice(indx, 0, {})
    setCampaignMonitorConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...campaignMonitorConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setCampaignMonitorConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...campaignMonitorConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setCampaignMonitorConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = { ...campaignMonitorConf }
    newConf.field_map[indx].customValue = event.target.value
    setCampaignMonitorConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="List Fields">
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

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} />}

        <select className="btcd-paper-inp" name="campaignMonitorField" value={i < requiredFields.length ? (requiredFields[i].key || '') : (field.campaignMonitorField || '')} onChange={(ev) => handleFieldMapping(ev, i)} disabled={i < requiredFields.length}>
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
        </select>
      </div>
      {i >= requiredFields.length
        && (
          <>
            <button onClick={() => addFieldMap(i)} className="icn-btn sh-sm ml-2" type="button">
              +
            </button>
            <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-2" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}
    </div>
  )
}
