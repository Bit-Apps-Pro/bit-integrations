/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function DiscordActions({ formFields, discordConf, setDiscordConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e) => {
    const newConf = { ...discordConf }
    if (e.target.value !== '') {
      newConf.actions.attachments = e.target.value
    } else {
      delete newConf.actions.attachments
    }
    setDiscordConf({ ...newConf })
  }
  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in discordConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Attachments', 'bit-integrations')} subTitle={__('Add attachments from Bit Integrations to send Discord.', 'bit-integrations')} />
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
        <select onChange={(e) => actionHandler(e)} name="attachments" value={discordConf.actions?.attachments} className="btcd-paper-inp w-10 mt-2">
          <option value="">{__('Select file upload field', 'bit-integrations')}</option>
          {
            formFields.filter(itm => (itm.type === 'file')).map(itm => (
              <option key={itm.name + 1} value={itm.name}>
                {itm.label}
              </option>
            ))
          }
        </select>
      </ConfirmModal>
    </div>
  )
}
