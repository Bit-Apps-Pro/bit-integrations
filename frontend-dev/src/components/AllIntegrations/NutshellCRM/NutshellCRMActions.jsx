/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllCompanies, getAllCompanyTypes, getAllContacts, getAllProducts, getAllSources, getAllTags } from './NutshellCRMCommonFunc'
import Loader from '../../Loaders/Loader'

export default function NutshellCRMActions({ nutshellCRMConf, setNutshellCRMConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...nutshellCRMConf }
    if (type === 'priority') {
      if (e.target?.checked) {
        newConf.actions.Priority = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.Priority
      }
    } else if (type === 'Contact') {
      if (e.target?.checked) {
        getAllContacts(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.Contact = true

      } else {
        delete newConf.actions.Contact
      }
    } else if (type === 'Product') {
      if (e.target?.checked) {
        getAllProducts(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.Product = true

      } else {
        delete newConf.actions.Contact
      }
    } else if (type === 'Source') {
      if (e.target?.checked) {
        getAllSources(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.Source = true

      } else {
        delete newConf.actions.Contact
      }
    } else if (type === 'Tag') {
      if (e.target?.checked) {
        getAllTags(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.Tag = true

      } else {
        delete newConf.actions.Contact
      }
    } else if (type === 'Company') {
      if (e.target?.checked) {
        getAllCompanies(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.Company = true

      } else {
        delete newConf.actions.Company
      }
    } else if (type === 'CompanyType') {
      if (e.target?.checked) {
        getAllCompanyTypes(nutshellCRMConf, setNutshellCRMConf, setLoading)
        newConf.actions.CompanyType = true

      } else {
        delete newConf.actions.CompanyType
      }
    }

    setActionMdl({ show: type })
    setNutshellCRMConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...nutshellCRMConf }
    newConf[name] = val
    setNutshellCRMConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {nutshellCRMConf.actionName === 'lead' && <TableCheckBox checked={nutshellCRMConf.actions?.Priority || false} onChange={(e) => actionHandler(e, 'priority')} className="wdt-200 mt-4 mr-2" value="priority" title={__('Priority', 'bit-integrations')} subTitle={__('Priority', 'bit-integrations')} />}
      {(nutshellCRMConf.actionName === 'lead' || nutshellCRMConf.actionName === 'people') && <TableCheckBox checked={nutshellCRMConf?.selectedCompany || false} onChange={(e) => actionHandler(e, 'Company')} className="wdt-200 mt-4 mr-2" value="Company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add Company')} />}
      {nutshellCRMConf.actionName === 'lead' && <TableCheckBox checked={nutshellCRMConf?.selectedProduct || false} onChange={(e) => actionHandler(e, 'Product')} className="wdt-200 mt-4 mr-2" value="Product" title={__('Add Product', 'bit - integrations')} subTitle={__('Add Product')} />}
      {nutshellCRMConf.actionName === 'lead' && <TableCheckBox checked={nutshellCRMConf?.selectedSource || false} onChange={(e) => actionHandler(e, 'Source')} className="wdt-200 mt-4 mr-2" value="Source" title={__('Add Source', 'bit - integrations')} subTitle={__('Add Source')} />}
      {nutshellCRMConf.actionName === 'lead' && <TableCheckBox checked={nutshellCRMConf?.selectedTag || false} onChange={(e) => actionHandler(e, 'Tag')} className="wdt-200 mt-4 mr-2" value="Tag" title={__('Add Tag', 'bit - integrations')} subTitle={__('Add Tag')} />}
      {(nutshellCRMConf.actionName === 'company' || nutshellCRMConf.actionName === 'lead') && <TableCheckBox checked={nutshellCRMConf?.selectedContact || false} onChange={(e) => actionHandler(e, 'Contact')} className="wdt-200 mt-4 mr-2" value="Contact" title={__('Add Contact', 'bit - integrations')} subTitle={__('Add Contact')} />}
      {nutshellCRMConf.actionName === 'company' && <TableCheckBox checked={nutshellCRMConf?.selectedCompanyType || false} onChange={(e) => actionHandler(e, 'CompanyType')} className="wdt-200 mt-4 mr-2" value="CompanyType" title={__('Add CompanyType', 'bit - integrations')} subTitle={__('Add CompanyType')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'Company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Company', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Company', 'bit-integrations')}
        </div>

        {loading.companies ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.companies?.map(company => ({ label: company.name, value: company.id }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedCompany}
              onChange={val => setChanges(val, 'selectedCompany')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'Contact'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Contact', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Contact', 'bit-integrations')}
        </div>

        {loading.contacts ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.contacts?.map(contact => ({ label: contact.name, value: contact.id }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedContact}
              onChange={val => setChanges(val, 'selectedContact')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'Product'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Product', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Product', 'bit-integrations')}
        </div>

        {loading.products ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.products?.map(product => ({ label: product.name, value: product.id }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedProduct}
              onChange={val => setChanges(val, 'selectedProduct')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'Source'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Source', 'bit-integrations')}
        </div>

        {loading.sources ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.sources?.map(source => ({ label: source.name, value: source.id }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedSource}
              onChange={val => setChanges(val, 'selectedSource')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'Tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Tag', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Tag', 'bit-integrations')}
        </div>

        {loading.tags ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.tags?.map(tag => ({ label: tag.name, value: tag.name }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedTag}
              onChange={val => setChanges(val, 'selectedTag')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'CompanyType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add CompanyType', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select CompanyType', 'bit-integrations')}
        </div>

        {loading.companyTypes ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )
          : (<div className="flx flx-between mt-2">
            <MultiSelect
              options={nutshellCRMConf?.companyTypes?.map(companyType => ({ label: companyType.name, value: companyType.id }))}
              className="msl-wrp-options"
              defaultValue={nutshellCRMConf?.selectedCompanyType}
              onChange={val => setChanges(val, 'selectedCompanyType')}
              singleSelect
              closeOnSelect
            />
          </div>)}
      </ConfirmModal>
    </div>
  )
}

