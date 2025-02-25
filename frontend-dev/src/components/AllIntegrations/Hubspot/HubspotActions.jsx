/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getAllCompany, getAllContacts, getAllIndustry, getAllOwners } from './HubspotCommonFunc'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { getProFeatureSubtitle, getProFeatureTitle } from '../IntegrationHelpers/ActionUtilitiesHelper'

export default function HubspotActions({
  hubspotConf,
  setHubspotConf,
  formFields,
  loading,
  setLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...hubspotConf }
    if (type === 'contact_owner') {
      getAllOwners(hubspotConf, setHubspotConf, setLoading)
      if (e.target.checked) {
        newConf.actions.contact_owner = true
      } else {
        delete newConf.actions.contact_owner
      }
    } else if (type === 'contact') {
      getAllContacts(hubspotConf, setHubspotConf, setLoading)
      if (e.target.checked) {
        newConf.actions.contact = true
      } else {
        delete newConf.actions.contact
      }
    } else if (type === 'company') {
      getAllCompany(hubspotConf, setHubspotConf, setLoading)
      if (e.target.checked) {
        newConf.actions.company = true
      } else {
        delete newConf.actions.company
      }
    } else if (type === 'deal_type') {
      if (e.target.checked) {
        newConf.actions.deal_type = true
      } else {
        delete newConf.actions.deal_type
      }
    } else if (type === 'priority') {
      if (e.target.checked) {
        newConf.actions.priority = true
      } else {
        delete newConf.actions.priority
      }
    } else if (type === 'lifecycle_stage') {
      if (e.target.checked) {
        newConf.actions.lifecycle_stage = true
      } else {
        delete newConf.actions.lifecycle_stage
      }
    } else if (type === 'lead_status') {
      if (e.target.checked) {
        newConf.actions.lead_status = true
      } else {
        delete newConf.actions.lead_status
      }
    } else if (type === 'company_type') {
      if (e.target.checked) {
        newConf.actions.company_type = true
      } else {
        delete newConf.actions.company_type
      }
    } else if (type === 'industry') {
      if (e.target.checked) {
        newConf.actions.industry = true
        getAllIndustry(hubspotConf, setHubspotConf, setLoading)
      } else {
        delete newConf.actions.industry
      }
    } else if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }

    setActionMdl({ show: type })
    setHubspotConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...hubspotConf }
    newConf[type] = val
    setHubspotConf({ ...newConf })
  }

  const lifecycleStage = [
    { value: 'subscriber', label: __('Subscriber', 'bit-integrations') },
    { value: 'lead', label: __('Lead', 'bit-integrations') },
    { value: 'marketingqualifiedlead', label: __('Marketing Qualified Lead', 'bit-integrations') },
    { value: 'salesqualifiedlead', label: __('Sales Qualified Lead', 'bit-integrations') },
    { value: 'opportunity', label: __('Opportunity', 'bit-integrations') },
    { value: 'evangelist', label: __('Evangelist', 'bit-integrations') },
    { value: 'other', label: __('Other', 'bit-integrations') },
    { value: 'customer', label: __('Customer', 'bit-integrations') }
  ]

  const leadStatus = [
    { value: 'OPEN', label: __('Open', 'bit-integrations') },
    { value: 'NEW', label: __('New', 'bit-integrations') },
    { value: 'IN_PROGRESS', label: __('In Progress', 'bit-integrations') },
    { value: 'OPEN_DEAL', label: __('Open Deal', 'bit-integrations') },
    { value: 'UNQUALIFIED', label: __('Unqualified', 'bit-integrations') },
    { value: 'ATTEMPTED_TO_CONTACT', label: __('Attempted to contact', 'bit-integrations') },
    { value: 'CONNECTED', label: __('Connected', 'bit-integrations') },
    { value: 'BAD_TIMING', label: __('Bad timing', 'bit-integrations') }
  ]

  const dealType = [
    { value: 'newbusiness', label: __('New Business', 'bit-integrations') },
    { value: 'existingbusiness', label: __('Existing Business', 'bit-integrations') }
  ]

  const priority = [
    { value: 'low', label: __('Low', 'bit-integrations') },
    { value: 'medium', label: __('Medium', 'bit-integrations') },
    { value: 'high', label: __('High', 'bit-integrations') }
  ]

  const companyTypes = [
    { value: 'PROSPECT', label: __('Prospect', 'bit-integrations') },
    { value: 'PARTNER', label: __('Partner', 'bit-integrations') },
    { value: 'RESELLER', label: __('Reseller', 'bit-integrations') },
    { value: 'VENDOR', label: __('Vendor', 'bit-integrations') },
    { value: 'OTHER', label: __('Other', 'bit-integrations') }
  ]

  const lifecycleStages = [
    { value: 'subscriber', label: __('Subscriber', 'bit-integrations') },
    { value: 'lead', label: __('Lead', 'bit-integrations') },
    { value: 'marketingqualifiedlead', label: __('Marketing Qualified Lead', 'bit-integrations') },
    { value: 'salesqualifiedlead', label: __('Sales Qualified Lead', 'bit-integrations') },
    { value: 'opportunity', label: __('Opportunity', 'bit-integrations') },
    { value: 'customer', label: __('Customer', 'bit-integrations') },
    { value: 'evangelist', label: __('Evangelist', 'bit-integrations') },
    { value: 'other', label: __('Other', 'bit-integrations') }
  ]

  return (
    <div className="pos-rel d-flx w-8">
      {hubspotConf?.actionName && (
        <TableCheckBox
          checked={hubspotConf?.contact_owner?.length || false}
          onChange={e => actionHandler(e, 'contact_owner')}
          className="wdt-200 mt-4 mr-2"
          value="contact_owner"
          title={__('Contact Owner', 'bit-integrations')}
          subTitle={__('Add a contact owner', 'bit-integrations')}
        />
      )}
      {(hubspotConf?.actionName === 'contact' || hubspotConf?.actionName === 'company') && (
        <TableCheckBox
          checked={hubspotConf?.lifecycle_stage || false}
          onChange={e => actionHandler(e, 'lifecycle_stage')}
          className="wdt-200 mt-4 mr-2"
          value="lifecycle_stage"
          title={__('Lifecycle Stage', 'bit-integrations')}
          subTitle={__('Add a lifecycle stage', 'bit-integrations')}
        />
      )}
      {(hubspotConf?.actionName === 'contact' || hubspotConf?.actionName === 'company') && (
        <TableCheckBox
          checked={hubspotConf?.lead_status || false}
          onChange={e => actionHandler(e, 'lead_status')}
          className="wdt-200 mt-4 mr-2"
          value="lead_status"
          title={__('Lead Status', 'bit-integrations')}
          subTitle={__('Add lead status', 'bit-integrations')}
        />
      )}
      {hubspotConf?.actionName === 'deal' && (
        <TableCheckBox
          checked={hubspotConf?.contact || false}
          onChange={e => actionHandler(e, 'contact')}
          className="wdt-200 mt-4 mr-2"
          value="contact"
          title={__('Contact', 'bit-integrations')}
          subTitle={__('Associate deal with contacts', 'bit-integrations')}
        />
      )}
      {hubspotConf?.actionName === 'deal' && (
        <TableCheckBox
          checked={hubspotConf?.company || false}
          onChange={e => actionHandler(e, 'company')}
          className="wdt-200 mt-4 mr-2"
          value="company"
          title={__('Company', 'bit-integrations')}
          subTitle={__('Associate deal with company', 'bit-integrations')}
        />
      )}
      {hubspotConf?.actionName === 'deal' && (
        <TableCheckBox
          checked={hubspotConf?.deal_type || false}
          onChange={e => actionHandler(e, 'deal_type')}
          className="wdt-200 mt-4 mr-2"
          value="deal_type"
          title={__('Deal Type', 'bit-integrations')}
          subTitle={__('Add type to deal', 'bit-integrations')}
        />
      )}
      {hubspotConf?.actionName !== 'contact' && hubspotConf?.actionName !== 'company' && (
        <TableCheckBox
          checked={hubspotConf?.priority || false}
          onChange={e => actionHandler(e, 'priority')}
          className="wdt-200 mt-4 mr-2"
          value="deal_type"
          title={__('Priority', 'bit-integrations')}
          subTitle={__('Add priority', 'bit-integrations')}
        />
      )}
      {hubspotConf?.actionName === 'company' && (
        <TableCheckBox
          checked={hubspotConf?.company_type || false}
          onChange={e => actionHandler(e, 'company_type')}
          className="wdt-200 mt-4 mr-2"
          value="company_type"
          title={__('Type', 'bit-integrations')}
          subTitle={__(
            'The optional classification of this company record - prospect, partner, etc.',
            'bit-integrations'
          )}
        />
      )}
      {hubspotConf?.actionName === 'company' && (
        <TableCheckBox
          checked={hubspotConf?.industry || false}
          onChange={e => actionHandler(e, 'industry')}
          className="wdt-200 mt-4 mr-2"
          value="industry"
          title={__('Industry', 'bit-integrations')}
          subTitle={__(
            'The type of business the company performs. By default, this property has approximately 150 pre-defined options to select from.',
            'bit-integrations'
          )}
        />
      )}
      {
        <TableCheckBox
          checked={hubspotConf?.actions?.update || false}
          onChange={e => actionHandler(e, 'update')}
          className="wdt-200 mt-4 mr-2"
          value="update"
          title={getProFeatureTitle(`${__('Update', 'bit-integrations')} ${hubspotConf?.actionName}`)}
          subTitle={getProFeatureSubtitle(
            __('Update Record', 'bit-integrations'),
            __('Update Record', 'bit-integrations'),
            '2.1.9'
          )}
          isInfo={!isPro}
        />
      }

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact_owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contact Owner', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        {loading.owners ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={hubspotConf?.contact_owner}
              options={hubspotConf.default?.owners?.map(list => ({
                label: list.ownerName,
                value: list.ownerId.toString()
              }))}
              onChange={val => setChanges(val, 'contact_owner')}
              customValue
              singleSelect
            />
            <button
              onClick={() => getAllOwners(hubspotConf, setHubspotConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.owners}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lifecycle_stage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lifecycle Stage', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={hubspotConf?.lifecycle_stage}
            options={lifecycleStage?.map(list => ({
              label: list.label,
              value: list.value.toString()
            }))}
            onChange={val => setChanges(val, 'lifecycle_stage')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lead_status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lead Status', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={hubspotConf?.lead_status}
            options={leadStatus?.map(list => ({
              label: list.label,
              value: list.value.toString()
            }))}
            onChange={val => setChanges(val, 'lead_status')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contacts', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        {loading.contacts ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={hubspotConf?.contact}
              options={hubspotConf?.default?.contacts?.map(list => ({
                label: list.contactName,
                value: list.contactId.toString()
              }))}
              onChange={val => setChanges(val, 'contact')}
              customValue
            />
            <button
              onClick={() => getAllContacts(hubspotConf, setHubspotConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.contacts}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Company', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        {loading.companies ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={hubspotConf?.company}
              options={hubspotConf?.default?.companies?.map(list => ({
                label: list.companyName,
                value: list.companyId.toString()
              }))}
              onChange={val => setChanges(val, 'company')}
              customValue
            />
            <button
              onClick={() => getAllCompany(hubspotConf, setHubspotConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.companies}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'deal_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Deal Type', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={hubspotConf?.deal_type}
            options={dealType?.map(list => ({ label: list.label, value: list.value.toString() }))}
            onChange={val => setChanges(val, 'deal_type')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'priority'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Priority', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={hubspotConf?.priority}
            options={priority?.map(list => ({ label: list.label, value: list.value.toString() }))}
            onChange={val => setChanges(val, 'priority')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Type', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={hubspotConf?.company_type}
            options={companyTypes?.map(list => ({ label: list.label, value: list.value }))}
            onChange={val => setChanges(val, 'company_type')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'industry'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Industry', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        {loading.industry ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <div className="flx flx-center mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={hubspotConf?.industry}
              options={hubspotConf?.industries?.map(list => ({
                label: list.label,
                value: list.value
              }))}
              onChange={val => setChanges(val, 'industry')}
              customValue
              singleSelect
            />
            <button
              onClick={() => getAllIndustry(hubspotConf, setHubspotConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Industry', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.industry}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}
