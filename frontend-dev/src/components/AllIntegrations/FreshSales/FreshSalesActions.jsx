/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getAllOwners, getAllLeadLabels, getDealStages, getAllCurrencies } from './FreshSalesCommonFunc'

export default function FreshSalesActions({ freshSalesConf, setFreshSalesConf, tab, isLoading, setIsLoading, setSnackbar }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const module = tab === 0 ? freshSalesConf.moduleData.module : freshSalesConf.relatedlists?.[tab - 1]?.module

  const actionHandler = (e, type) => {
    const newConf = { ...freshSalesConf }
    if (tab === 0) {
      if (type === 'owner') {
        getAllOwners(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
        setActionMdl({ show: type })
      }
      if (type === 'lead_label') {
        getAllLeadLabels(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
        setActionMdl({ show: type })
      } if (type === 'currency') {
        getAllCurrencies(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
        setActionMdl({ show: type })
      }
      if (type === 'deal_stage') {
        getDealStages(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
        setActionMdl({ show: type })
      }
      if (type === 'deal_status') {
        setActionMdl({ show: type })
      }
      if (type === 'activities_type') {
        setActionMdl({ show: type })
      }
      if (type === 'visible_to') {
        setActionMdl({ show: type })
      }
      if (type === 'activities_participants') {
        setActionMdl({ show: type })
      }
      if (type === 'busy_flag' || type === 'active_flag') {
        if (e.target.checked) {
          newConf.actions[type] = true
        } else {
          delete newConf.actions[type]
        }
      }

      setFreshSalesConf({ ...newConf })
    } else {
      if (type === 'owner') {
        getAllOwners(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)
        setActionMdl({ show: type })
      }
      if (type === 'activities_type') {
        setActionMdl({ show: type })
      }
      if (type === 'activities_participants') {
        setActionMdl({ show: type })
      }

      if (type === 'busy_flag' || type === 'active_flag') {
        if (e.target.checked) {
          newConf.relatedlists[tab - 1].actions[type] = true
        } else {
          delete newConf.relatedlists[tab - 1].actions[type]
        }
      }
      setFreshSalesConf({ ...newConf })
    }
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...freshSalesConf }
    if (tab === 0) {
      if (val !== '') {
        newConf.moduleData[type] = val
        newConf.actions[type] = val
      } else {
        delete newConf.moduleData?.[type]
        delete newConf.actions?.[type]
      }
    } else if (val !== '') {
      newConf.relatedlists[tab - 1].moduleData[type] = val
      newConf.relatedlists[tab - 1].actions[type] = val
    } else {
      delete newConf.relatedlists[tab - 1].moduleData[type]
      delete newConf.relatedlists[tab - 1].actions[type]
    }
    setFreshSalesConf({ ...newConf })
  }

  const ActivitiesTypes = [
    {
      label: 'Call',
      value: 'Call',
    },
    {
      label: 'Meeting',
      value: 'Meeting',
    },

    {
      label: 'Task',
      value: 'Task',
    },
    {
      label: 'Deadline',
      value: 'Deadline',
    },
    {
      label: 'Email',
      value: 'Email',
    }, {
      label: 'Lunch',
      value: 'Lunch',
    },
  ]
  const DealStatuses = [
    {
      label: 'Open',
      value: 'open',
    },
    {
      label: 'Won',
      value: 'won',
    },

    {
      label: 'Lost',
      value: 'lost',
    },
    {
      label: 'Deleted',
      value: 'deleted',
    },
  ]
  const VisibleTo = [
    {
      label: 'Owner only',
      value: 1,
    },
    {
      label: "Owner's visibility group",
      value: 3,
    },

    {
      label: "Owner's visibility group and sub-groups",
      value: 5,
    },
    {
      label: 'Entire company',
      value: 7,
    },
  ]

  // eslint-disable-next-line default-param-last
  const getLabelById = (metaData = [], val) => {
    const result = metaData.filter(item => {
      // eslint-disable-next-line eqeqeq
      if (item.value == val) {
        return item
      }
    })
    return result[0]?.label
  }

  return (
    <>
      <div className="pos-rel d-flx w-8">
        <TableCheckBox checked={(tab === 0 ? freshSalesConf.moduleData?.owner : freshSalesConf.relatedlists[tab - 1].moduleData?.owner) || false} onChange={(e) => actionHandler(e, 'owner')} className="wdt-200 mt-4 mr-2" value="owner" title={__('Owners', 'bit-integrations')} subTitle={__('Add Owner', 'bit-integrations')} />
        {module === 'Leads'
          && (
            <>
              {' '}
              <TableCheckBox checked={freshSalesConf.moduleData?.lead_label || false} onChange={(e) => actionHandler(e, 'lead_label')} className="wdt-200 mt-4 mr-2" value="lead_label" title={__('Labels', 'bit-integrations')} subTitle={__('Add Labels', 'bit-integrations')} />
              <TableCheckBox checked={freshSalesConf.moduleData?.currency || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Currency', 'bit-integrations')} subTitle={__('Add Currency', 'bit-integrations')} />

            </>
          )}
        {module === 'Deal'
          && (
            <>
              <TableCheckBox checked={freshSalesConf.moduleData?.deal_stage || false} onChange={(e) => actionHandler(e, 'deal_stage')} className="wdt-200 mt-4 mr-2" value="deal_stage" title={__('Stages', 'bit-integrations')} subTitle={__('Add Stages', 'bit-integrations')} />

              <TableCheckBox checked={freshSalesConf.moduleData?.currency || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Currency', 'bit-integrations')} subTitle={__('Add Currency', 'bit-integrations')} />
              <TableCheckBox checked={freshSalesConf.moduleData?.deal_status || false} onChange={(e) => actionHandler(e, 'deal_status')} className="wdt-200 mt-4 mr-2" value="deal_status" title={__('Status', 'bit-integrations')} subTitle={__('Add Status', 'bit-integrations')} />
            </>
          )}
        {module === 'Activities'
          && (
            <>
              <TableCheckBox checked={(tab === 0 ? freshSalesConf.moduleData?.activities_type : freshSalesConf.relatedlists[tab - 1]?.moduleData?.activities_type) || false} onChange={(e) => actionHandler(e, 'activities_type')} className="wdt-200 mt-4 mr-2" value="activities_type" title={__('Types', 'bit-integrations')} subTitle={__('Add Types', 'bit-integrations')} />

              <TableCheckBox checked={(tab === 0 ? freshSalesConf.actions?.busy_flag : freshSalesConf.relatedlists[tab - 1]?.actions?.busy_flag) || false} onChange={(e) => actionHandler(e, 'busy_flag')} className="wdt-200 mt-4 mr-2" value="busy_flag" title={__('Busy Flag', 'bit-integrations')} subTitle={__('Add Busy Flag', 'bit-integrations')} />

              <TableCheckBox checked={(tab === 0 ? freshSalesConf.actions?.activities_participants : freshSalesConf.relatedlists[tab - 1]?.actions?.activities_participants) || false} onChange={(e) => actionHandler(e, 'activities_participants')} className="wdt-200 mt-4 mr-2" value="activities_participants" title={__('Participants', 'bit-integrations')} subTitle={__('Add Participants', 'bit-integrations')} />
            </>
          )}
        {module === 'Products'
          && (
            <>
              <TableCheckBox checked={(tab === 0 ? freshSalesConf.actions?.active_flag : freshSalesConf.relatedlists[tab - 1]?.actions?.active_flag) || false} onChange={(e) => actionHandler(e, 'active_flag')} className="wdt-200 mt-4 mr-2" value="active_flag" title={__('Inactive Flag', 'bit-integrations')} subTitle={__('Add Inactive Flag', 'bit-integrations')} />
              <TableCheckBox checked={freshSalesConf.moduleData?.currency || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Currency', 'bit-integrations')} subTitle={__('Add Currency', 'bit-integrations')} />

            </>
          )}
        {
          ['Leads', 'Deal', 'Contacts', 'Products'].includes(module)
          && <TableCheckBox checked={freshSalesConf.actions?.visible_to || false} onChange={(e) => actionHandler(e, 'visible_to')} className="wdt-200 mt-4 mr-2" value="visible_to" title={__('Visible To', 'bit-integrations')} subTitle={__('Add Visible To', 'bit-integrations')} />
        }

      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Owners', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(freshSalesConf.default?.owners, tab === 0 ? freshSalesConf.moduleData?.owner : freshSalesConf.relatedlists[tab - 1].moduleData?.owner)}
                options={freshSalesConf.default?.owners?.map(owner => ({ label: owner.label, value: owner.value }))}
                onChange={val => setChanges(val, 'owner')}
                customValue
                singleSelect
              />
              <button
                onClick={() => getAllOwners(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }}
                type="button"
                disabled={isLoading}
              >
                &#x21BB;

              </button>
            </div>
          )}

      </ConfirmModal>
      {' '}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lead_label'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Labels', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(freshSalesConf.default?.leadLabels, freshSalesConf.moduleData?.lead_label)}
                options={freshSalesConf.default?.leadLabels?.map(label => ({ label: label.label, value: label.value }))}
                onChange={val => setChanges(val, 'lead_label')}
                customValue
              />
              <button
                onClick={() => getAllLeadLabels(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh Labels', 'bit-integrations')}'` }}
                type="button"
                disabled={isLoading}
              >
                &#x21BB;

              </button>
            </div>
          )}

      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'deal_stage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Stages', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(freshSalesConf.default?.stages, freshSalesConf.moduleData?.deal_stage)}
                options={freshSalesConf.default?.stages?.map(stage => ({ label: stage.label, value: stage.value }))}
                onChange={val => setChanges(val, 'deal_stage')}
                customValue
                singleSelect
              />
              <button
                onClick={() => getDealStages(freshSalesConf, setFreshSalesConf, setIsLoading, setSnackbar)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh Stages', 'bit-integrations')}'` }}
                type="button"
                disabled={isLoading}
              >
                &#x21BB;

              </button>
            </div>
          )}

      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'activities_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Types', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(ActivitiesTypes, tab === 0 ? freshSalesConf.moduleData?.activities_type : freshSalesConf.relatedlists[tab - 1].moduleData?.activities_type)}
                options={ActivitiesTypes.map(activity => ({ label: activity.label, value: activity.value }))}
                onChange={val => setChanges(val, 'activities_type')}
                customValue
                singleSelect
              />
            </div>
          )}

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

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(freshSalesConf.default?.currencies, tab === 0 ? freshSalesConf.moduleData?.currency : freshSalesConf.relatedlists[tab - 1].moduleData?.currency)}
                options={freshSalesConf.default?.currencies?.map(currency => ({ label: currency.label, value: currency.value }))}
                onChange={val => setChanges(val, 'currency')}
                customValue
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'deal_status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(DealStatuses, tab === 0 ? freshSalesConf.moduleData?.deal_status : freshSalesConf.relatedlists[tab - 1].moduleData?.deal_status)}
                options={DealStatuses.map(status => ({ label: status.label, value: status.value }))}
                onChange={val => setChanges(val, 'deal_status')}
                customValue
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'visible_to'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Visible To', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(VisibleTo, freshSalesConf.moduleData?.visible_to)}
                options={VisibleTo.map(item => ({ label: item.label, value: item.value }))}
                onChange={val => setChanges(val, 'visible_to')}
                customValue
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'activities_participants'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Participants', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={getLabelById(freshSalesConf.default?.contacts, tab === 0 ? freshSalesConf.moduleData?.activities_participants : freshSalesConf.relatedlists[tab - 1].moduleData?.activities_participants)}
                options={freshSalesConf.default?.contacts?.map(item => ({ label: item.label, value: item.value }))}
                onChange={val => setChanges(val, 'activities_participants')}
                customValue
              />
            </div>
          )}

      </ConfirmModal>

    </>

  )
}
