import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './UltimateAffiliateProCommonFunc'
import UltimateAffiliateProFieldMap from './UltimateAffiliateProFieldMap'
import { actionToFields, modules } from './staticData'

export default function UltimateAffiliateProIntegLayout({
  formFields,
  ultimateAffiliateProConf,
  setUltimateAffiliateProConf
}) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setUltimateAffiliateProConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value
        draftConf.ultimateAffiliateProFields = actionToFields[value] || []
        draftConf.field_map = generateMappedField(draftConf.ultimateAffiliateProFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={ultimateAffiliateProConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {ultimateAffiliateProConf?.mainAction && ultimateAffiliateProConf?.ultimateAffiliateProFields && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Ultimate Affiliate Pro Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {ultimateAffiliateProConf?.field_map?.map((itm, i) => (
            <UltimateAffiliateProFieldMap
              key={`uap-fm-${i + 1}`}
              i={i}
              field={itm}
              ultimateAffiliateProConf={ultimateAffiliateProConf}
              formFields={formFields}
              setUltimateAffiliateProConf={setUltimateAffiliateProConf}
            />
          ))}

          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(
                  ultimateAffiliateProConf.field_map.length,
                  ultimateAffiliateProConf,
                  setUltimateAffiliateProConf
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
        </div>
      )}
    </>
  )
}
