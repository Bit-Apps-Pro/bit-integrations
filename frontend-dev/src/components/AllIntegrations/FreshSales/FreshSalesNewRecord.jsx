import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FreshSalesActions from './FreshSalesActions'
import {
  accountRefreshViews,
  contactRefreshViews,
  refreshAccounts,
  refreshContacts
} from './FreshSalesCommonFunc'
import FreshSalesFieldMap from './FreshSalesFieldMap'

export default function FreshSalesNewRecord({
  formFields,
  freshSalesConf,
  setFreshSalesConf,
  handleInput,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  return (
    <>
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

      {freshSalesConf.moduleData.module !== '' &&
        freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.required &&
        !['Account', 'Product', 'Deal'].includes(freshSalesConf.moduleData.module) && (
          <>
            <br />
            <br />
            <b className="wdt-200 d-in-b">{__('Account View:', 'bit-integrations')}</b>
            <select
              onChange={handleInput}
              name="account_view_id"
              value={freshSalesConf.moduleData?.account_view_id || ''}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Account View', 'bit-integrations')}</option>
              {freshSalesConf?.default?.accountViews &&
                freshSalesConf.default.accountViews.map((data, indx) => (
                  <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                    {data.label}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                accountRefreshViews(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh views', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>

            <br />
            <br />
          </>
        )}

      {freshSalesConf.moduleData.module !== '' &&
        freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.required &&
        !['Account', 'Product', 'Deal'].includes(freshSalesConf.moduleData.module) && (
          <>
            <b className="wdt-200 d-in-b">{__('Account:', 'bit-integrations')}</b>
            <select
              onChange={handleInput}
              name="account_id"
              value={freshSalesConf.moduleData?.account_id || ''}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Account', 'bit-integrations')}</option>
              {freshSalesConf?.default?.accounts &&
                freshSalesConf.default.accounts.map((data, indx) => (
                  <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                    {data.label}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshAccounts(freshSalesConf.moduleData.account_view_id, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Accounts', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>

            <br />
            <br />
          </>
        )}

      {freshSalesConf.moduleData.module !== '' &&
        freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.required &&
        !['Account', 'Product', 'Contact'].includes(freshSalesConf.moduleData.module) && (
          <>
            <br />
            <br />
            <b className="wdt-200 d-in-b">{__('Contact View:', 'bit-integrations')}</b>
            <select
              onChange={handleInput}
              name="contact_view_id"
              value={freshSalesConf.moduleData?.contact_view_id || ''}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Contact View', 'bit-integrations')}</option>
              {freshSalesConf?.default?.contactViews &&
                freshSalesConf.default.contactViews.map((data, indx) => (
                  <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                    {data.label}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                contactRefreshViews(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh views', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </>
        )}

      {freshSalesConf.moduleData.module !== '' &&
        freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.required &&
        !['Account', 'Product', 'Contact'].includes(freshSalesConf.moduleData.module) && (
          <>
            <br />
            <br />
            <b className="wdt-200 d-in-b">{__('Contact:', 'bit-integrations')}</b>
            <select
              onChange={handleInput}
              name="contact_id"
              value={freshSalesConf.moduleData?.contact_id || ''}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Contact', 'bit-integrations')}</option>
              {freshSalesConf?.default?.contacts &&
                freshSalesConf.default.contacts.map((data, indx) => (
                  <option key={`pipedrive-m-${indx + 20}`} value={data.value}>
                    {data.label}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshContacts(freshSalesConf.moduleData.contact_view_id, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Contacts', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
            <br />
            <br />
          </>
        )}

      {freshSalesConf.moduleData.module &&
        freshSalesConf.default?.modules?.[freshSalesConf.moduleData.module]?.fields && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp">
                <b>{__('Form Fields', 'bit-integrations')}</b>
              </div>
              <div className="txt-dp">
                <b>{__('FreshSales Fields', 'bit-integrations')}</b>
              </div>
            </div>

            {freshSalesConf.field_map.map((itm, i) => (
              <FreshSalesFieldMap
                key={`pipedrive-m-${i + 9}`}
                i={i}
                field={itm}
                freshSalesConf={freshSalesConf}
                formFields={formFields}
                setFreshSalesConf={setFreshSalesConf}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(
                    freshSalesConf.field_map.length,
                    freshSalesConf,
                    setFreshSalesConf,
                    false
                  )
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
            <br />
            <br />
            <div className="mt-4">
              <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <FreshSalesActions
              freshSalesConf={freshSalesConf}
              setFreshSalesConf={setFreshSalesConf}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSnackbar={setSnackbar}
            />
          </>
        )}
      {freshSalesConf.moduleData.module &&
        !freshSalesConf.default?.modules?.[freshSalesConf.moduleData.module]?.fields && (
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
    </>
  )
}
