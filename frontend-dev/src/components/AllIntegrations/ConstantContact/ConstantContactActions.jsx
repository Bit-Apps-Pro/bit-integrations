/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllContactLists, getContactTags } from './ConstantContactCommonFunc'

export default function ConstantContactActions({ id, constantContactConf, setConstantContactConf, address, phone, isLoading, setIsLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...constantContactConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    if (type === 'list_ids') {
      getAllContactLists(
        id,
        constantContactConf,
        setConstantContactConf,
        isLoading,
        setIsLoading,
      )
      if (e.target.checked) {
        newConf.actions.list = true
      } else {
        delete newConf.actions.list
      }
      setActionMdl({ show: type })
    }
    if (type === 'tag_ids') {
      getContactTags(
        id,
        constantContactConf,
        setConstantContactConf,
        isLoading,
        setIsLoading,
      )
      if (e.target.checked) {
        newConf.actions.tag = true
      } else {
        delete newConf.actions.tag
      }
      setActionMdl({ show: type })
    }
    if (type === 'address_type') {
      if (e.target.checked) {
        newConf.actions.address = true
        newConf.address_field = address
          .filter((addr) => addr.required)
          .map((adr) => ({
            formField: '',
            constantContactAddressField: adr.tag,
            required: true,
          }))
      } else if (constantContactConf.address_type === '') {
        delete newConf.actions.address
        newConf.address_field = ''
      }
      setActionMdl({ show: type })
    }
    if (type === 'phone_type') {
      if (e.target.checked) {
        newConf.actions.phone = true
        newConf.phone_field = phone
          .filter((item) => item.required)
          .map((ph) => ({
            formField: '',
            constantContactPhoneField: ph.tag,
            required: true,
          }))
      } else if (constantContactConf.phone_type === '') {
        delete newConf.actions.phone
        newConf.phone_field = ''
      }
      setActionMdl({ show: type })
    }
    setConstantContactConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...constantContactConf }
    if (type === 'list_ids' && val.length) {
      newConf.actions.list = true
      newConf.actions.update = true
    } else if (type === 'list_ids' && val.length < 1) {
      delete newConf.actions.list
    }
    if (type === 'address_type' && val.length) {
      newConf.actions.address = true
    } else if (type === 'address_type' && val.length < 1) {
      delete newConf.actions.address
      newConf.address_field = []
    }
    if (type === 'phone_type' && val.length) {
      newConf.actions.phone = true
    } else if (type === 'phone_type' && val.length < 1) {
      delete newConf.actions.phone
      newConf.phone_field = []
    }
    newConf[type] = val
    setConstantContactConf({ ...newConf })
  }

  const addressTypes = [
    {
      label: 'Home',
      value: 'home',
    },
    {
      label: 'Work',
      value: 'work',
    },

    {
      label: 'Other',
      value: 'other',
    },
  ]

  const phoneTypes = [
    {
      label: 'Home',
      value: 'home',
    },
    {
      label: 'Work',
      value: 'work',
    },
    {
      label: 'Mobile',
      value: 'mobile',
    }, {
      label: 'Fax',
      value: 'fax',
    },

    {
      label: 'Other',
      value: 'other',
    },
  ]

  return (
    <>
      <div className="pos-rel d-flx w-8">
        <TableCheckBox
          checked={constantContactConf?.address_type || false}
          onChange={(e) => actionHandler(e, 'address_type')}
          className="wdt-200 mt-4 mr-2"
          value="address"
          title={__('Add Address Field', 'bit-integrations')}
          subTitle={__('Add Address Field', 'bit-integrations')}
        />
        <TableCheckBox
          checked={constantContactConf?.phone_type || false}
          onChange={(e) => actionHandler(e, 'phone_type')}
          className="wdt-200 mt-4 mr-2"
          value="phone"
          title={__('Add Phone Field', 'bit-integrations')}
          subTitle={__('Add Phone Field', 'bit-integrations')}
        />
        <TableCheckBox
          checked={constantContactConf.tag_ids.length || false}
          onChange={(e) => actionHandler(e, 'tag_ids')}
          className="wdt-200 mt-4 mr-2"
          value="tag_ids"
          title={__('Tags', 'bit-integrations')}
          subTitle={__('Add Tags', 'bit-integrations')}
        />
        <TableCheckBox
          checked={constantContactConf?.list_ids.length || false}
          onChange={(e) => actionHandler(e, 'list_ids')}
          className="wdt-200 mt-4 mr-2"
          value="list_ids"
          title={__('Lists', 'bit-integrations')}
          subTitle={__('Add Lists', 'bit-integrations')}
        />

      </div>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'address_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Address Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        <div className="flx flx-between mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={constantContactConf?.address_type}
            options={addressTypes.map((type) => ({
              label: type.label,
              value: type.value,
            }))}
            onChange={(val) => setChanges(val, 'address_type')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'phone_type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Phone Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        <div className="flx flx-between mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={constantContactConf?.phone_type}
            options={phoneTypes.map((type) => ({
              label: type.label,
              value: type.value,
            }))}
            onChange={(val) => setChanges(val, 'phone_type')}
            customValue
            singleSelect
          />
        </div>
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'list_ids'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lists', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading.list ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={constantContactConf?.list_ids}
              options={constantContactConf?.lists?.map((list) => ({
                label: list.listName,
                value: list.listId,
              }))}
              onChange={(val) => setChanges(val, 'list_ids')}
              customValue
            />
            <button
              onClick={() => getAllContactLists(
                constantContactConf,
                setConstantContactConf,
                isLoading,
                setIsLoading,
              )}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Lists ', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading.list}
            >
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
      {' '}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag_ids'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        {isLoading.tag ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={constantContactConf?.tag_ids}
              options={constantContactConf?.tags?.map((tag) => ({
                label: tag.tagName,
                value: tag.tagId,
              }))}
              onChange={(val) => setChanges(val, 'tag_ids')}
              customValue
            />
            <button
              onClick={() => getContactTags(
                constantContactConf,
                setConstantContactConf,
                isLoading,
                setIsLoading,
              )}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Tags ', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading.tag}
            >
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
    </>
  )
}
