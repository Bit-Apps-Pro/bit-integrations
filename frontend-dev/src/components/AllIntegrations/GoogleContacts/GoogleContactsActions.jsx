/* eslint-disable no-param-reassign */
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import Modal from '../../Utilities/Modal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import TitleModal from '../../Utilities/TitleModal'
import Loader from '../../Loaders/Loader'

export default function GoogleContactsActions({ googleContactsConf, setGoogleContactsConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...googleContactsConf }
    if (type === 'Attachments') {
      if (e.target.value !== '') {
        newConf.actions.attachments = e.target.value
      } else {
        delete newConf.actions.attachments
      }
    }

    setGoogleContactsConf({ ...newConf })
  }

  return (

    <div className="d-flx wdt-200">
      <div className="pos-rel d-flx w-8l">
        <div className="d-flx flx-wrp">
          <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in googleContactsConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Photo', 'bit-integrations')} subTitle={__('Add picture on google contact account.', 'bit-integrations')} />
        </div>

        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="blue"
          btnTxt="Ok"
          show={actionMdl.show === 'attachments'}
          close={() => setActionMdl({ show: false })}
          action={() => setActionMdl({ show: false })}
          title={__('Select Attachment', 'bit-integrations')}
        >
          <div className="btcd-hr mt-2" />
          <div className="mt-2">{__('Please select file upload fields', 'bit-integrations')}</div>
          <select onChange={(e) => actionHandler(e, 'Attachments')} name="attachments" value={googleContactsConf.actions?.attachments} className="btcd-paper-inp w-10 mt-2">
            <option value="">{__('Select file upload field', 'bit-integrations')}</option>
            {
              formFields?.filter(itm => (itm.type === 'file')).map(itm => (
                <option key={itm.name + 1} value={itm.name}>
                  {itm.label}
                </option>
              ))
            }
          </select>
        </ConfirmModal>
      </div>

    </div>
  )
}
