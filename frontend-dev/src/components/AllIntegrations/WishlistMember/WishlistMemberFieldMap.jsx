import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function WishlistMemberFieldMap({
  i,
  formFields,
  field,
  wishlistMemberConf,
  setWishlistMemberConf
}) {
  const isRequired = field.required
  const notResquiredField =
    wishlistMemberConf?.default?.fields &&
    Object.values(wishlistMemberConf?.default?.fields).filter(f => f.required === '')

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const addFieldMap = indx => {
    const newConf = { ...wishlistMemberConf }
    newConf.field_map.splice(indx, 0, {})
    setWishlistMemberConf(newConf)
  }

  const delFieldMap = indx => {
    const newConf = { ...wishlistMemberConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setWishlistMemberConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...wishlistMemberConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setWishlistMemberConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={ev => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label={__('Form Fields', 'bit-integrations')}>
            {formFields?.map(f => (
              <option key={`ff-rm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>
          <option value="custom">{__('Custom...', 'bit-integrations')}</option>
          <optgroup
            label={`${__('General Smart Codes', 'bit-integrations')} ${isPro ? '' : `(${__('Pro', 'bit-integrations')})`}`}>
            {isPro &&
              SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
          </optgroup>
        </select>

        {field.formField === 'custom' && (
          <TagifyInput
            onChange={e => handleCustomValue(e, i, wishlistMemberConf, setWishlistMemberConf)}
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
          name="wishlistMemberField"
          value={field.wishlistMemberField}
          onChange={ev => handleFieldMapping(ev, i)}
          disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {isRequired
            ? wishlistMemberConf?.default?.fields &&
              Object.values(wishlistMemberConf.default.fields).map(fld => (
                <option key={`${fld.id}-1`} value={fld.id}>
                  {fld.name}
                </option>
              ))
            : notResquiredField &&
              notResquiredField.map(fld => (
                <option key={`${fld.id}-1`} value={fld.id}>
                  {fld.name}
                </option>
              ))}
        </select>
      </div>
      {!isRequired && (
        <>
          <button onClick={() => addFieldMap(i)} className="icn-btn sh-sm ml-2 mr-1" type="button">
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
