/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function NimbleActions({ nimbleConf, setNimbleConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...nimbleConf }
    if (type === 'xofEmployees') {
      if (e.target?.checked) {
        newConf.actions.xofEmployees = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.xofEmployees
      }
    } else if (type === 'rating') {
      if (e.target?.checked) {
        newConf.actions.rating = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.rating
      }
    } else if (type === 'leadStatus') {
      if (e.target?.checked) {
        newConf.actions.leadStatus = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.leadStatus
      }
    } else if (type === 'leadSource') {
      if (e.target?.checked) {
        newConf.actions.leadSource = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.leadSource
      }
    } else if (type === 'leadType') {
      if (e.target?.checked) {
        newConf.actions.leadType = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.leadType
      }
    }

    setActionMdl({ show: type })
    setNimbleConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...nimbleConf }
    newConf[name] = val
    setNimbleConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {nimbleConf.actionName === 'company' && <TableCheckBox checked={nimbleConf?.selectedxofEmployees?.length || false} onChange={(e) => actionHandler(e, 'xofEmployees')} className="wdt-200 mt-4 mr-2" value="xofEmployees" title={__('Add Employee Size', 'bit - integrations')} subTitle={__('Add Employee Size')} />}
      {(nimbleConf.actionName === 'company' || nimbleConf.actionName === 'person') && <TableCheckBox checked={nimbleConf?.selectedRating?.length || false} onChange={(e) => actionHandler(e, 'rating')} className="wdt-200 mt-4 mr-2" value="rating" title={__('Add Ratings', 'bit - integrations')} subTitle={__('Add Ratings')} />}
      {(nimbleConf.actionName === 'company' || nimbleConf.actionName === 'person') && <TableCheckBox checked={nimbleConf?.selectedLeadStatus?.length || false} onChange={(e) => actionHandler(e, 'leadStatus')} className="wdt-200 mt-4 mr-2" value="leadStatus" title={__('Add Lead Status', 'bit - integrations')} subTitle={__('Add Lead Status')} />}
      {(nimbleConf.actionName === 'company' || nimbleConf.actionName === 'person') && <TableCheckBox checked={nimbleConf?.selectedLeadSource?.length || false} onChange={(e) => actionHandler(e, 'leadSource')} className="wdt-200 mt-4 mr-2" value="leadSource" title={__('Add Lead Source', 'bit - integrations')} subTitle={__('Add Lead Source')} />}
      {(nimbleConf.actionName === 'company' || nimbleConf.actionName === 'person') && <TableCheckBox checked={nimbleConf?.selectedLeadType?.length || false} onChange={(e) => actionHandler(e, 'leadType')} className="wdt-200 mt-4 mr-2" value="leadType" title={__('Add Lead Type', 'bit - integrations')} subTitle={__('Add Lead Type')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'xofEmployees'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Employee Size', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Employee Size', 'bit-integrations')}
        </div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={nimbleConf?.xofEmployees?.map(size => ({ label: size, value: `${size}` }))}
            className="msl-wrp-options"
            defaultValue={nimbleConf?.selectedxofEmployees}
            onChange={val => setChanges(val, 'selectedxofEmployees')}
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
        show={actionMdl.show === 'rating'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Rating', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Rating', 'bit-integrations')}
        </div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={nimbleConf?.ratings?.map(rating => ({ label: rating, value: `${rating}` }))}
            className="msl-wrp-options"
            defaultValue={nimbleConf?.selectedRating}
            onChange={val => setChanges(val, 'selectedRating')}
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
        show={actionMdl.show === 'leadStatus'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Lead Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Lead Status', 'bit-integrations')}
        </div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={nimbleConf?.leadStatus?.map(status => ({ label: status, value: status }))}
            className="msl-wrp-options"
            defaultValue={nimbleConf?.selectedLeadStatus}
            onChange={val => setChanges(val, 'selectedLeadStatus')}
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
        show={actionMdl.show === 'leadSource'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Lead Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Lead Source', 'bit-integrations')}
        </div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={nimbleConf?.leadSource?.map(source => ({ label: source, value: source }))}
            className="msl-wrp-options"
            defaultValue={nimbleConf?.selectedLeadSource}
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
        show={actionMdl.show === 'leadType'}
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
            options={nimbleConf?.leadTypes?.map(type => ({ label: type, value: type }))}
            className="msl-wrp-options"
            defaultValue={nimbleConf?.selectedLeadType}
            onChange={val => setChanges(val, 'selectedLeadType')}
            singleSelect
            closeOnSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}

