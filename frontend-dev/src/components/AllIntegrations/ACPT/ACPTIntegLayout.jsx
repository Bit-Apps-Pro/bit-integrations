/* eslint-disable no-unused-vars */
import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { generateMappedField, getAllGenerator } from './ACPTCommonFunc'
import FieldMappingLayout from './FieldMappingLayout'
import ACPTActions from './ACPTActions'

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

        if (name === 'module' && (val === 'create_cpt' || val === 'update_license')) {
          draftConf.acptFields = draftConf.cptFields
          draftConf.acptLabels = draftConf.cptLabels

          draftConf.field_map = generateMappedField(draftConf.acptFields)
          draftConf.label_field_map = generateMappedField(draftConf.acptLabels)
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

      {/* {acptConf?.module && acptConf.module === 'update_license' && !isLoading && (
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
        )} */}

      {acptConf.module && (
        <>
          {!isLoading && (
            <FieldMappingLayout
              formFields={formFields}
              acptConf={acptConf}
              setAcptConf={setAcptConf}
              label={__('Field Map', 'bit-integrations')}
              fieldMappingKey="field_map"
              fieldKey="acptFields"
              setSnackbar={setSnackbar}
            />
          )}

          {acptConf.module === 'create_cpt' && !isLoading && (
            <FieldMappingLayout
              formFields={formFields}
              acptConf={acptConf}
              setAcptConf={setAcptConf}
              label={__('Additional labels Field Map', 'bit-integrations')}
              fieldMappingKey="label_field_map"
              fieldKey="acptLabels"
              setSnackbar={setSnackbar}
            />
          )}

          <div className="mt-1">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <ACPTActions
            acptConf={acptConf}
            setACPTConf={setAcptConf}
            loading={loading}
            setLoading={setLoading}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
