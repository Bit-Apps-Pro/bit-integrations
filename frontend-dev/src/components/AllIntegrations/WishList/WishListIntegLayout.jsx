import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import { getAllLevels, getAllMembers } from './WishListCommonFunc'
import WishListFieldMap from './WishListFieldMap'

export default function WishListIntegLayout({ formFields, handleInput, wishlistConf, setWishlistConf, isLoading, setIsLoading, setSnackbar }) {
  const handleInputAction = (e) => {
    const newConf = { ...wishlistConf }
    const { name, value } = e.target
    if (e.target.value !== '') {
      if (value === 'level-member') {
        delete newConf?.member_id
      } else {
        delete newConf?.level_id
      }
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }

    setTimeout(() => {
      if (newConf?.field_map) newConf.field_map = [{ formField: '', wishlistField: '' }]
      setWishlistConf({ ...newConf })
      if (e.target.value === 'level-member') {
        getAllLevels(newConf, setWishlistConf, setIsLoading)
      } else {
        getAllMembers(newConf, setWishlistConf, setIsLoading)
      }
    }, 10)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
      <select onChange={handleInputAction} name="actionName" value={wishlistConf?.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select Action', 'bit-integrations')}</option>
        {
          wishlistConf?.actionLists && wishlistConf.actionLists.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <br />
      <br />
      {wishlistConf?.actionName && wishlistConf.actionName === 'level-member'
        && (
          <>
            <b className="wdt-200 d-in-b">{__('Levels:', 'bit-integrations')}</b>
            <select onChange={handleInput} name="level_id" value={wishlistConf.level_id} className="btcd-paper-inp w-5">
              <option value="">{__('Select Level', 'bit-integrations')}</option>
              {wishlistConf?.default?.levellists && wishlistConf.default.levellists.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <button onClick={() => getAllLevels(wishlistConf, setWishlistConf, setIsLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Level', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </>
        )}
      {wishlistConf?.actionName && wishlistConf.actionName === 'member-level'
        && (
          <>
            <b className="wdt-200 d-in-b">{__('Members:', 'bit-integrations')}</b>
            <select onChange={handleInput} name="member_id" value={wishlistConf.member_id} className="btcd-paper-inp w-5">
              <option value="">{__('Select Member', 'bit-integrations')}</option>
              {wishlistConf?.default?.memberlists && wishlistConf.default.memberlists.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <button onClick={() => getAllMembers(wishlistConf, setWishlistConf, setIsLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Members', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </>
        )}
      <br />
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Wish List Member Fields', 'bit-integrations')}</b></div>
      </div>

      {(wishlistConf?.level_id || wishlistConf?.member_id) && wishlistConf?.field_map.map((itm, i) => (
        <WishListFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          wishlistConf={wishlistConf}
          formFields={formFields}
          setWishlistConf={setWishlistConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(wishlistConf.field_map.length, wishlistConf, setWishlistConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />

    </>
  )
}
