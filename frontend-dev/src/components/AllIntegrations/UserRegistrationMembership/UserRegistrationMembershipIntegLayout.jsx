import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'
import UserRegistrationMembershipFieldMap from './UserRegistrationMembershipFieldMap'
import { refreshForms, refreshFormFields } from './UserRegistrationMembershipCommonFunc'
import { modules } from './staticData'

export default function UserRegistrationMembershipIntegLayout({
  formFields,
  userRegistrationConf,
  setUserRegistrationConf,
  setIsLoading,
  isLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const changeHandler = (val, name) => {
    const newConf = { ...userRegistrationConf }

    if (name === 'mainAction') {
      newConf.mainAction = val
      newConf.field_map = [{ formField: '', userRegistrationField: '' }]

      refreshForms(newConf, setUserRegistrationConf, setIsLoading, setSnackbar)
    } else if (name === 'selectedForm') {
      newConf.selectedForm = val
      refreshFormFields(val, newConf, setUserRegistrationConf, setIsLoading, setSnackbar)
    } else {
      newConf[name] = val
    }

    setUserRegistrationConf(newConf)
  }
  return (
    <>
      <br />

      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={userRegistrationConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => changeHandler(value, 'mainAction')}
          options={modules?.map(module => ({
            label: checkIsPro(isPro, module.is_pro) ? module.label : getProLabel(module.label),
            value: module.name,
            disabled: checkIsPro(isPro, module.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {userRegistrationConf.mainAction === 'create_user' && (
        <>
          <br />
          <br />
          <b className="wdt-200 d-in-b">{__('Select Form:', 'bit-integrations')}</b>
          <select
            onChange={e => changeHandler(e.target.value, 'selectedForm')}
            name="selectedForm"
            value={userRegistrationConf.selectedForm}
            className="btcd-paper-inp w-5">
            <option value="">{__('Select Form', 'bit-integrations')}</option>
            {userRegistrationConf?.default?.forms &&
              userRegistrationConf.default.forms.map(form => (
                <option key={form.value} value={form.value}>
                  {form.label}
                </option>
              ))}
          </select>
          <button
            onClick={() =>
              refreshForms(userRegistrationConf, setUserRegistrationConf, setIsLoading, setSnackbar)
            }
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh forms', 'bit-integrations')}'` }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
        </>
      )}

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

      {userRegistrationConf.mainAction && userRegistrationConf.selectedForm && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <button
            onClick={() =>
              refreshFormFields(
                userRegistrationConf.selectedForm,
                userRegistrationConf,
                setUserRegistrationConf,
                setIsLoading,
                setSnackbar
              )
            }
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
        </div>
      )}

      {userRegistrationConf.mainAction && userRegistrationConf.selectedForm && (
        <>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('User Registration Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {userRegistrationConf.field_map.map((itm, i) => (
            <UserRegistrationMembershipFieldMap
              key={`um-m-${i + 9}`}
              i={i}
              field={itm}
              userRegistrationConf={userRegistrationConf}
              formFields={formFields}
              setUserRegistrationConf={setUserRegistrationConf}
            />
          ))}

          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(
                  userRegistrationConf.field_map.length,
                  userRegistrationConf,
                  setUserRegistrationConf
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
        </>
      )}
    </>
  )
}
