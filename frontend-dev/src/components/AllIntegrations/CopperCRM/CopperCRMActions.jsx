/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import {
  getAllOpportunities,
  getAllOwners,
  getAllCompanies,
  getAllPipelineStages
} from './CopperCRMCommonFunc'

export default function CopperCRMActions({ coppercrmConf, setCopperCRMConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })

  const followUps = [
    { label: __('Yes', 'bit-integrations'), value: 'yes' },
    { label: __('No', 'bit-integrations'), value: 'no' }
  ]

  const opportunityTypes = [
    { label: __('New Business', 'bit-integrations'), value: 'New Business' },
    { label: __('Existing Business', 'bit-integrations'), value: 'Existing Business' }
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...coppercrmConf }

    if (type === 'opportunity') {
      if (e.target?.checked) {
        getAllOpportunities(coppercrmConf, setCopperCRMConf, setLoading)
        newConf.actions.opportunity = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.opportunity
      }
    } else if (type === 'owner') {
      if (e.target?.checked) {
        getAllOwners(coppercrmConf, setCopperCRMConf, setLoading)
        newConf.actions.owner = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.owner
      }
    } else if (type === 'company') {
      if (e.target?.checked) {
        getAllCompanies(coppercrmConf, setCopperCRMConf, setLoading)
        newConf.actions.company = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.company
      }
    } else if (type === 'pipelineStage') {
      if (e.target?.checked) {
        getAllPipelineStages(coppercrmConf, setCopperCRMConf, setLoading)
        newConf.actions.pipelineStage = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.pipelineStage
      }
    } else if (type === 'followUp') {
      if (e.target?.checked) {
        newConf.actions.followUp = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.followUp
      }
    } else if (type === 'opportunityType') {
      if (e.target?.checked) {
        newConf.actions.opportunityType = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.opportunityType
      }
    }

    setActionMdl({ show: type })
    setCopperCRMConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...coppercrmConf }
    newConf[name] = val
    setCopperCRMConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {/* {(coppercrmConf.actionName === 'person') && <TableCheckBox checked={coppercrmConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add an company')} />} */}
      {(coppercrmConf.actionName === 'person' ||
        coppercrmConf.actionName === 'company' ||
        coppercrmConf.actionName === 'opportunity' ||
        coppercrmConf.actionName === 'task') && (
        <TableCheckBox
          checked={coppercrmConf?.selectedOwner?.length || false}
          onChange={(e) => actionHandler(e, 'owner')}
          className="wdt-200 mt-4 mr-2"
          value="owner"
          title={__('Add Owner', 'bit - integrations')}
          subTitle={__('Add an owner')}
        />
      )}
      {coppercrmConf.actionName === 'opportunity' && (
        <TableCheckBox
          checked={coppercrmConf?.selectedCompany?.length || false}
          onChange={(e) => actionHandler(e, 'company')}
          className="wdt-200 mt-4 mr-2"
          value="company"
          title={__('Add Company', 'bit - integrations')}
          subTitle={__('Add an company')}
        />
      )}
      {coppercrmConf.actionName === 'opportunity' && (
        <TableCheckBox
          checked={coppercrmConf?.selectedPipelineStage?.length || false}
          onChange={(e) => actionHandler(e, 'pipelineStage')}
          className="wdt-200 mt-4 mr-2"
          value="pipelineStage"
          title={__('Add PipelineStage', 'bit - integrations')}
          subTitle={__('Add a pipelineStage')}
        />
      )}
      {/* {(coppercrmConf.actionName === 'task') && <TableCheckBox checked={coppercrmConf?.selectedOpportunity?.length || false} onChange={(e) => actionHandler(e, 'opportunity')} className="wdt-200 mt-4 mr-2" value="opportunity" title={__('Add Opportunity', 'bit - integrations')} subTitle={__('Add a opportunity')} />} */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunity'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunities', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Opportunity', 'bit-integrations')}</div>
        {loading.opportunities ? (
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
              options={coppercrmConf?.opportunities?.map((opportunity) => ({
                label: opportunity.name,
                value: opportunity.id
              }))}
              className="msl-wrp-options"
              defaultValue={coppercrmConf?.selectedOpportunity}
              onChange={(val) => setChanges(val, 'selectedOpportunity')}
              singleSelect
            />
            <button
              onClick={() => getAllOpportunities(coppercrmConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Opportunities', 'bit-integrations')}'` }}
              type="button">
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
        show={actionMdl.show === 'owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Owners', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Owner', 'bit-integrations')}</div>
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
              options={coppercrmConf?.owners?.map((owner) => ({
                label: owner.name,
                value: owner.id
              }))}
              className="msl-wrp-options"
              defaultValue={coppercrmConf?.selectedOwner}
              onChange={(val) => setChanges(val, 'selectedOwner')}
              singleSelect
            />
            <button
              onClick={() => getAllOwners(coppercrmConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }}
              type="button">
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
        title={__('Companies', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Company', 'bit-integrations')}</div>
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
              options={coppercrmConf?.companies?.map((company) => ({
                label: company.name,
                value: company.id
              }))}
              className="msl-wrp-options"
              defaultValue={coppercrmConf?.selectedCompany}
              onChange={(val) => setChanges(val, 'selectedCompany')}
              singleSelect
            />
            <button
              onClick={() => getAllCompanies(coppercrmConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Companies', 'bit-integrations')}'` }}
              type="button">
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
        show={actionMdl.show === 'pipelineStage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('PipelineStages', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select PipelineStage', 'bit-integrations')}</div>
        {loading.pipelineStages ? (
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
              options={coppercrmConf?.pipelineStages?.map((pipelineStage) => ({
                label: pipelineStage.name,
                value: pipelineStage.id
              }))}
              className="msl-wrp-options"
              defaultValue={coppercrmConf?.selectedPipelineStage}
              onChange={(val) => setChanges(val, 'selectedPipelineStage')}
              singleSelect
            />
            <button
              onClick={() => getAllPipelineStages(coppercrmConf, setCopperCRMConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh PipelineStages', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>

      {/* <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
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
                  options={coppercrmConf?.statuses?.map(status => ({ label: status.name, value: status.id }))}
                  className="msl-wrp-options"
                  defaultValue={coppercrmConf?.selectedStatus}
                  onChange={val => setChanges(val, 'selectedStatus')}
                  singleSelect
                />
                <button onClick={() => getAllStatuses(coppercrmConf, setCopperCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh statuses', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal> */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'followUp'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Follow Up', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={followUps?.map((followUp) => ({
              label: followUp.label,
              value: followUp.value
            }))}
            className="msl-wrp-options"
            defaultValue={coppercrmConf?.selectedFollowUp}
            onChange={(val) => setChanges(val, 'selectedFollowUp')}
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunityType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity types', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={opportunityTypes?.map((opportunityType) => ({
              label: opportunityType.label,
              value: opportunityType.value
            }))}
            className="msl-wrp-options"
            defaultValue={coppercrmConf?.selectedOpportunityType}
            onChange={(val) => setChanges(val, 'selectedOpportunityType')}
            singleSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
