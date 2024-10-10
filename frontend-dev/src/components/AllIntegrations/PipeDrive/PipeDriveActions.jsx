/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import {
  getAllOwners,
  getAllLeadLabels,
  getDealStages,
  getAllCurrencies
} from './PipeDriveCommonFunc'

export default function PipeDriveActions({
  pipeDriveConf,
  setPipeDriveConf,
  tab,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const module =
    tab === 0 ? pipeDriveConf.moduleData.module : pipeDriveConf.relatedlists?.[tab - 1]?.module

  const actionHandler = (e, type) => {
    const newConf = { ...pipeDriveConf }

    if (type === 'owner') {
      getAllOwners(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
      setActionMdl({ show: type })
    }
    if (type === 'lead_label') {
      getAllLeadLabels(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
      setActionMdl({ show: type })
    }
    if (type === 'currency') {
      getAllCurrencies(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
      setActionMdl({ show: type })
    }
    if (type === 'deal_stage') {
      getDealStages(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
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
    if (tab === 0) {
      if (type === 'busy_flag' || type === 'active_flag') {
        if (e.target.checked) {
          newConf.actions[type] = true
        } else {
          delete newConf.actions[type]
        }
      }

      setPipeDriveConf({ ...newConf })
    } else {
      if (type === 'busy_flag' || type === 'active_flag') {
        if (e.target.checked) {
          newConf.relatedlists[tab - 1].actions[type] = true
        } else {
          delete newConf.relatedlists[tab - 1].actions[type]
        }
      }

      setPipeDriveConf({ ...newConf })
    }
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...pipeDriveConf }
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
    setPipeDriveConf({ ...newConf })
  }

  const ActivitiesTypes = [
    {
      label: __('Call', 'bit-integrations'),
      value: 'Call'
    },
    {
      label: __('Meeting', 'bit-integrations'),
      value: 'Meeting'
    },

    {
      label: __('Task', 'bit-integrations'),
      value: 'Task'
    },
    {
      label: __('Deadline', 'bit-integrations'),
      value: 'Deadline'
    },
    {
      label: __('Email', 'bit-integrations'),
      value: 'Email'
    },
    {
      label: __('Lunch', 'bit-integrations'),
      value: 'Lunch'
    }
  ]
  const DealStatuses = [
    {
      label: __('Open', 'bit-integrations'),
      value: 'open'
    },
    {
      label: __('Won', 'bit-integrations'),
      value: 'won'
    },

    {
      label: __('Lost', 'bit-integrations'),
      value: 'lost'
    },
    {
      label: __('Deleted', 'bit-integrations'),
      value: 'deleted'
    }
  ]
  const VisibleTo = [
    {
      label: __('Owner only', 'bit-integrations'),
      value: 1
    },
    {
      label: __("Owner's visibility group", 'bit-integrations'),
      value: 3
    },

    {
      label: __("Owner's visibility group and sub-groups", 'bit-integrations'),
      value: 5
    },
    {
      label: __('Entire company', 'bit-integrations'),
      value: 7
    }
  ]

  // eslint-disable-next-line default-param-last
  const getLabelById = (metaData = [], val) => {
    const result = metaData.filter((item) => {
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
        <TableCheckBox
          checked={
            (tab === 0
              ? pipeDriveConf?.moduleData?.owner
              : pipeDriveConf?.relatedlists[tab - 1]?.moduleData?.owner) || false
          }
          onChange={(e) => actionHandler(e, 'owner')}
          className="wdt-200 mt-4 mr-2"
          value="owner"
          title={__('Owners', 'bit-integrations')}
          subTitle={__('Add Owner', 'bit-integrations')}
        />
        {module === 'Leads' && (
          <>
            {' '}
            <TableCheckBox
              checked={
                tab === 0
                  ? pipeDriveConf.moduleData?.lead_label
                  : pipeDriveConf?.relatedlists[tab - 1]?.moduleData?.lead_label || false
              }
              onChange={(e) => actionHandler(e, 'lead_label')}
              className="wdt-200 mt-4 mr-2"
              value="lead_label"
              title={__('Labels', 'bit-integrations')}
              subTitle={__('Add Labels', 'bit-integrations')}
            />
            <TableCheckBox
              checked={pipeDriveConf.moduleData?.currency || false}
              onChange={(e) => actionHandler(e, 'currency')}
              className="wdt-200 mt-4 mr-2"
              value="currency"
              title={__('Currency', 'bit-integrations')}
              subTitle={__('Add Currency', 'bit-integrations')}
            />
          </>
        )}
        {module === 'Deals' && (
          <>
            <TableCheckBox
              checked={
                tab === 0
                  ? pipeDriveConf.moduleData?.deal_stage
                  : pipeDriveConf?.relatedlists[tab - 1]?.moduleData?.deal_stage || false
              }
              onChange={(e) => actionHandler(e, 'deal_stage')}
              className="wdt-200 mt-4 mr-2"
              value="deal_stage"
              title={__('Stages', 'bit-integrations')}
              subTitle={__('Add Stages', 'bit-integrations')}
            />

            <TableCheckBox
              checked={
                tab === 0
                  ? pipeDriveConf.moduleData?.currency
                  : pipeDriveConf?.relatedlists[tab - 1]?.moduleData?.currency || false
              }
              onChange={(e) => actionHandler(e, 'currency')}
              className="wdt-200 mt-4 mr-2"
              value="currency"
              title={__('Currency', 'bit-integrations')}
              subTitle={__('Add Currency', 'bit-integrations')}
            />
            <TableCheckBox
              checked={
                tab === 0
                  ? pipeDriveConf.moduleData?.deal_status
                  : pipeDriveConf?.relatedlists[tab - 1]?.moduleData?.deal_status || false
              }
              onChange={(e) => actionHandler(e, 'deal_status')}
              className="wdt-200 mt-4 mr-2"
              value="deal_status"
              title={__('Status', 'bit-integrations')}
              subTitle={__('Add Status', 'bit-integrations')}
            />
          </>
        )}
        {module === 'Activities' && (
          <>
            <TableCheckBox
              checked={
                (tab === 0
                  ? pipeDriveConf.moduleData?.activities_type
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.activities_type) || false
              }
              onChange={(e) => actionHandler(e, 'activities_type')}
              className="wdt-200 mt-4 mr-2"
              value="activities_type"
              title={__('Types', 'bit-integrations')}
              subTitle={__('Add Types', 'bit-integrations')}
            />

            <TableCheckBox
              checked={
                (tab === 0
                  ? pipeDriveConf.actions?.busy_flag
                  : pipeDriveConf.relatedlists[tab - 1]?.actions?.busy_flag) || false
              }
              onChange={(e) => actionHandler(e, 'busy_flag')}
              className="wdt-200 mt-4 mr-2"
              value="busy_flag"
              title={__('Busy Flag', 'bit-integrations')}
              subTitle={__('Add Busy Flag', 'bit-integrations')}
            />

            <TableCheckBox
              checked={
                (tab === 0
                  ? pipeDriveConf.actions?.activities_participants
                  : pipeDriveConf.relatedlists[tab - 1]?.actions?.activities_participants) || false
              }
              onChange={(e) => actionHandler(e, 'activities_participants')}
              className="wdt-200 mt-4 mr-2"
              value="activities_participants"
              title={__('Participants', 'bit-integrations')}
              subTitle={__('Add Participants', 'bit-integrations')}
            />
          </>
        )}
        {module === 'Products' && (
          <>
            <TableCheckBox
              checked={
                (tab === 0
                  ? pipeDriveConf.actions?.active_flag
                  : pipeDriveConf.relatedlists[tab - 1]?.actions?.active_flag) || false
              }
              onChange={(e) => actionHandler(e, 'active_flag')}
              className="wdt-200 mt-4 mr-2"
              value="active_flag"
              title={__('Inactive Flag', 'bit-integrations')}
              subTitle={__('Add Inactive Flag', 'bit-integrations')}
            />
            <TableCheckBox
              checked={
                tab === 0
                  ? pipeDriveConf.moduleData?.currency
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.currency || false
              }
              onChange={(e) => actionHandler(e, 'currency')}
              className="wdt-200 mt-4 mr-2"
              value="currency"
              title={__('Currency', 'bit-integrations')}
              subTitle={__('Add Currency', 'bit-integrations')}
            />
          </>
        )}
        {['Leads', 'Deals', 'Persons', 'Products', 'Organizations'].includes(module) && (
          <TableCheckBox
            checked={
              tab === 0
                ? pipeDriveConf.actions?.visible_to
                : pipeDriveConf.relatedlists[tab - 1]?.actions?.visible_to || false
            }
            onChange={(e) => actionHandler(e, 'visible_to')}
            className="wdt-200 mt-4 mr-2"
            value="visible_to"
            title={__('Visible To', 'bit-integrations')}
            subTitle={__('Add Visible To', 'bit-integrations')}
          />
        )}
      </div>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Owners', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                pipeDriveConf.default?.owners,
                tab === 0
                  ? pipeDriveConf.moduleData?.owner
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.owner
              )}
              options={pipeDriveConf.default?.owners?.map((owner) => ({
                label: owner.label,
                value: owner.value
              }))}
              onChange={(val) => setChanges(val, 'owner')}
              customValue
              singleSelect
            />
            <button
              onClick={() =>
                getAllOwners(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>{' '}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lead_label'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Labels', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={
                tab === 0
                  ? pipeDriveConf.moduleData?.lead_label
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.lead_label
              }
              options={pipeDriveConf.default?.leadLabels?.map((label) => ({
                label: label.label,
                value: label.value
              }))}
              onChange={(val) => setChanges(val, 'lead_label')}
            />
            <button
              onClick={() =>
                getAllLeadLabels(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Labels', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
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
        show={actionMdl.show === 'deal_stage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Stages', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                pipeDriveConf.default?.stages,
                tab === 0
                  ? pipeDriveConf.moduleData?.deal_stage
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.deal_stage
              )}
              options={pipeDriveConf.default?.stages?.map((stage) => ({
                label: stage.label,
                value: stage.value
              }))}
              onChange={(val) => setChanges(val, 'deal_stage')}
              customValue
              singleSelect
            />
            <button
              onClick={() =>
                getDealStages(pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Stages', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
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
        show={actionMdl.show === 'activities_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Types', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                ActivitiesTypes,
                tab === 0
                  ? pipeDriveConf.moduleData?.activities_type
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.activities_type
              )}
              options={ActivitiesTypes.map((activity) => ({
                label: activity.label,
                value: activity.value
              }))}
              onChange={(val) => setChanges(val, 'activities_type')}
              customValue
              singleSelect
            />
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'currency'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Currency', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                pipeDriveConf.default?.currencies,
                tab === 0
                  ? pipeDriveConf.moduleData?.currency
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.currency
              )}
              options={pipeDriveConf.default?.currencies?.map((currency) => ({
                label: currency.label,
                value: currency.value
              }))}
              onChange={(val) => setChanges(val, 'currency')}
              customValue
              singleSelect
            />
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'deal_status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                DealStatuses,
                tab === 0
                  ? pipeDriveConf.moduleData?.deal_status
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.deal_status
              )}
              options={DealStatuses.map((status) => ({ label: status.label, value: status.value }))}
              onChange={(val) => setChanges(val, 'deal_status')}
              customValue
              singleSelect
            />
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'visible_to'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Visible To', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                VisibleTo,
                tab === 0
                  ? pipeDriveConf.moduleData?.visible_to
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.visible_to
              )}
              options={VisibleTo.map((item) => ({ label: item.label, value: item.value }))}
              onChange={(val) => setChanges(val, 'visible_to')}
              customValue
              singleSelect
            />
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'activities_participants'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Participants', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading ? (
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
              defaultValue={getLabelById(
                pipeDriveConf.default?.persons,
                tab === 0
                  ? pipeDriveConf.moduleData?.activities_participants
                  : pipeDriveConf.relatedlists[tab - 1]?.moduleData?.activities_participants
              )}
              options={pipeDriveConf.default?.persons?.map((item) => ({
                label: item.label,
                value: item.value
              }))}
              onChange={(val) => setChanges(val, 'activities_participants')}
            />
          </div>
        )}
      </ConfirmModal>
    </>
  )
}
