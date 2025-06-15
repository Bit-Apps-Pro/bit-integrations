/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllAccountCategories, getAllCustomer, getAllIndustry, getAllManagers, getAllPortfolio, getAllProjectOpportunity, getAllProjectStage, getAllSource } from './FlowluCommonFunc'

export default function FlowluActions({ flowluConf, setFlowluConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...flowluConf }
    if (type === 'category') {
      if (e.target?.checked) {
        getAllAccountCategories(flowluConf, setFlowluConf, setLoading)
        newConf.actions.category = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.category
      }
    } else if (type === 'industry') {
      if (e.target?.checked) {
        getAllIndustry(flowluConf, setFlowluConf, setLoading)
        newConf.actions.industry = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.industry
      }
    } else if (type === 'source') {
      if (e.target?.checked) {
        getAllSource(flowluConf, setFlowluConf, setLoading)
        newConf.actions.source = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.source
      }
    } else if (type === 'customer') {
      if (e.target?.checked) {
        getAllCustomer(flowluConf, setFlowluConf, setLoading)
        newConf.actions.customer = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.customer
      }
    } else if (type === 'manager') {
      if (e.target?.checked) {
        getAllManagers(flowluConf, setFlowluConf, setLoading)
        newConf.actions.manager = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.manager
      }
    } else if (type === 'projectStage') {
      if (e.target?.checked) {
        getAllProjectStage(flowluConf, setFlowluConf, setLoading)
        newConf.actions.projectStage = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.projectStage
      }
    } else if (type === 'portfolio') {
      if (e.target?.checked) {
        getAllPortfolio(flowluConf, setFlowluConf, setLoading)
        newConf.actions.portfolio = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.portfolio
      }
    } else if (type === 'priority') {
      if (e.target?.checked) {
        newConf.actions.priority = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.priority
      }
    } else if (type === 'projectOpportunity') {
      if (e.target?.checked) {
        getAllProjectOpportunity(flowluConf, setFlowluConf, setLoading)
        newConf.actions.projectOpportunity = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.projectOpportunity
      }
    }

    setActionMdl({ show: type })
    setFlowluConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...flowluConf }
    newConf[name] = val
    setFlowluConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {flowluConf.actionName === 'account' && <TableCheckBox checked={flowluConf?.selectedCategory?.length || false} onChange={(e) => actionHandler(e, 'category')} className="wdt-200 mt-4 mr-2" value="category" title={__('Add Category', 'bit - integrations')} subTitle={__('Add Category')} />}
      {flowluConf.actionName === 'account' && <TableCheckBox checked={flowluConf?.selectedIndustry?.length || false} onChange={(e) => actionHandler(e, 'industry')} className="wdt-200 mt-4 mr-2" value="industry" title={__('Add Industry', 'bit - integrations')} subTitle={__('Add Industry')} />}
      {flowluConf.actionName === 'opportunity' && <TableCheckBox checked={flowluConf?.selectedSource?.length || false} onChange={(e) => actionHandler(e, 'source')} className="wdt-200 mt-4 mr-2" value="source" title={__('Add Source', 'bit - integrations')} subTitle={__('Add Source')} />}
      {flowluConf.actionName === 'project' && <TableCheckBox checked={flowluConf?.selectedPriority?.length || false} onChange={(e) => actionHandler(e, 'priority')} className="wdt-200 mt-4 mr-2" value="priority" title={__('Add Project Priority', 'bit - integrations')} subTitle={__('Add Project Priority')} />}
      {(flowluConf.actionName === 'opportunity' || flowluConf.actionName === 'project') && <TableCheckBox checked={flowluConf?.selectedCustomer?.length || false} onChange={(e) => actionHandler(e, 'customer')} className="wdt-200 mt-4 mr-2" value="customer" title={__('Add Customer', 'bit - integrations')} subTitle={__('Add Customer')} />}
      {flowluConf.actionName === 'project' && <TableCheckBox checked={flowluConf?.selectedProjectOpportunity?.length || false} onChange={(e) => actionHandler(e, 'projectOpportunity')} className="wdt-200 mt-4 mr-2" value="projectOpportunity" title={__('Add Project Opportunity', 'bit - integrations')} subTitle={__('Add Project Opportunity')} />}
      {flowluConf.actionName === 'project' && <TableCheckBox checked={flowluConf?.selectedManager?.length || false} onChange={(e) => actionHandler(e, 'manager')} className="wdt-200 mt-4 mr-2" value="manager" title={__('Add Project Manager', 'bit - integrations')} subTitle={__('Add Project Manager')} />}
      {flowluConf.actionName === 'project' && <TableCheckBox checked={flowluConf?.selectedProjectStage?.length || false} onChange={(e) => actionHandler(e, 'projectStage')} className="wdt-200 mt-4 mr-2" value="projectStage" title={__('Add Project Stage', 'bit - integrations')} subTitle={__('Add Project Stage')} />}
      {flowluConf.actionName === 'project' && <TableCheckBox checked={flowluConf?.selectedPortfolio?.length || false} onChange={(e) => actionHandler(e, 'portfolio')} className="wdt-200 mt-4 mr-2" value="portfolio" title={__('Add Project Portfolio', 'bit - integrations')} subTitle={__('Add Project Portfolio')} />}


      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'category'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Category', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Category', 'bit-integrations')}
        </div>
        {
          loading.accountCategories ? (
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
                  options={flowluConf?.accountCategories?.map(category => ({ label: category.name, value: `${category.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedCategory}
                  onChange={val => setChanges(val, 'selectedCategory')}
                  singleSelect
                  closeOnSelect
                />
                <button onClick={() => getAllAccountCategories(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Categories', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'industry'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Industry', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Industry', 'bit-integrations')}
        </div>
        {
          loading.industry ? (
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
                  options={flowluConf?.industries?.map(industry => ({ label: industry.name, value: `${industry.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedIndustry}
                  onChange={val => setChanges(val, 'selectedIndustry')}
                  singleSelect
                />
                <button onClick={() => getAllIndustry(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Industry', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
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
        title={__('Add Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Source', 'bit-integrations')}
        </div>
        {
          loading.source ? (
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
                  options={flowluConf?.sources?.map(source => ({ label: source.name, value: `${source.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedSource}
                  onChange={val => setChanges(val, 'selectedSource')}
                  singleSelect
                />
                <button onClick={() => getAllSource(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Source', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'customer'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Customer', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Customer', 'bit-integrations')}
        </div>
        {
          loading.customer ? (
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
                  options={flowluConf?.customers?.map(customer => ({ label: customer.name || customer.id, value: `${customer.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedCustomer}
                  onChange={val => setChanges(val, 'selectedCustomer')}
                  singleSelect
                />
                <button onClick={() => getAllCustomer(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Customer', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'manager'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Project Manager', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Project Manager', 'bit-integrations')}
        </div>
        {
          loading.manager ? (
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
                  options={flowluConf?.managers?.map(manager => ({ label: manager.name, value: `${manager.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedManager}
                  onChange={val => setChanges(val, 'selectedManager')}
                  singleSelect
                />
                <button onClick={() => getAllManagers(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Project Manager', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'projectStage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Project Stage', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Project Stage', 'bit-integrations')}
        </div>
        {
          loading.projectStage ? (
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
                  options={flowluConf?.projectStages?.map(stage => ({ label: stage.name, value: `${stage.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedProjectStage}
                  onChange={val => setChanges(val, 'selectedProjectStage')}
                  singleSelect
                />
                <button onClick={() => getAllProjectStage(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Project Stage', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'portfolio'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Project Portfolio', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Project Portfolio', 'bit-integrations')}
        </div>
        {
          loading.portfolio ? (
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
                  options={flowluConf?.portfolios?.map(portfolio => ({ label: portfolio.name, value: `${portfolio.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedPortfolio}
                  onChange={val => setChanges(val, 'selectedPortfolio')}
                  singleSelect
                />
                <button onClick={() => getAllPortfolio(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Project portfolio', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
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
        title={__('Add Project Priority', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Project Priority', 'bit-integrations')}
        </div>
        {
          loading.portfolio ? (
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
                  options={['Low', 'Medium', 'High']?.map(priority => ({ label: priority, value: priority }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedPriority}
                  onChange={val => setChanges(val, 'selectedPriority')}
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
        show={actionMdl.show === 'projectOpportunity'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Project Opportunity', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Project Opportunity', 'bit-integrations')}
        </div>
        {
          loading.projectOpportunity ? (
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
                  options={flowluConf?.projectOpportunities?.map(Opportunity => ({ label: Opportunity.name, value: `${Opportunity.id}` }))}
                  className="msl-wrp-options"
                  defaultValue={flowluConf?.selectedProjectOpportunity}
                  onChange={val => setChanges(val, 'selectedProjectOpportunity')}
                  singleSelect
                />
                <button onClick={() => getAllProjectOpportunity(flowluConf, setFlowluConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Project Opportunity', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
    </div>
  )
}

