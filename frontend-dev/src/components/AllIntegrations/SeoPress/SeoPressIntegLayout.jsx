import { create } from 'mutative'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './SeoPressCommonFunc'
import SeoPressFieldMap from './SeoPressFieldMap'
import { UpdatePostMetaFields, modules } from './staticData'

export default function SeoPressIntegLayout({
  formID,
  formFields,
  seoPressConf,
  setSeoPressConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setSeoPressConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        switch (value) {
          case 'update_post_meta':
            draftConf.seoPressFields = UpdatePostMetaFields
            break
          default:
            draftConf.seoPressFields = []
        }

        draftConf.field_map = generateMappedField(draftConf.seoPressFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          className="btcd-paper-inp w-5"
          name="mainAction"
          value={seoPressConf?.mainAction || ''}
          onChange={e => handleMainAction(e.target.value)}>
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {modules?.map(action => (
            <option key={action.name} value={action.name} disabled={!checkIsPro(isPro, action.is_pro)}>
              {checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label)}
            </option>
          ))}
        </select>
      </div>
      <br />

      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      {seoPressConf.mainAction && !isLoading && (
        <div>
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('SEOPress Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {seoPressConf?.field_map.map((itm, i) => (
            <SeoPressFieldMap
              key={`seopress-m-${i + 9}`}
              i={i}
              field={itm}
              seoPressConf={seoPressConf}
              formFields={formFields}
              setSeoPressConf={setSeoPressConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(seoPressConf.field_map.length, seoPressConf, setSeoPressConf, false)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </div>
      )}
    </>
  )
}
