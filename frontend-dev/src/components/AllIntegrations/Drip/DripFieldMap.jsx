// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './DripCommonFunc'

export default function DripFieldMap({ i, formFields, field, dripConf, setDripConf }) {
  const requiredFields = dripConf?.dripFormFields.filter((fld) => fld.required === true) || []
  const notResquiredField = dripConf?.dripFormFields?.filter((fld) => fld.required === false) || []

  if (dripConf?.field_map?.length === 1 && field.dripField === '') {
    const newConf = { ...dripConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setDripConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...dripConf }
    newConf.field_map.splice(indx, 0, {})
    setDripConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...dripConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setDripConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...dripConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setDripConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label={__('Campaign Fields', 'bit-integrations')}>
            {formFields?.map((f) => (
              <option key={`ff-rm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>
          <option value="custom">{__('Custom...', 'bit-integrations')}</option>
          <optgroup
            label={`${__('General Smart Codes', 'bit-integrations')} ${isPro ? '' : `(${__('Pro', 'bit-integrations')})`}`}>
            {isPro &&
              SmartTagField?.map((f) => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
          </optgroup>
        </select>

        {field.formField === 'custom' && (
          <TagifyInput
            onChange={(e) => handleCustomValue(e, i, dripConf, setDripConf)}
            label={__('Custom Value', 'bit-integrations')}
            className="mr-2"
            type="text"
            value={field.customValue}
            placeholder={__('Custom Value', 'bit-integrations')}
            formFields={formFields}
          />
        )}

        <select
          className="btcd-paper-inp"
          name="dripField"
          value={i < requiredFields ? requiredFields[i].label || '' : field.dripField || ''}
          onChange={(ev) => handleFieldMapping(ev, i)}
          disabled={i < requiredFields.length}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {i < requiredFields.length ? (
            <option key={requiredFields[i].key} value={requiredFields[i].key}>
              {requiredFields[i].label}
            </option>
          ) : (
            notResquiredField.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))
          )}
        </select>
      </div>
      {i >= requiredFields.length && (
        <>
          <button onClick={() => addFieldMap(i)} className="icn-btn sh-sm ml-2" type="button">
            +
          </button>
          <button
            onClick={() => delFieldMap(i)}
            className="icn-btn sh-sm ml-2"
            type="button"
            aria-label="btn">
            <TrashIcn />
          </button>
        </>
      )}
    </div>
  )
}
