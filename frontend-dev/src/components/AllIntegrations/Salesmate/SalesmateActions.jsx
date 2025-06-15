/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllCRMCompany, getAllCRMCurrency, getAllCRMLostReasons, getAllCRMPriority, getAllCRMSources, getAllCRMStatus, getAllCRMTypes, getAllTags } from './SalesmateCommonFunc'

export default function SalesmateActions({ salesmateConf, setSalesmateConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...salesmateConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        getAllTags(salesmateConf, setSalesmateConf, setLoading)
        newConf.actions.tag = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tag
      }
    } else if (type === 'type') {
      if (e.target?.checked) {
        newConf.types = getAllCRMTypes(setSalesmateConf)
        newConf.actions.type = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.type
      }
    } else if (type === 'lostReason') {
      if (e.target?.checked) {
        newConf.lostReasons = getAllCRMLostReasons(setSalesmateConf)
        newConf.actions.lostReason = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.lostReason
      }
    } else if (type === 'source') {
      if (e.target?.checked) {
        newConf.sources = getAllCRMSources(setSalesmateConf)
        newConf.actions.source = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.source
      }
    } else if (type === 'status') {
      if (e.target?.checked) {
        newConf.statuses = getAllCRMStatus(setSalesmateConf)
        newConf.actions.status = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.status
      }
    } else if (type === 'priority') {
      if (e.target?.checked) {
        newConf.priorities = getAllCRMPriority(setSalesmateConf)
        newConf.actions.priority = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.priority
      }
    } else if (type === 'currency') {
      if (e.target?.checked) {
        getAllCRMCurrency(salesmateConf, setSalesmateConf, setLoading)
        newConf.actions.currency = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.currency
      }
    } else if (type === 'isActive') {
      if (e.target?.checked) {
        newConf.actions.isActive = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.isActive
      }
    } else if (type === 'company') {
      if (e.target?.checked) {
        getAllCRMCompany(salesmateConf, setSalesmateConf, setLoading)
        newConf.actions.company = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.company
      }
    }

    setActionMdl({ show: type })
    setSalesmateConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...salesmateConf }
    newConf[name] = val
    setSalesmateConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {(Number(salesmateConf.actionId) === 1 || Number(salesmateConf.actionId) === 4 || Number(salesmateConf.actionId) === 5 || Number(salesmateConf.actionId) === 6) && <TableCheckBox checked={salesmateConf?.selectedTag?.length || false} onChange={(e) => actionHandler(e, 'tag')} className="wdt-200 mt-4 mr-2" value="tag" title={__('Add Tags', 'bit - integrations')} subTitle={__('Add tags')} />}
      {(Number(salesmateConf.actionId) === 1 || Number(salesmateConf.actionId) === 5) && <TableCheckBox checked={salesmateConf?.selectedType?.length || false} onChange={(e) => actionHandler(e, 'type')} className="wdt-200 mt-4 mr-2" value="type" title={__('Add type', 'bit - integrations')} subTitle={__('Add a Type')} />}
      {(Number(salesmateConf.actionId) === 1 || Number(salesmateConf.actionId) === 4 || Number(salesmateConf.actionId) === 5 || Number(salesmateConf.actionId) === 6) && <TableCheckBox checked={salesmateConf?.selectedCurrency?.length || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Add Currency', 'bit - integrations')} subTitle={__('Add a Currency')} />}
      {Number(salesmateConf.actionId) === 4 && <TableCheckBox checked={salesmateConf?.selectedLostReason?.length || false} onChange={(e) => actionHandler(e, 'lostReason')} className="wdt-200 mt-4 mr-2" value="lostReason" title={__('Add Lost Reasons', 'bit - integrations')} subTitle={__('Add a Lost Reason')} />}
      {Number(salesmateConf.actionId) === 4 && <TableCheckBox checked={salesmateConf?.selectedSource?.length || false} onChange={(e) => actionHandler(e, 'source')} className="wdt-200 mt-4 mr-2" value="source" title={__('Add Source', 'bit - integrations')} subTitle={__('Add a Source')} />}
      {Number(salesmateConf.actionId) === 4 && <TableCheckBox checked={salesmateConf?.selectedStatus?.length || false} onChange={(e) => actionHandler(e, 'status')} className="wdt-200 mt-4 mr-2" value="status" title={__('Add Status', 'bit - integrations')} subTitle={__('Add Status')} />}
      {Number(salesmateConf.actionId) === 4 && <TableCheckBox checked={salesmateConf?.selectedPriority?.length || false} onChange={(e) => actionHandler(e, 'priority')} className="wdt-200 mt-4 mr-2" value="priority" title={__('Add Priority', 'bit - integrations')} subTitle={__('Add Priority')} />}
      {Number(salesmateConf.actionId) === 4 && <TableCheckBox checked={salesmateConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add Company')} />}
      {Number(salesmateConf.actionId) === 6 && <TableCheckBox checked={salesmateConf?.selectedIsActive?.length || false} onChange={(e) => actionHandler(e, 'isActive')} className="wdt-200 mt-4 mr-2" value="isActive" title={__('Add Active for Sale', 'bit - integrations')} subTitle={__('Is Active or Not')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Tag', 'bit-integrations')}
        </div>
        {
          loading.tags ? (
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
                  options={salesmateConf?.tags?.map(tag => ({ label: tag.tag, value: tag.tag }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedTag}
                  onChange={val => setChanges(val, 'selectedTag')}
                />
                <button onClick={() => getAllTags(salesmateConf, setSalesmateConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Tags', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Type', 'bit-integrations')}
        </div>
        {
          loading.CRMType ? (
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
                  options={salesmateConf?.types?.map(type => ({ label: type, value: type }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedType}
                  onChange={val => setChanges(val, 'selectedType')}
                  singleSelect
                />
                <button onClick={() => getAllCRMTypes(setSalesmateConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Types', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lostReason'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Currency-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Lost Reason', 'bit-integrations')}
        </div>
        {
          loading.CRMLostReason ? (
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
                  options={salesmateConf?.lostReasons?.map(lostReason => ({ label: lostReason, value: lostReason }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedLostReason}
                  onChange={val => setChanges(val, 'selectedLostReason')}
                  singleSelect
                />
                <button onClick={() => getAllCRMLostReasons(setSalesmateConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh LostReasons', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
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
        {
          loading.CRMSource ? (
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
                  options={salesmateConf?.sources?.map(source => ({ label: source, value: source }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedSource}
                  onChange={val => setChanges(val, 'selectedSource')}
                  singleSelect
                />
                <button onClick={() => getAllCRMSources(setSalesmateConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Source', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Status', 'bit-integrations')}
        </div>
        {
          loading.CRMStatus ? (
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
                  options={salesmateConf?.statuses?.map(status => ({ label: status, value: status }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedStatus}
                  onChange={val => setChanges(val, 'selectedStatus')}
                  singleSelect
                />
                <button onClick={() => getAllCRMStatus(setSalesmateConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Status', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'priority'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Priority', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Priority', 'bit-integrations')}
        </div>
        {
          loading.CRMPriority ? (
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
                  options={salesmateConf?.priorities?.map(priority => ({ label: priority, value: priority }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedPriority}
                  onChange={val => setChanges(val, 'selectedPriority')}
                  singleSelect
                />
                <button onClick={() => getAllCRMPriority(setSalesmateConf)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Priority', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'currency'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Currency', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Currency', 'bit-integrations')}
        </div>
        {
          loading.CRMCurrency ? (
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
                  options={salesmateConf?.currencies?.map(currency => ({ label: currency.currency, value: currency.currency }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedCurrency}
                  onChange={val => setChanges(val, 'selectedCurrency')}
                  singleSelect
                />
                <button onClick={() => getAllCRMCurrency(salesmateConf, setSalesmateConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Currency', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'isActive'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Active For Sale', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select isActive', 'bit-integrations')}
        </div>
        {
          loading.isActive ? (
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
                  options={[{ label: 'True', value: '1' }, { label: 'False', value: '0' }]}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedIsActive}
                  onChange={val => setChanges(val, 'selectedIsActive')}
                  singleSelect
                />
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Company', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Company', 'bit-integrations')}
        </div>
        {
          loading.CRMCompany ? (
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
                  options={salesmateConf?.companies?.map(company => ({ label: company.name, value: company.id.toString() }))}
                  className="msl-wrp-options"
                  defaultValue={salesmateConf?.selectedCompany}
                  onChange={val => setChanges(val, 'selectedCompany')}
                  singleSelect
                />
                <button onClick={() => getAllCRMCompany(salesmateConf, setSalesmateConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Company', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
    </div>
  )
}

