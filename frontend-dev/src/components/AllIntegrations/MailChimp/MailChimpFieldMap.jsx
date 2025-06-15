import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import {
  addFieldMap,
  delFieldMap,
  handleFieldMapping
} from '../IntegrationHelpers/MailChimpIntegrationHelpers'

export default function MailChimpFieldMap({
  i,
  formFields,
  field,
  mailChimpConf,
  setMailChimpConf
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const requiredFields =
    (mailChimpConf.default?.fields?.[mailChimpConf.listId] &&
      Object.values(mailChimpConf.default.fields[mailChimpConf.listId]).filter(
        (fld) => fld.required === true
      )) ||
    []
  const allNonRequiredFields =
    (mailChimpConf.default?.fields?.[mailChimpConf.listId] &&
      Object.values(mailChimpConf.default.fields[mailChimpConf.listId]).filter(
        (fld) => fld.required === false
      )) ||
    []

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={(ev) => handleFieldMapping(ev, i, mailChimpConf, setMailChimpConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label={__('Form Fields', 'bit-integrations')}>
            {formFields.map(
              (f) =>
                f.type !== 'file' && (
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                )
            )}
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
            onChange={(e) => handleCustomValue(e, i, mailChimpConf, setMailChimpConf)}
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
          name="mailChimpField"
          value={field.mailChimpField || ''}
          onChange={(ev) => handleFieldMapping(ev, i, mailChimpConf, setMailChimpConf)}
          disabled={i < requiredFields.length}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {i < requiredFields.length ? (
            <option key={`mchimp-${requiredFields[i].tag}`} value={requiredFields[i].tag}>
              {requiredFields[i].name}
            </option>
          ) : (
            allNonRequiredFields.map(({ tag, name }) => (
              <option key={`mchimp-${tag}`} value={tag}>
                {name}
              </option>
            ))
          )}
        </select>
      </div>
      <button
        onClick={() => addFieldMap(i, mailChimpConf, setMailChimpConf)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button">
        +
      </button>
      <button
        onClick={() => delFieldMap(i, mailChimpConf, setMailChimpConf)}
        className="icn-btn sh-sm ml-1"
        type="button"
        aria-label="btn">
        <TrashIcn />
      </button>
    </div>
  )
}
