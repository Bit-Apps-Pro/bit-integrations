/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __, sprintf } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './NewsletterCommonFunc'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import Cooltip from '../../Utilities/Cooltip'

export default function NewsletterFieldMap({
  i,
  formFields,
  field,
  newsletterConf,
  setNewsletterConf
}) {
  const requiredFields = newsletterConf?.staticFields.filter((fld) => fld.required === true) || []
  const customFields = newsletterConf?.staticFields?.filter((fld) => fld.required === false) || []

  if (newsletterConf?.field_map?.length === 1 && field.newsletterFormField === '') {
    const newConf = { ...newsletterConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setNewsletterConf(newConf)
  }

  let statusField = false

  if (field.newsletterFormField === 'status') {
    statusField = true
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
            onChange={(ev) => handleFieldMapping(ev, i, newsletterConf, setNewsletterConf)}>
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
              onChange={(e) => handleCustomValue(e, i, newsletterConf, setNewsletterConf)}
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
            name="newsletterFormField"
            value={
              i < requiredFields ? requiredFields[i].label || '' : field.newsletterFormField || ''
            }
            onChange={(ev) => handleFieldMapping(ev, i, newsletterConf, setNewsletterConf)}>
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
          {statusField && (
            <div>
              <Cooltip width={350} icnSize={17} className="ml-2">
                <div className="txt-body">
                  <p>
                    {__(
                      'Below are the available statuses for newsletter (single letters are the value)',
                      'bit-integrations'
                    )}
                    :
                  </p>
                  <li>{__('Confirmed', 'bit-integrations')} = C</li>
                  <li>{__('Not Confirmed', 'bit-integrations')} = S</li>
                  <li>{__('Unsubscribed', 'bit-integrations')} = U</li>
                  <li>{__('Bounced', 'bit-integrations')} = B</li>
                  <li>{__('Complained', 'bit-integrations')} = P</li>
                  <p>
                    <strong>{__('Note', 'bit-integrations')}: </strong>
                    {sprintf(
                      __(
                        'you have to insert one of the mentioned %s statuses; otherwise, subscriber adding will fail. You can also omit this status field; if omitted, the status will be set to %s by default',
                        'bit-integrations'
                      ),
                      '(C, S, U, B, P)',
                      '"Confirmed (C)"'
                    )}
                  </p>
                </div>
              </Cooltip>
            </div>
          )}
          {i >= requiredFields.length && (
            <>
              <button
                onClick={() => addFieldMap(i, newsletterConf, setNewsletterConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button">
                +
              </button>
              <button
                onClick={() => delFieldMap(i, newsletterConf, setNewsletterConf)}
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
