// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function ActiveCampaignFieldMap({ i, formFields, field, activeCampaingConf, setActiveCampaingConf }) {
  const isRequired = field.required
  const notResquiredField = activeCampaingConf?.default?.fields && Object.values(activeCampaingConf?.default?.fields).filter((f => !f.required))
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...activeCampaingConf }
    newConf.field_map.splice(indx, 0, {})
    setActiveCampaingConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...activeCampaingConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setActiveCampaingConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...activeCampaingConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setActiveCampaingConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, activeCampaingConf, setActiveCampaingConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="activeCampaignField" value={field.activeCampaignField} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {isRequired ? activeCampaingConf?.default?.fields && Object.values(activeCampaingConf.default.fields).map(fld => (
            <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
              {fld.fieldName}
            </option>
          )) : notResquiredField && notResquiredField.map(fld => (
            <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
              {fld.fieldName}
            </option>
          ))}
        </select>
      </div>
      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(i)}
              className="icn-btn sh-sm ml-2"
              type="button"
            >
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
