/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './MailsterCommonFunc'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import Cooltip from '../../Utilities/Cooltip'

export default function MailsterFieldMap({ i, formFields, field, mailsterConf, setMailsterConf }) {
  const requiredFields = mailsterConf?.mailsterFields.filter((fld) => fld.required === true) || []
  const customFields = mailsterConf?.mailsterFields?.filter((fld) => fld.required === false) || []

  if (mailsterConf?.field_map?.length === 1 && field.mailsterFormField === '') {
    const newConf = { ...mailsterConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setMailsterConf(newConf)
  }

  let options = []

  if (field?.mailsterFormField) {
    const filteredMailsterFields = mailsterConf.mailsterFields.filter(
      (mailsterField) => mailsterField.key === field?.mailsterFormField
    )

    if (
      filteredMailsterFields.length &&
      filteredMailsterFields[0].hasOwnProperty('options') &&
      filteredMailsterFields[0].options.length
    ) {
      options = filteredMailsterFields[0].options
    }
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={(ev) => handleFieldMapping(ev, i, mailsterConf, setMailsterConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields?.map((f) => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup
              label={sprintf(
                __('General Smart Codes %s', 'bit-integrations'),
                isPro ? '' : `(${__('Pro', 'bit-integrations')})`
              )}>
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
              onChange={(e) => handleCustomValue(e, i, mailsterConf, setMailsterConf)}
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
            disabled={i < requiredFields.length}
            name="mailsterFormField"
            value={
              i < requiredFields ? requiredFields[i].label || '' : field.mailsterFormField || ''
            }
            onChange={(ev) => handleFieldMapping(ev, i, mailsterConf, setMailsterConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {i < requiredFields.length ? (
              <option key={requiredFields[i].key} value={requiredFields[i].key}>
                {requiredFields[i].label}
              </option>
            ) : (
              customFields.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flx integ-fld-wrp">
          {options.length > 0 && (
            <div>
              <Cooltip width={300} icnSize={17} className="ml-2">
                <div className="txt-body">
                  <p>
                    {__(
                      'Available values or options for the selected Mailster field',
                      'bit-integrations'
                    )}
                    :
                  </p>
                  {options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </div>
              </Cooltip>
            </div>
          )}
          {i >= requiredFields.length && (
            <>
              <button
                onClick={() => addFieldMap(i, mailsterConf, setMailsterConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button">
                +
              </button>
              <button
                onClick={() => delFieldMap(i, mailsterConf, setMailsterConf)}
                className="icn-btn sh-sm ml-1"
                type="button"
                aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
