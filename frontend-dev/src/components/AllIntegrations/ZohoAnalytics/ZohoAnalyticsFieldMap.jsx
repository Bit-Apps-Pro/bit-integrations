import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export const addFieldMap = (indx, analyticsConf, setAnalyticsConf) => {
  const newConf = { ...analyticsConf }
  newConf.field_map.splice(indx, 0, {})

  setAnalyticsConf(newConf)
}

export default function ZohoAnalyticsFieldMap({ i, formFields, field, analyticsConf, setAnalyticsConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const delFieldMap = (indx) => {
    const newConf = { ...analyticsConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }

    setAnalyticsConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...analyticsConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }

    setAnalyticsConf(newConf)
  }

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, analyticsConf, setAnalyticsConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="zohoFormField" value={field.zohoFormField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            Object.values(analyticsConf.default.tables.headers[analyticsConf.table]).map(header => (
              <option key={`${header}-1`} value={header}>
                {header}
              </option>
            ))
          }
        </select>
      </div>
      <button
        onClick={() => addFieldMap(i, analyticsConf, setAnalyticsConf)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button"
      >
        +
      </button>
      <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-2" type="button" aria-label="btn">
        <TrashIcn />
      </button>
    </div>
  )
}
