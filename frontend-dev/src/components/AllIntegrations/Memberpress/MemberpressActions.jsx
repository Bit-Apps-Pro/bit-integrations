/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { paymentGateway } from './MemberpressCommonFunc'

export default function MemberpressActions({ memberpressConf, setMemberpressConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const status = [
    { key: 'complete', label: 'Complete' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
  ]
  const actionHandler = (e, gateway) => {
    const newConf = { ...memberpressConf }
    if (gateway === 'status') {
      if (e.target?.checked) {
        newConf.actions.status = true
        setActionMdl({ show: 'status' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.status
      }
    } if (gateway === 'gateway') {
      if (e.target?.checked) {
        newConf.actions.gateway = true
        setActionMdl({ show: 'gateway' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.gateway
      }
    }

    setMemberpressConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const changeHandler = (val, name) => {
    const newConf = { ...memberpressConf }
    if (name === 'statusId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'gatewayId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    setMemberpressConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={memberpressConf?.actions?.status || false} onChange={(e) => actionHandler(e, 'status')} className="wdt-200 mt-4 mr-2" value="status" title={__('Add Status', 'bit-integrations')} subTitle={__('Add status of Membership', 'bit-integrations')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Status ', 'bit-integrations')}</div>
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
                defaultValue={memberpressConf?.statusId}
                options={status.map((item) => ({ label: item.label, value: item.key }))}
                onChange={(val) => changeHandler(val, 'statusId')}
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

      <TableCheckBox checked={memberpressConf?.actions?.gateway || false} onChange={(e) => actionHandler(e, 'gateway')} className="wdt-200 mt-4 mr-2" value="gateway" title={__('Add Type', 'bit-integrations')} subTitle={__('Add Type', 'bit-integrations')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'gateway'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Gateway', 'bit-integrations')}</div>
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
                defaultValue={memberpressConf?.gatewayId}
                options={memberpressConf?.default?.allPaymentMethods && memberpressConf.default.allPaymentMethods.map((item) => ({ label: item.paymentTitle, value: item.paymentId }))}
                onChange={(val) => changeHandler(val, 'gatewayId')}
                singleSelect
              />
              <button onClick={() => paymentGateway(memberpressConf, setMemberpressConf, setIsLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Payment Gateway"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}

      </ConfirmModal>

    </div>
  )
}
