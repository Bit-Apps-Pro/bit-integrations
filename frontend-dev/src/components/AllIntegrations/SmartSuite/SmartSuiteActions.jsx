/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllUser } from './SmartSuiteCommonFunc'

export default function SmartSuiteActions({ smartSuiteConf, setSmartSuiteConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })

  const actionHandler = (e, type) => {
    const newConf = { ...smartSuiteConf }
    if (type === 'assignedUser') {
      if (e.target?.checked) {
        getAllUser(smartSuiteConf, setSmartSuiteConf, setLoading)
        newConf.actions.assignedUser = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.assignedUser
      }
    }

    setActionMdl({ show: type })
    setSmartSuiteConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...smartSuiteConf }
    newConf[name] = val
    setSmartSuiteConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {smartSuiteConf.actionName === 'solution' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedTag?.length || false}
          onChange={(e) => actionHandler(e, 'tag')}
          className="wdt-200 mt-4 mr-2"
          value="tag"
          title={__('Add Logo Color', 'bit - integrations')}
          subTitle={__('Logo Color for solutions')}
        />
      )}
      {smartSuiteConf.actionName === 'record' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedAssignedUser?.length || false}
          onChange={(e) => actionHandler(e, 'assignedUser')}
          className="wdt-200 mt-4 mr-2"
          value="assigned"
          title={__('Assigned user', 'bit - integrations')}
          subTitle={__('Assigned user for record')}
        />
      )}
      {smartSuiteConf.actionName === 'record' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedPriority?.length || false}
          onChange={(e) => actionHandler(e, 'priority')}
          className="wdt-200 mt-4 mr-2"
          value="priority"
          title={__('Add priority', 'bit - integrations')}
          subTitle={__('Priority for record')}
        />
      )}
      {smartSuiteConf.actionName === 'record' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedStatus?.length || false}
          onChange={(e) => actionHandler(e, 'status')}
          className="wdt-200 mt-4 mr-2"
          value="status"
          title={__('Add Status', 'bit - integrations')}
          subTitle={__('Stattus for record')}
        />
      )}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Logo Color', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Logo Color', 'bit-integrations')}</div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={colorPicker.map((color) => ({ label: color.key, value: color.value }))}
            className="msl-wrp-options"
            defaultValue={smartSuiteConf?.selectedTag}
            onChange={(val) => setChanges(val, 'selectedTag')}
            selectOnClose
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
        <div className="mt-2">{__('Select Priority', 'bit-integrations')}</div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={prioritySelectionData.map((color) => ({ label: color.key, value: color.value }))}
            className="msl-wrp-options"
            defaultValue={smartSuiteConf?.selectedPriority}
            onChange={(val) => setChanges(val, 'selectedPriority')}
            selectOnClose
            singleSelect
          />
        </div>
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Status', 'bit-integrations')}</div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={statusTypeData.map((status) => ({ label: status.key, value: status.value }))}
            className="msl-wrp-options"
            defaultValue={smartSuiteConf?.selectedStatus}
            onChange={(val) => setChanges(val, 'selectedStatus')}
            selectOnClose
            singleSelect
          />
        </div>
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'assignedUser'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Assigned User', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select User', 'bit-integrations')}</div>
        {loading.assignedUser ? (
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
          <div className="flx mt-2">
            <MultiSelect
              options={smartSuiteConf?.assignedUser?.map((user) => ({
                label: user.name,
                value: user.id
              }))}
              className="msl-wrp-options"
              defaultValue={smartSuiteConf?.selectedAssignedUser}
              onChange={(val) => setChanges(val, 'selectedAssignedUser')}
              selectOnClose
              singleSelect
            />
            <button
              onClick={() => getAllUser(smartSuiteConf, setSmartSuiteConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Tags', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}

const colorPicker = [
  { key: 'Primary Blue', value: '#3A86FF' },
  { key: 'Primary Light Blue', value: '#4ECCFD' },
  { key: 'Primary Green', value: '#3EAC40' },
  { key: 'Primary Red', value: '#FF5757' },
  { key: 'Primary Orange', value: '#FF9210' },
  { key: 'Primary Yellow', value: '#FFB938' },
  { key: 'Primary Purple', value: '#883CD0' },
  { key: 'Primary Pink', value: '#EC506E' },
  { key: 'Primary Teal', value: '#17C4C4' },
  { key: 'Primary Grey', value: '#6A849B' },
  { key: 'Dark Primary Blue', value: '#0C41F3' },
  { key: 'Dark Primary Light Blue', value: '#00B3FA' },
  { key: 'Dark Primary Green', value: '#199A27' },
  { key: 'Dark Primary Red', value: '#F1273F' },
  { key: 'Dark Primary Orange', value: '#FF702E' },
  { key: 'Dark Primary Yellow', value: '#FDA80D' },
  { key: 'Dark Primary Purple', value: '#673DB6' },
  { key: 'Dark Primary Pink', value: '#CD286A' },
  { key: 'Dark Primary Teal', value: '#00B2A8' },
  { key: 'Dark Primary Grey', value: '#50515B' }
]
const statusTypeData = [
  { key: 'Backlog', value: 'backlog' },
  { key: 'In Process', value: 'in_process' },
  { key: 'Ready for Review', value: 'ready_for_review' },
  { key: 'Complete', value: 'complete' }
]
const prioritySelectionData = [
  { key: 'Urgent', value: 'urgent' },
  { key: 'High', value: 'high' },
  { key: 'Normal', value: 'normal' },
  { key: 'Low', value: 'Low' }
]
