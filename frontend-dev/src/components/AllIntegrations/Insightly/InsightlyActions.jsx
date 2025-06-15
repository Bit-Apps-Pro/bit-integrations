/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { getAllOrganisations, getAllCategories, getAllStatuses } from './InsightlyCommonFunc'

export default function InsightlyActions({ insightlyConf, setInsightlyConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const followUps = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]

  const opportunityTypes = [
    { label: 'New Business', value: 'New Business' },
    { label: 'Existing Business', value: 'Existing Business' },
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...insightlyConf }

    if (type === 'organisation') {
      if (e.target?.checked) {
        getAllOrganisations(insightlyConf, setInsightlyConf, setLoading)
        newConf.actions.organisation = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.organisation
      }
    } else if (type === 'category') {
      if (e.target?.checked) {
        getAllCategories(insightlyConf, setInsightlyConf, setLoading)
        newConf.actions.category = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.category
      }
    } else if (type === 'status') {
      if (e.target?.checked) {
        getAllStatuses(insightlyConf, setInsightlyConf, setLoading)
        newConf.actions.status = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.status
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
    setInsightlyConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...insightlyConf }
    newConf[name] = val
    setInsightlyConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {(insightlyConf.actionName === 'contact' || insightlyConf.actionName === 'opportunity') && <TableCheckBox checked={insightlyConf?.selectedOrganisation?.length || false} onChange={(e) => actionHandler(e, 'organisation')} className="wdt-200 mt-4 mr-2" value="organisation" title={__('Add Organisation', 'bit - integrations')} subTitle={__('Add an organisation')} />}
      {(insightlyConf.actionName === 'opportunity' || insightlyConf.actionName === 'project' || insightlyConf.actionName === 'task') && <TableCheckBox checked={insightlyConf?.selectedCategory?.length || false} onChange={(e) => actionHandler(e, 'category')} className="wdt-200 mt-4 mr-2" value="category" title={__('Add Category', 'bit - integrations')} subTitle={__('Add a category')} />}


      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'organisation'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Organisations', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Organisation', 'bit-integrations')}
        </div>
        {
          loading.organisations ? (
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
                  options={insightlyConf?.organisations?.map(organisation => ({ label: organisation.name, value: organisation.id }))}
                  className="msl-wrp-options"
                  defaultValue={insightlyConf?.selectedOrganisation}
                  onChange={val => setChanges(val, 'selectedOrganisation')}
                  singleSelect
                />
                <button onClick={() => getAllOrganisations(insightlyConf, setInsightlyConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Organisations', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'category'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Categories', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Category', 'bit-integrations')}
        </div>
        {
          loading.categories ? (
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
                  options={insightlyConf?.categories?.map(category => ({ label: category.name, value: category.id }))}
                  className="msl-wrp-options"
                  defaultValue={insightlyConf?.selectedCategory}
                  onChange={val => setChanges(val, 'selectedCategory')}
                  singleSelect
                />
                <button onClick={() => getAllCategories(insightlyConf, setInsightlyConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Categories', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
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
                  options={insightlyConf?.statuses?.map(status => ({ label: status.name, value: status.id }))}
                  className="msl-wrp-options"
                  defaultValue={insightlyConf?.selectedStatus}
                  onChange={val => setChanges(val, 'selectedStatus')}
                  singleSelect
                />
                <button onClick={() => getAllStatuses(insightlyConf, setInsightlyConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh statuses', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

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
            defaultValue={insightlyConf?.selectedFollowUp}
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
        show={actionMdl.show === 'opportunityType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity types', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={opportunityTypes?.map(opportunityType => ({ label: opportunityType.label, value: opportunityType.value }))}
            className="msl-wrp-options"
            defaultValue={insightlyConf?.selectedOpportunityType}
            onChange={val => setChanges(val, 'selectedOpportunityType')}
            singleSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
