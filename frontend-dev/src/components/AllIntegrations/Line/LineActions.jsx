/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { create } from 'mutative'

export default function LineUtilities({ formFields, lineConf, setLineConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (e, type) => {
    setLineConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[type] = e.target?.checked || false
      })
    )
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox
          checked={lineConf?.sendEmojis || false}
          onChange={e => actionHandler(e, 'sendEmojis')}
          className="wdt-200 mt-4 mr-2"
          value="sendEmojis"
          title={__('Send Emojis', 'bit-integrations')}
          subTitle={__('If want add more field in Emojis', 'bit-integrations')}
        />
        <TableCheckBox
          checked={lineConf?.sendSticker || false}
          onChange={e => actionHandler(e, 'sendSticker')}
          className="wdt-200 mt-4 mr-2"
          value="sendSticker"
          title={__('Send Sticker', 'bit-integrations')}
          subTitle={__('If want add more field in Stickers', 'bit-integrations')}
        />
        <TableCheckBox
          checked={lineConf?.sendImage || false}
          onChange={e => actionHandler(e, 'sendImage')}
          className="wdt-200 mt-4 mr-2"
          value="sendImage"
          title={__('Send Image', 'bit-integrations')}
          subTitle={__('If want add more field in Images', 'bit-integrations')}
        />
        <TableCheckBox
          checked={lineConf?.sendAudio || false}
          onChange={e => actionHandler(e, 'sendAudio')}
          className="wdt-200 mt-4 mr-2"
          value="sendAudio"
          title={__('Send audio', 'bit-integrations')}
          subTitle={__('If want add more field in Audio', 'bit-integrations')}
        />
        <TableCheckBox
          checked={lineConf?.sendVideo || false}
          onChange={e => actionHandler(e, 'sendVideo')}
          className="wdt-200 mt-4 mr-2"
          value="sendVideo"
          title={__('Send video', 'bit-integrations')}
          subTitle={__('If want add more field in Video', 'bit-integrations')}
        />
      </div>

      {/* <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt="Ok"
        show={actionMdl.show === 'attachments'}
        close={() => setActionMdl({ show: false })}
        action={() => setActionMdl({ show: false })}
        title={__('Select Attachment', 'bit-integrations')}>
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Please select file upload fields', 'bit-integrations')}</div>
        <select
          onChange={e => actionHandler(e)}
          name="attachments"
          value={lineConf.actions?.attachments}
          className="btcd-paper-inp w-10 mt-2">
          <option value="">{__('Select file upload field', 'bit-integrations')}</option>
          {formFields
            .filter(itm => itm.type === 'file')
            .map(itm => (
              <option key={itm.name + 1} value={itm.name}>
                {itm.label}
              </option>
            ))}
        </select>
      </ConfirmModal> */}
    </div>
  )
}
