import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { getAllList, getAllTags, mailMintRefreshFields } from './MailMintCommonFunc'
import MailMintFieldMap from './MailMintFieldMap'

export default function MailMintIntegLayout({
  formFields,
  handleInput,
  mailMintConf,
  setMailMintConf,
  isLoading,
  setIsLoading,
  setSnackbar,
  allIntegURL,
  isInfo,
  edit
}) {
  const changeHandler = (val, name) => {
    const newConf = { ...mailMintConf }
    if (name === 'selectedList') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    } else if (name === 'selectedTags') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    } else if (name === 'selectedSubStatus') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    setMailMintConf({ ...newConf })
  }

  const updateHandler = (e, type) => {
    const newConf = { ...mailMintConf }
    if (type === 'selectedUpdate') {
      if (e.target.checked) {
        newConf.update = true
      } else {
        delete newConf.update
      }
    }
    setMailMintConf({ ...newConf })
  }

  const subscriptionStatus = [
    { key: 'pending', label: __('Pending', 'bit-integrations') },
    { key: 'subscribed', label: __('Subscribed', 'bit-integrations') },
    { key: 'unsubscribed', label: __('Unsubscribed', 'bit-integrations') }
  ]

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Actions:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="mainAction"
        value={mailMintConf?.mainAction}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select Actions', 'bit-integrations')}</option>
        {mailMintConf?.allActions &&
          mailMintConf.allActions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
      </select>
      <br />
      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Select List:', 'bit-integrations')}</b>
        <MultiSelect
          className="w-5"
          defaultValue={mailMintConf?.selectedList}
          options={
            mailMintConf?.default?.allLists &&
            mailMintConf.default.allLists.map((item) => ({
              label: item.name,
              value: item.id.toString()
            }))
          }
          onChange={(val) => changeHandler(val, 'selectedList')}
        />
        <button
          onClick={() => getAllList(mailMintConf, setMailMintConf, setIsLoading, setSnackbar)}
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Fetch All List', 'bit-integrations')}'` }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div>
      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Select tags:', 'bit-integrations')}</b>
        <MultiSelect
          className="w-5"
          defaultValue={mailMintConf?.selectedTags}
          options={
            mailMintConf?.default?.allTags &&
            mailMintConf.default.allTags.map((item) => ({
              label: item.name,
              value: item.id.toString()
            }))
          }
          onChange={(val) => changeHandler(val, 'selectedTags')}
        />
        <button
          onClick={() => getAllTags(mailMintConf, setMailMintConf, setIsLoading, setSnackbar)}
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Fetch All Tags', 'bit-integrations')}'` }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div>
      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Select subscription status:', 'bit-integrations')}</b>
        <MultiSelect
          className="w-5"
          singleSelect
          defaultValue={mailMintConf?.selectedSubStatus}
          options={subscriptionStatus.map((item) => ({ label: item.label, value: item.key }))}
          onChange={(val) => changeHandler(val, 'selectedSubStatus')}
        />
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
      {mailMintConf?.mainAction && mailMintConf?.mailMintContactFields && !isLoading && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            <button
              onClick={() =>
                mailMintRefreshFields(mailMintConf, setMailMintConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': '"Refresh Fields"' }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Mail Mint Fields', 'bit-integrations')}</b>
            </div>
          </div>
          {mailMintConf.field_map.map((itm, i) => (
            <MailMintFieldMap
              key={`dash-m-${i + 9}`}
              i={i}
              field={itm}
              mailMintConf={mailMintConf}
              formFields={formFields}
              setMailMintConf={setMailMintConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(mailMintConf.field_map.length, mailMintConf, setMailMintConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </>
      )}
      <div className="pos-rel d-flx w-8">
        <TableCheckBox
          checked={mailMintConf.update || false}
          onChange={(e) => updateHandler(e, 'selectedUpdate')}
          className="wdt-200 mt-4 mr-2"
          value="selectedUpdate"
          title={__('Update Contact', 'bit-integrations')}
          subTitle={__('Update Contact if contact already exist?', 'bit-integrations')}
        />
      </div>
      <br />
    </>
  )
}
