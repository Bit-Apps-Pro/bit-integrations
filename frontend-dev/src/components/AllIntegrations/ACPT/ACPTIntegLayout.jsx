/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import {
  generateMappedField,
  getAllCustomer,
  getAllGenerator,
  getAllLicense,
  getAllOrder,
  getAllProduct
} from './ACPTCommonFunc'
import ACPTFieldMap from './ACPTFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { create } from 'mutative'
import Note from '../../Utilities/Note'

export default function ACPTIntegLayout({
  formFields,
  acptConf,
  setAcptConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const setChanges = (val, name) => {
    setAcptConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = val

        if (name === 'module' && (val === 'create_license' || val === 'update_license')) {
          getAllCustomer(acptConf, setAcptConf, setLoading)
          getAllProduct(acptConf, setAcptConf, setLoading)
          getAllOrder(acptConf, setAcptConf, setLoading)

          if (val === 'update_license') {
            getAllLicense(acptConf, setAcptConf, setLoading)
            draftConf.acptFields = [
              { label: __('License key', 'bit-integrations'), key: 'license_key', required: false },
              ...draftConf.generalFields
            ]
          } else {
            draftConf.acptFields = [...draftConf.licenseFields, ...draftConf.generalFields]
          }

          draftConf.field_map = generateMappedField(draftConf.acptFields)
          draftConf.module_note = `<p><b>${__('Note', 'bit-integrations')}</b>: ${__('You can also use Valid for (the number of days) instead of Expires at', 'bit-integrations')}, <b>${__('please do not use both at a time', 'bit-integrations')}</b></p>`
        } else if (name === 'module' && ['activate_license', 'delete_license'].includes(val)) {
          draftConf.acptFields = draftConf.licenseFields
          draftConf.field_map = generateMappedField(draftConf.acptFields)
        } else if (name === 'module' && ['deactivate_license', 'reactivate_license'].includes(val)) {
          draftConf.acptFields = [
            ...draftConf.licenseFields,
            { label: __('Activation Token', 'bit-integrations'), key: 'token', required: false }
          ]
          draftConf.field_map = generateMappedField(draftConf.acptFields)
        } else if (name === 'module' && (val === 'create_generator' || val === 'update_generator')) {
          if (val === 'update_generator') {
            getAllGenerator(acptConf, setAcptConf, setLoading)
            draftConf.acptFields = draftConf.generatorFields.map(fields => {
              return { ...fields, required: false }
            })
          } else {
            draftConf.acptFields = draftConf.generatorFields
          }

          draftConf.field_map = generateMappedField(draftConf.acptFields)
        }
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        <MultiSelect
          title={'Action'}
          defaultValue={acptConf?.module}
          className="mt-2 w-5"
          onChange={val => setChanges(val, 'module')}
          options={acptConf?.modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {(isLoading || loading.customer || loading.product || loading.license || loading.generator) && (
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

      {acptConf?.module && acptConf.module === 'update_license' && !isLoading && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select License:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                acptConf?.licenses && acptConf.licenses.map(event => ({ label: event, value: event }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={acptConf?.selectedLicense}
              onChange={val => setChanges(val, 'selectedLicense')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllLicense(acptConf, setAcptConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh License', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.license}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {acptConf?.module && acptConf.module === 'update_generator' && !isLoading && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Generator:', 'bit-integrations')}</b>
            <MultiSelect
              options={
                acptConf?.generators &&
                acptConf.generators.map(event => ({ label: event.name, value: `${event.id}` }))
              }
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={acptConf?.selectedGenerator}
              onChange={val => setChanges(val, 'selectedGenerator')}
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => getAllGenerator(acptConf, setAcptConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Generator', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.generator}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {acptConf?.module &&
        (acptConf.module === 'create_license' || acptConf.module === 'update_license') &&
        !isLoading && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Status:', 'bit-integrations')}</b>
              <MultiSelect
                options={[
                  { id: 'sold', name: 'Sold' },
                  { id: 'delivered', name: 'Delivered' },
                  { id: 'active', name: 'Active' },
                  { id: 'inactive', name: 'Inactive' }
                ].map(event => ({ label: event.name, value: `${event.id}` }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={acptConf?.selectedStatus}
                onChange={val => setChanges(val, 'selectedStatus')}
                singleSelect
                closeOnSelect
              />
            </div>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Customer:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  acptConf?.customers &&
                  acptConf.customers.map(customer => ({
                    label: customer.name,
                    value: `${customer.id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={acptConf?.selectedCustomer}
                onChange={val => setChanges(val, 'selectedCustomer')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllCustomer(acptConf, setAcptConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Customers', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.customer}>
                &#x21BB;
              </button>
            </div>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Product:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  acptConf?.products &&
                  acptConf.products.map(product => ({
                    label: product.name,
                    value: `${product.id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={acptConf?.selectedProduct}
                onChange={val => setChanges(val, 'selectedProduct')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllProduct(acptConf, setAcptConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Products', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.product}>
                &#x21BB;
              </button>
            </div>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Order:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  acptConf?.orders &&
                  acptConf.orders.map(order => ({
                    label: order.name,
                    value: `${order.id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={acptConf?.selectedOrder}
                onChange={val => setChanges(val, 'selectedOrder')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllOrder(acptConf, setAcptConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Orders', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.order}>
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {acptConf.module && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('License Manager Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {acptConf.field_map.map((itm, i) => (
            <ACPTFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              acptConf={acptConf}
              formFields={formFields}
              setAcptConf={setAcptConf}
              setSnackbar={setSnackbar}
            />
          ))}

          {!['activate_license', 'delete_license'].includes(acptConf.module) && (
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() => addFieldMap(acptConf.field_map.length, acptConf, setAcptConf, false)}
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
          )}
          <br />
          <br />
          {acptConf?.module_note && <Note note={acptConf?.module_note} />}
        </div>
      )}
    </>
  )
}
