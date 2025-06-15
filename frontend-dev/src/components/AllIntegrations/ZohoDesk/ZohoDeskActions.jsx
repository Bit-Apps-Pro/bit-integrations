/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Loader from '../../Loaders/Loader'
import { refreshOwners, refreshProducts } from './ZohoDeskCommonFunc'

export default function ZohoDeskActions({ deskConf, setDeskConf, formID, formFields, setSnackbar }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ) => {
    const newConf = { ...deskConf }
    if (typ === 'ticket_owner') {
      if (val !== '') {
        newConf.actions.ticket_owner = val
      } else {
        delete newConf.actions.ticket_owner
      }
    } else if (typ === 'product') {
      if (val !== '') {
        newConf.actions.product = val
      } else {
        delete newConf.actions.product
      }
    } else if (typ === 'attachments') {
      if (val !== '') {
        newConf.actions.attachments = val
      } else {
        delete newConf.actions.attachments
      }
    }

    setDeskConf({ ...newConf })
  }

  const openRecOwnerModal = () => {
    if (!deskConf.default?.owners?.[deskConf.orgId]) {
      refreshOwners(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'ticket_owner' })
  }

  const openProductModal = () => {
    if (!deskConf.default?.products?.[deskConf.department]) {
      refreshProducts(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'product' })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TableCheckBox onChange={openRecOwnerModal} checked={'ticket_owner' in deskConf.actions} className="wdt-200 mt-4 mr-2" value="Ticket_Owner" title={__('Ticket Owner', 'bit-integrations')} subTitle={__('Add a owner to ticket pushed to Zoho Desk.', 'bit-integrations')} />
          {!deskConf.actions.ticket_owner && <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{__('ticket owner is required', 'bit-integrations')}</small>}
        </div>
        <TableCheckBox onChange={openProductModal} checked={'product' in deskConf.actions} className="wdt-200 mt-4 mr-2" value="Product_Name" title={__('Product Name', 'bit-integrations')} subTitle={__('Add a product to ticket pushed to Zoho Desk.', 'bit-integrations')} />
        <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in deskConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Attachments', 'bit-integrations')} subTitle={__('Add attachments from trigger-end to ticket pushed to Zoho Desk.', 'bit-integrations')} />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'ticket_owner'}
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
                value={deskConf.actions.ticket_owner}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'ticket_owner')}
              >
                <option value="">{__('Select Owner', 'bit-integrations')}</option>
                {deskConf.default?.owners?.[deskConf.orgId]?.map(owner => <option key={owner.ownerId} value={owner.ownerId}>{owner.ownerName}</option>)}
              </select>
              <button onClick={() => refreshOwners(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Ticket Owners"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'product'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Product Name', 'bit-integrations')}
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
        ) : (
          <div className="flx flx-between mt-2">
            <select
              value={deskConf.actions.product}
              className="btcd-paper-inp"
              onChange={e => actionHandler(e.target.value, 'product')}
            >
              <option value="">{__('Select Product', 'bit-integrations')}</option>
              {deskConf.default?.products?.[deskConf.department]?.map(product => <option key={product.productId} value={product.productId}>{product.productName}</option>)}
            </select>
            <button onClick={() => refreshProducts(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Products"' }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'attachments'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Select Attachment', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Select file upload fields', 'bit-integrations')}</div>
        <MultiSelect
          defaultValue={deskConf.actions.attachments}
          className="mt-2 w-9"
          onChange={(val) => actionHandler(val, 'attachments')}
          options={formFields.filter(itm => (itm.type === 'file')).map(itm => ({ label: itm.label, value: itm.name }))}
        />
      </ConfirmModal>
    </div>
  )
}
