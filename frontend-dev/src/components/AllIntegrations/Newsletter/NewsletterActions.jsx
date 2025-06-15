/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from '../../Utilities/Cooltip'
import { listsOptions } from './NewsletterCommonFunc'

export default function NewsletterActions({ newsletterConf, setNewsletterConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e) => {
    const newConf = { ...newsletterConf }
    if (e.target.checked) {
      newConf.actions.lists = true
    } else {
      delete newConf.actions.lists
    }
    setActionMdl({ show: 'lists' })
    setNewsletterConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...newsletterConf }
    newConf[type] = val
    setNewsletterConf({ ...newConf })
  }

  const getListsOptions = listsOptions()

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={newsletterConf.selectedLists || false}
        onChange={(e) => actionHandler(e)}
        className="wdt-200 mt-4 mr-2"
        value="select_lists"
        title={__('Select Lists', 'bit-integrations')}
        subTitle={__('Choose which lists to add subscribers to.', 'bit-integrations')}
      />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lists'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lists', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 flx">
          {__('Select Lists', 'bit-integrations')}
          <Cooltip width={250} icnSize={17} className="ml-1">
            <div className="txt-body">
              {__('Subscribers will be associated with the selected lists', 'bit-integrations')}
            </div>
          </Cooltip>
        </div>
        <div className="mt-2">
          <MultiSelect
            options={getListsOptions}
            className="msl-wrp-options"
            defaultValue={newsletterConf?.selectedLists}
            onChange={(val) => setChanges(val, 'selectedLists')}
            style={{ width: '100%' }}
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
