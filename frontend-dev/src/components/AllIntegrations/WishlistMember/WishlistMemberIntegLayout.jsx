import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import WishlistMemberActions from './WishlistMemberActions'
import { generateMappedField, refreshNewsLetter } from './WishlistMemberCommonFunc'
import WishlistMemberFieldMap from './WishlistMemberFieldMap'
import { levelFields, modules } from './staticData'
import { create } from 'mutative'

export default function WishlistMemberIntegLayout({
  formFields,
  wishlistMemberConf,
  setWishlistMemberConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const setChange = (value, name) => {
    setWishlistMemberConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = value

        if (value === 'create_level') {
          draftConf.wishlistFields = levelFields
        }

        draftConf['field_map'] = generateMappedField(draftConf.wishlistFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Message Type:', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={wishlistMemberConf?.action}
          className="mt-2 w-5"
          onChange={val => setChange(val, 'action')}
          options={modules?.map(module => ({
            label: checkIsPro(isPro, module.is_pro) ? module.label : getProLabel(module.label),
            value: module.value,
            disabled: checkIsPro(isPro, module.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>
      <br />
      {/* <div className="flx">
        <b className="wdt-200 d-in-b">{__('List:', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={wishlistMemberConf?.lists}
          className="btcd-paper-drpdwn w-6"
          options={
            wishlistMemberConf?.default?.newsletterList &&
            Object.keys(wishlistMemberConf.default.newsletterList).map(newsletter => ({
              label: wishlistMemberConf.default.newsletterList[newsletter].newsletterName,
              value: wishlistMemberConf.default.newsletterList[newsletter].newsletterId
            }))
          }
          onChange={val => lists(val)}
        />
        <button
          onClick={() =>
            refreshNewsLetter(
              formID,
              wishlistMemberConf,
              setWishlistMemberConf,
              setIsLoading,
              setSnackbar
            )
          }
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Refresh WishlistMember List', 'bit-integrations')}'` }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div> */}
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
      {wishlistMemberConf?.action && !isLoading && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('WishlistMember Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {wishlistMemberConf.field_map.map((itm, i) => (
            <WishlistMemberFieldMap
              key={`wishlist-m-${i + 9}`}
              i={i}
              field={itm}
              wishlistMemberConf={wishlistMemberConf}
              wishlistFields={wishlistMemberConf?.wishlistFields}
              formFields={formFields}
              setWishlistMemberConf={setWishlistMemberConf}
            />
          ))}

          {wishlistMemberConf?.wishlistFields?.length > 1 && (
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(
                    wishlistMemberConf.field_map.length,
                    wishlistMemberConf,
                    setWishlistMemberConf
                  )
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
          )}

          <br />
          <br />
          <WishlistMemberActions
            wishlistMemberConf={wishlistMemberConf}
            setWishlistMemberConf={setWishlistMemberConf}
            formFields={formFields}
          />
        </>
      )}
    </>
  )
}
