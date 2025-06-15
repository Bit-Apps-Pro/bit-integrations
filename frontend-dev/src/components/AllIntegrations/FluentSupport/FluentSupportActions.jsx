/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Loader from '../../Loaders/Loader'
import { getAllBusinessInboxes, supportStaff } from './FluentSupportCommonFunc'

export default function FluentSupportActions({ fluentSupportConf, setFluentSupportConf, formID, formFields, setSnackbar }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ) => {
    const newConf = { ...fluentSupportConf }
    if (typ === 'support_staff') {
      if (val !== '') {
        newConf.actions.support_staff = val
      } else {
        delete newConf.actions.support_staff
      }
    } else if (typ === 'client_priority') {
      if (val !== '') {
        newConf.actions.client_priority = val
      } else {
        delete newConf.actions.client_priority
      }
    } else if (typ === 'business_inbox') {
      if (val !== '') {
        newConf.actions.business_inbox = val
      } else {
        delete newConf.actions.business_inbox
      }
    }

    setFluentSupportConf({ ...newConf })
  }

  const options = [
    { label: 'Normal', value: 'normal' },
    { label: 'Critical', value: 'critical' },
    { label: 'Medium', value: 'medium' },
  ]

  const openRecOwnerModal = () => {
    if (!fluentSupportConf.default?.agents) {
      supportStaff(formID, fluentSupportConf, setFluentSupportConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'support_staff' })
  }
  const openBusinessInboxModal = () => {
    if (!fluentSupportConf.default?.businessInboxes) {
      getAllBusinessInboxes(formID, fluentSupportConf, setFluentSupportConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'business_inboxes' })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TableCheckBox onChange={openRecOwnerModal} checked={'support_staff' in fluentSupportConf.actions} className="wdt-200 mt-4 mr-2" value="support_staff" title={__('Support Staff', 'bit-integrations')} subTitle={__('Add a Support Staff to ticket pushed to fluentSupport.', 'bit-integrations')} />
          {!fluentSupportConf.actions.support_staff && <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{__('Support Staff is required', 'bit-integrations')}</small>}
        </div>
        <TableCheckBox onChange={openBusinessInboxModal} checked={'business_inbox' in fluentSupportConf.actions} className="wdt-200 mt-4 mr-2" value="business_inbox" title={__('Business Inbox', 'bit-integrations')} subTitle={__('Add Business Inbox on Ticket in fluentSupport.', 'bit-integrations')} />
        <TableCheckBox onChange={() => setActionMdl({ show: 'client_priority' })} checked={'client_priority' in fluentSupportConf.actions} className="wdt-200 mt-4 mr-2" value="client_priority" title={__('Client Priority', 'bit-integrations')} subTitle={__('Add Client Priority on Ticket in fluentSupport.', 'bit-integrations')} />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'support_staff'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Ticket Owner', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={fluentSupportConf.actions.support_staff}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'support_staff')}
              >
                <option value="">{__('Select Support Staff', 'bit-integrations')}</option>
                {fluentSupportConf?.default?.agents && fluentSupportConf.default.agents.map(staff => <option key={staff.id} value={`${staff.id}`}>{`${staff.first_name || staff.last_name ? staff.first_name + ' ' + staff.last_name : staff.email}`}</option>)}
              </select>
              <button onClick={() => supportStaff(formID, fluentSupportConf, setFluentSupportConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Support Staff"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'client_priority'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Select Priority', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Select client priority to ticket.', 'bit-integrations')}</div>
        <MultiSelect
          singleSelect
          defaultValue={fluentSupportConf.actions.client_priority}
          className="mt-2 w-9"
          onChange={(val) => actionHandler(val, 'client_priority')}
          options={options}
        />
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'business_inboxes'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Business Inbox', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={fluentSupportConf.actions.business_inbox}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'business_inbox')}
              >
                <option value="">{__('Select Business Inbox', 'bit-integrations')}</option>
                {fluentSupportConf?.default?.businessInboxes && fluentSupportConf.default.businessInboxes.map(inbox => <option key={inbox.id} value={`${inbox.id}`}>{inbox.name}</option>)}
              </select>
              <button onClick={() => getAllBusinessInboxes(formID, fluentSupportConf, setFluentSupportConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Support Staff"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>
    </div>
  )
}
