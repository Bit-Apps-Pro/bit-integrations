import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FreshSalesActions from './FreshSalesActions'
import { handleTabChange } from './FreshSalesCommonFunc'
import FreshSalesFieldMap from './FreshSalesFieldMap'

export default function FreshSalesRelatedRecord({ indx, tab, settab, formID, formFields, freshSalesConf, setFreshSalesConf, handleInput, isLoading, setIsLoading, setSnackbar }) {
  useEffect(() => {
    handleTabChange(indx + 1, settab, formID, freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // eslint-disable-next-line no-undef
  const isPro = typeof btcbi !== 'undefined' && btcbi.isPro

  return (
    <>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <br />
      <br />
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur flx w-9">
            <div className="pro">
              {__('Available On', 'bit-integrations')}
              <a href="https://bitapps.pro/" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium', 'bit-integrations')}
                </span>
              </a>
            </div>
          </div>
        )}
        <b className="wdt-100 d-in-b">{__('Related List:', 'bit-integrations')}</b>
        <select onChange={handleInput} name="module" id="related_module" value={freshSalesConf?.relatedlists?.[tab - 1]?.module} className="btcd-paper-inp w-7" disabled={!freshSalesConf.moduleData?.module}>
          <option value="">{__('Select Related Module', 'bit-integrations')}</option>
          {

            freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.relatedlists?.map(relatedlistApiName => (
              <option key={relatedlistApiName.name} value={relatedlistApiName.name}>
                {relatedlistApiName.name}
              </option>
            ))
          }
        </select>
        <br />
        <br />
      </div>
      <br />
      <br />
      {
        (freshSalesConf.default.modules[freshSalesConf?.relatedlists?.[tab - 1]?.module]?.requiredFields)
        && (
          <>
            <div className="mt-4"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('FreshSales Fields', 'bit-integrations')}</b></div>
            </div>

            {freshSalesConf.relatedlists?.[tab - 1]?.field_map?.map((itm, i) => (
              <FreshSalesFieldMap
                key={`crm-m-${i + 9}`}
                i={i}
                field={itm}
                freshSalesConf={freshSalesConf}
                formFields={formFields}
                setFreshSalesConf={setFreshSalesConf}
                tab={tab}
                setSnackbar={setSnackbar}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(freshSalesConf.relatedlists[tab - 1].field_map.length, freshSalesConf, setFreshSalesConf, false, tab)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />

            {/* <FreshSalesActions
              freshSalesConf={freshSalesConf}
              setFreshSalesConf={setFreshSalesConf}
              tab={tab}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSnackbar={setSnackbar}
            /> */}
          </>
        )
      }
      {(freshSalesConf.default.modules[freshSalesConf.relatedlists[tab - 1]?.module] && !freshSalesConf.default.modules[freshSalesConf?.relatedlists?.[tab - 1]?.module]?.fields)
        && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)',
          }}
          />
        )}
    </>
  )
}
