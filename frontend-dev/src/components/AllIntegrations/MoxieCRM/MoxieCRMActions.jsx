/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { getAllClients, getAllPipelineStages } from './MoxieCRMCommonFunc'

export default function MoxieCRMActions({ moxiecrmConf, setMoxieCRMConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const followUps = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]

  const opportunityTypes = [
    { label: 'New Business', value: 'New Business' },
    { label: 'Existing Business', value: 'Existing Business' },
  ]

  const recordTypes = [
    { label: 'Client', value: 'Client' },
    { label: 'Prospect', value: 'Prospect' },
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...moxiecrmConf }

    if (type === 'opportunity') {
      if (e.target?.checked) {
        getAllOpportunities(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.opportunity = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.opportunity
      }
    } else if (type === 'client') {
      if (e.target?.checked) {
        getAllClients(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.client = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.client
      }
    } else if (type === 'pipelineStage') {
      if (e.target?.checked) {
        getAllPipelineStages(moxiecrmConf, setMoxieCRMConf, setLoading)
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
    setMoxieCRMConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...moxiecrmConf }
    newConf[name] = val
    setMoxieCRMConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {((moxiecrmConf.actionName === 'contact') || (moxiecrmConf.actionName === 'opportunity')) && <TableCheckBox checked={moxiecrmConf?.selectedClient?.length || false} onChange={(e) => actionHandler(e, 'client')} className="wdt-200 mt-4 mr-2" value="client" title={__('Add Client', 'bit - integrations')} subTitle={__('Add an client')} />}
      {(moxiecrmConf.actionName === 'opportunity') && <TableCheckBox checked={moxiecrmConf?.selectedPipelineStage?.length || false} onChange={(e) => actionHandler(e, 'pipelineStage')} className="wdt-200 mt-4 mr-2" value="pipelineStage" title={__('Add PipelineStage', 'bit - integrations')} subTitle={__('Add a pipelineStage')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'client'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Clients', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Client', 'bit-integrations')}
        </div>
        {
          loading.clients ? (
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
                  options={moxiecrmConf?.clients?.map(client => ({ label: client.name, value: client.name }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedClient}
                  onChange={val => setChanges(val, 'selectedClient')}
                  singleSelect
                />
                <button onClick={() => getAllClients(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Clients', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'pipelineStage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('PipelineStages', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select PipelineStage', 'bit-integrations')}
        </div>
        {
          loading.pipelineStages ? (
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
                  options={moxiecrmConf?.pipelineStages?.map(pipelineStage => ({ label: pipelineStage.name, value: pipelineStage.name }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedPipelineStage}
                  onChange={val => setChanges(val, 'selectedPipelineStage')}
                  singleSelect
                />
                <button onClick={() => getAllPipelineStages(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh PipelineStages', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
    </div>
  )
}
