/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllCompanies, getAllContacts } from './CompanyHubCommonFunc'

export default function CompanyHubActions({ companyHubConf, setCompanyHubConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...companyHubConf }
    if (type === 'company') {
      if (e.target?.checked) {
        if (newConf.companies === undefined) {
          newConf.companies = getAllCompanies(companyHubConf, setCompanyHubConf, setLoading)
        }
        newConf.actions.company = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.company
      }
    } else if (type === 'source') {
      if (e.target?.checked) {
        if (newConf.sources === undefined) {
          newConf.sources = ['Web', 'Call', 'Referral', 'Other']
        }
        newConf.actions.source = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.source
      }
    } else if (type === 'contact') {
      if (e.target?.checked) {
        if (newConf.contacts === undefined) {
          newConf.contacts = getAllContacts(companyHubConf, setCompanyHubConf, setLoading)
        }
        newConf.actions.contact = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.contact
      }
    }

    setActionMdl({ show: type })
    setCompanyHubConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    setCompanyHubConf(prevConf => {
      prevConf[name] = val
      return prevConf
    })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {(companyHubConf.actionName === 'contact' || companyHubConf.actionName === 'deal') && <TableCheckBox checked={companyHubConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add Company')} />}
      {companyHubConf.actionName === 'contact' && <TableCheckBox checked={companyHubConf?.selectedSource?.length || false} onChange={(e) => actionHandler(e, 'source')} className="wdt-200 mt-4 mr-2" value="source" title={__('Add Source', 'bit - integrations')} subTitle={__('Add Contact Source')} />}
      {companyHubConf.actionName === 'deal' && <TableCheckBox checked={companyHubConf?.selectedContact?.length || false} onChange={(e) => actionHandler(e, 'contact')} className="wdt-200 mt-4 mr-2" value="contact" title={__('Add Contact', 'bit - integrations')} subTitle={__('Add Contact')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('company', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Company', 'bit-integrations')}
        </div>
        {
          loading.companies ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
            : (
              <div className="flx flx-between mt-2">
                <MultiSelect
                  options={companyHubConf?.companies?.map(company => ({ label: company.name, value: `${company.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={companyHubConf?.selectedCompany}
                  onChange={val => setChanges(val, 'selectedCompany')}
                  singleSelect
                  closeOnSelect
                />
                <button onClick={() => getAllCompanies(companyHubConf, setCompanyHubConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Companies', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'source'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Source', 'bit-integrations')}
        </div>

        <div className="flx flx-between mt-2">
          <MultiSelect
            options={companyHubConf?.sources?.map(source => ({ label: source, value: source }))}
            className="msl-wrp-options"
            defaultValue={companyHubConf?.selectedSource}
            onChange={val => setChanges(val, 'selectedSource')}
            singleSelect
            closeOnSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contact', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Contact', 'bit-integrations')}
        </div>
        {
          loading.contact ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
            : (
              <div className="flx flx-between mt-2">
                <MultiSelect
                  options={companyHubConf?.contacts?.map(company => ({ label: company.name, value: `${company.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={companyHubConf?.selectedContact}
                  onChange={val => setChanges(val, 'selectedContact')}
                  singleSelect
                  closeOnSelect
                />
                <button onClick={() => getAllContacts(companyHubConf, setCompanyHubConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Contacts', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

    </div>
  )
}

