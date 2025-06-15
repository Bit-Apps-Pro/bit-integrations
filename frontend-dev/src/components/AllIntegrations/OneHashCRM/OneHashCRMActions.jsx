/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function OneHashCRMActions({ oneHashCRMConf, setOneHashCRMConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...oneHashCRMConf }
    if (type === 'organizationLead') {
      if (e.target?.checked) {
        newConf.actions.organizationLead = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.organizationLead
      }
    } else if (type === 'leadSource') {
      if (e.target?.checked) {
        newConf.actions.leadSource = true
        newConf.leadSources = ['Advertisement', 'Campaign', 'Cold Calling', "Customer's Vendor", 'Exhibition', 'Existing Cutomer', 'Mass Mailing', 'Reference', 'Supplier Reference', 'Walk In']
      } else {
        delete newConf.actions.leadSource
      }
    } else if (type === 'LeadAddressType') {
      if (e.target?.checked) {
        newConf.actions.LeadAddressType = true
        newConf.LeadAddressTypes = ['Billing', 'Shipping', 'Office', "Personal", 'Plant', 'Postal', 'Shop', 'SubsiDiary', 'Warehouse', 'Current', 'Permanent', 'Other']
      } else {
        delete newConf.actions.LeadAddressType
      }
    } else if (type === 'LeadType') {
      if (e.target?.checked) {
        newConf.actions.LeadType = true
        newConf.LeadTypes = ['Client', 'Channel Partner', 'Consultant']
      } else {
        delete newConf.actions.LeadType
      }
    } else if (type === 'RequestType') {
      if (e.target?.checked) {
        newConf.actions.RequestType = true
        newConf.RequestTypes = ['Product Enquiry', 'Request For Information', 'Suggestions', 'Other']
      } else {
        delete newConf.actions.RequestType
      }
    } else if (type === 'MarketSegment') {
      if (e.target?.checked) {
        newConf.actions.MarketSegment = true
        newConf.MarketSegments = ['Lower Income', 'Middle Income', 'Upper Income']
      } else {
        delete newConf.actions.MarketSegment
      }
    } else if (type === 'ContactStatus') {
      if (e.target?.checked) {
        newConf.actions.ContactStatus = true
        newConf.ContactStatus = ['Passive', 'Open', 'Replied']
      } else {
        delete newConf.actions.ContactStatus
      }
    }

    setActionMdl({ show: type })
    setOneHashCRMConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...oneHashCRMConf }
    newConf[name] = val
    setOneHashCRMConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf.actions?.organizationLead || false} onChange={(e) => actionHandler(e, 'organizationLead')} className="wdt-200 mt-4 mr-2" value="organizationLead" title={__('Lead is an Organization', 'bit-integrations')} subTitle={__('Lead is an Organization', 'bit-integrations')} />}
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf?.selectedLeadSource || false} onChange={(e) => actionHandler(e, 'leadSource')} className="wdt-200 mt-4 mr-2" value="leadSource" title={__('Add Source', 'bit - integrations')} subTitle={__('Add Source')} />}
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf?.selectedLeadAddressType || false} onChange={(e) => actionHandler(e, 'LeadAddressType')} className="wdt-200 mt-4 mr-2" value="LeadAddressType" title={__('Add Address Type', 'bit - integrations')} subTitle={__('Add Address Type')} />}
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf?.selectedLeadType || false} onChange={(e) => actionHandler(e, 'LeadType')} className="wdt-200 mt-4 mr-2" value="LeadType" title={__('Add Lead Type', 'bit - integrations')} subTitle={__('Add Lead Type')} />}
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf?.selectedRequestType || false} onChange={(e) => actionHandler(e, 'RequestType')} className="wdt-200 mt-4 mr-2" value="RequestType" title={__('Add Request Type', 'bit - integrations')} subTitle={__('Add Request Type')} />}
      {oneHashCRMConf.actionName === 'lead' && <TableCheckBox checked={oneHashCRMConf?.selectedMarketSegment || false} onChange={(e) => actionHandler(e, 'MarketSegment')} className="wdt-200 mt-4 mr-2" value="MarketSegment" title={__('Add Market Segment', 'bit - integrations')} subTitle={__('Add Market Segment')} />}
      {oneHashCRMConf.actionName === 'contact' && <TableCheckBox checked={oneHashCRMConf?.selectedContactStatus || false} onChange={(e) => actionHandler(e, 'ContactStatus')} className="wdt-200 mt-4 mr-2" value="ContactStatus" title={__('Add Status', 'bit - integrations')} subTitle={__('Add Status')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'leadSource'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Source', 'bit-integrations')}
        </div>

        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.leadSources?.map(source => ({ label: source, value: source }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedLeadSource}
            onChange={val => setChanges(val, 'selectedLeadSource')}
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
        show={actionMdl.show === 'LeadAddressType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Address Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Address Type', 'bit-integrations')}
        </div>

        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.LeadAddressTypes?.map(type => ({ label: type, value: type }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedLeadAddressType}
            onChange={val => setChanges(val, 'selectedLeadAddressType')}
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
        show={actionMdl.show === 'LeadType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Lead Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Lead Type', 'bit-integrations')}
        </div>


        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.LeadTypes?.map(type => ({ label: type, value: type }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedLeadType}
            onChange={val => setChanges(val, 'selectedLeadType')}
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
        show={actionMdl.show === 'RequestType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Request Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Request Type', 'bit-integrations')}
        </div>


        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.RequestTypes?.map(type => ({ label: type, value: type }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedRequestType}
            onChange={val => setChanges(val, 'selectedRequestType')}
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
        show={actionMdl.show === 'MarketSegment'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Market Segment', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Market Segment', 'bit-integrations')}
        </div>


        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.MarketSegments?.map(segment => ({ label: segment, value: segment }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedMarketSegment}
            onChange={val => setChanges(val, 'selectedMarketSegment')}
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
        show={actionMdl.show === 'ContactStatus'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Industry', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Industry', 'bit-integrations')}
        </div>


        <div className="flx flx-between mt-2">
          <MultiSelect
            options={oneHashCRMConf?.ContactStatus?.map(status => ({ label: status, value: status }))}
            className="msl-wrp-options"
            defaultValue={oneHashCRMConf?.selectedContactStatus}
            onChange={val => setChanges(val, 'selectedContactStatus')}
            singleSelect
            closeOnSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}

