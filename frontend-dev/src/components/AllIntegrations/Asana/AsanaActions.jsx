/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { getAllTasks, getAllParentOrganizations, getAllTeams, getAllCurrencies, getAllStages } from './AsanaCommonFunc'

export default function AsanaActions({ asanaConf, setAsanaConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const followUps = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]

  const taskTypes = [
    { label: 'New Business', value: 'New Business' },
    { label: 'Existing Business', value: 'Existing Business' },
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...asanaConf }

    if (type === 'task') {
      if (e.target?.checked) {
        getAllTasks(asanaConf, setAsanaConf, setLoading)
        newConf.actions.task = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.task
      }
    } else if (type === 'parentOrganization') {
      if (e.target?.checked) {
        getAllParentOrganizations(asanaConf, setAsanaConf, setLoading)
        newConf.actions.parentOrganization = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.parentOrganization
      }
    } else if (type === 'team') {
      if (e.target?.checked) {
        getAllTeams(asanaConf, setAsanaConf, setLoading)
        newConf.actions.team = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.team
      }
    } else if (type === 'currency') {
      if (e.target?.checked) {
        getAllCurrencies(asanaConf, setAsanaConf, setLoading)
        newConf.actions.currency = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.currency
      }
    } else if (type === 'stage') {
      if (e.target?.checked) {
        getAllStages(asanaConf, setAsanaConf, setLoading)
        newConf.actions.stage = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.stage
      }
    } else if (type === 'followUp') {
      if (e.target?.checked) {
        newConf.actions.followUp = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.followUp
      }
    } else if (type === 'taskType') {
      if (e.target?.checked) {
        newConf.actions.taskType = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.taskType
      }
    }

    setActionMdl({ show: type })
    setAsanaConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...asanaConf }
    newConf[name] = val
    setAsanaConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {(asanaConf.actionName === 'organization') && <TableCheckBox checked={asanaConf?.selectedParentOrganization?.length || false} onChange={(e) => actionHandler(e, 'parentOrganization')} className="wdt-200 mt-4 mr-2" value="parentOrganization" title={__('Add ParentOrganization', 'bit - integrations')} subTitle={__('Add an parentOrganization')} />}
      {/* {(asanaConf.actionName === 'deal') && <TableCheckBox checked={asanaConf?.selectedTeam?.length || false} onChange={(e) => actionHandler(e, 'team')} className="wdt-200 mt-4 mr-2" value="team" title={__('Add Team', 'bit - integrations')} subTitle={__('Add an team')} />} */}
      {/* {(asanaConf.actionName === 'task') && <TableCheckBox checked={asanaConf?.selectedCurrency?.length || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Add Currency', 'bit - integrations')} subTitle={__('Add a currency')} />} */}
      {(asanaConf.actionName === 'deal') && <TableCheckBox checked={asanaConf?.selectedStage?.length || false} onChange={(e) => actionHandler(e, 'stage')} className="wdt-200 mt-4 mr-2" value="stage" title={__('Add Stage', 'bit - integrations')} subTitle={__('Add a stage')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'task'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tasks', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Task', 'bit-integrations')}
        </div>
        {
          loading.tasks ? (
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
                  options={asanaConf?.tasks?.map(task => ({ label: task.name, value: task.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedTask}
                  onChange={val => setChanges(val, 'selectedTask')}
                  singleSelect
                />
                <button onClick={() => getAllTasks(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Tasks', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'parentOrganization'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('ParentOrganizations', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select ParentOrganization', 'bit-integrations')}
        </div>
        {
          loading.parentOrganizations ? (
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
                  options={asanaConf?.parentOrganizations?.map(parentOrganization => ({ label: parentOrganization.name, value: parentOrganization.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedParentOrganization}
                  onChange={val => setChanges(val, 'selectedParentOrganization')}
                  singleSelect
                />
                <button onClick={() => getAllParentOrganizations(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh ParentOrganizations', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'team'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Teams', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Team', 'bit-integrations')}
        </div>
        {
          loading.teams ? (
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
                  options={asanaConf?.teams?.map(team => ({ label: team.name, value: team.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedTeam}
                  onChange={val => setChanges(val, 'selectedTeam')}
                  singleSelect
                />
                <button onClick={() => getAllTeams(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Teams', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
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
        title={__('Currencies', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Currency', 'bit-integrations')}
        </div>
        {
          loading.currencies ? (
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
                  options={asanaConf?.currencies?.map(currency => ({ label: currency.name, value: currency.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedCurrency}
                  onChange={val => setChanges(val, 'selectedCurrency')}
                  singleSelect
                />
                <button onClick={() => getAllCurrencies(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Currencies', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'stage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Stages', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Stage', 'bit-integrations')}
        </div>
        {
          loading.stages ? (
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
                  options={asanaConf?.stages?.map(stage => ({ label: stage.name, value: stage.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedStage}
                  onChange={val => setChanges(val, 'selectedStage')}
                  singleSelect
                />
                <button onClick={() => getAllStages(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Stages', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      {/* <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Statuses', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Status', 'bit-integrations')}
        </div>
        {
          loading.statuses ? (
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
                  options={asanaConf?.statuses?.map(status => ({ label: status.name, value: status.id }))}
                  className="msl-wrp-options"
                  defaultValue={asanaConf?.selectedStatus}
                  onChange={val => setChanges(val, 'selectedStatus')}
                  singleSelect
                />
                <button onClick={() => getAllStatuses(asanaConf, setAsanaConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh statuses', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal> */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'followUp'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Follow Up', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={followUps?.map(followUp => ({ label: followUp.label, value: followUp.value }))}
            className="msl-wrp-options"
            defaultValue={asanaConf?.selectedFollowUp}
            onChange={val => setChanges(val, 'selectedFollowUp')}
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'taskType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Task types', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={taskTypes?.map(taskType => ({ label: taskType.label, value: taskType.value }))}
            className="msl-wrp-options"
            defaultValue={asanaConf?.selectedTaskType}
            onChange={val => setChanges(val, 'selectedTaskType')}
            singleSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
