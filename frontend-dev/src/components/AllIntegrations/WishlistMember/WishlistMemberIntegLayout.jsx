import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshMailpoetHeader, refreshNewsLetter } from './WishlistMemberCommonFunc'
import WishlistMemberFieldMap from './WishlistMemberFieldMap'
import WishlistMemberActions from './WishlistMemberActions'

export default function WishlistMemberIntegLayout({
  formID,
  formFields,
  wishlistMemberConf,
  setWishlistMemberConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const lists = val => {
    const newConf = { ...wishlistMemberConf }
    if (val) {
      newConf.lists = val ? val.split(',') : []
      refreshMailpoetHeader(newConf, setWishlistMemberConf, setIsLoading, setSnackbar)
    } else {
      delete newConf.lists
    }
    setWishlistMemberConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
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
      </div>
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
      {wishlistMemberConf?.lists && (
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
              key={`mailpoet-m-${i + 9}`}
              i={i}
              field={itm}
              wishlistMemberConf={wishlistMemberConf}
              formFields={formFields}
              setWishlistMemberConf={setWishlistMemberConf}
            />
          ))}
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
