import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../IntegrationHelpers/MailChimpIntegrationHelpers'

export default function AcumbamailFieldMap({ i, formFields, field, acumbamailConf, setAcumbamailConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const isRequiredFld = acumbamailConf.default.allFields[acumbamailConf.listId].required?.includes(field.acumbamailFormField)
  const requiredFlds = Object.entries(acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields).filter(listField => listField[1].required === true) || []
  const nonRequiredFlds = Object.entries(acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields).filter(listField => listField[1].required === false) || []

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, acumbamailConf, setAcumbamailConf)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, acumbamailConf, setAcumbamailConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="acumbamailFormField" disabled={i < 1} value={field.acumbamailFormField || ''} onChange={(ev) => handleFieldMapping(ev, i, acumbamailConf, setAcumbamailConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            isRequiredFld && requiredFlds.map((listField, indx) => (
              (
                <option key={`mchimp-${indx * 2}`} value={listField[1].key}>
                  {listField[1].label}
                </option>
              )
            ))
          }
          {
            !isRequiredFld && nonRequiredFlds.map((listField, indx) => (
              (
                <option key={`mchimp-${indx * 2}`} value={listField[1].key}>
                  {listField[1].label}

                </option>
              )
            ))
          }
        </select>
      </div>

      {
        !isRequiredFld && (
          <>
            <button
              onClick={() => addFieldMap(i, acumbamailConf, setAcumbamailConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, acumbamailConf, setAcumbamailConf)} className="icn-btn sh-sm" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }

    </div>
  )
}
