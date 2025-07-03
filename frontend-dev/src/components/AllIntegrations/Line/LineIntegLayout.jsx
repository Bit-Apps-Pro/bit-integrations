import { create } from 'mutative'
import { useRef } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import TableCheckBox from '../../Utilities/TableCheckBox'
import TinyMCE from '../../Utilities/TinyMCE'
import LineFieldMap from './LineFieldMap'
import LineUtilities from './LineActions'
import { addFieldMap } from './LineCommonFunc'
import AddFieldButton from './AddFieldButton'

export default function LineIntegLayout({ formFields, lineConf, setLineConf, isLoading }) {
  const textAreaRef = useRef(null)
  const { isPro } = btcbi

  const handleInput = e => {
    const newConf = { ...lineConf }
    newConf[e.target.name] = e.target.value
    console.log('first', lineConf)
    setLineConf(newConf)
  }

  const setMessageBody = val => {
    const newConf = { ...lineConf }
    newConf.body = val
    setLineConf(newConf)
  }
  const changeActionRun = e => {
    const newConf = { ...lineConf }
    if (newConf?.body) {
      newConf.body = ''
    }
    newConf.parse_mode = e.target.value
    setLineConf(newConf)
  }

  const setChange = (value, name) => {
    setLineConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = value

        if (isPro) {
          if (name === 'messageType' && value === 'sendReplyMessage') {
            draftConf['taskNote'] = textMsgNote
          } else if (name === 'messageType') {
            delete draftConf?.taskNote
          }
        }
      })
    )
  }
  console.log(lineConf?.sendEmojis)

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Message Type:', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={lineConf?.messageType}
          className="mt-2 w-6"
          onChange={val => setChange(val, 'messageType')}
          options={lineConf?.messageTypes?.map(messageType => ({
            label: checkIsPro(isPro, messageType.is_pro)
              ? messageType.label
              : getProLabel(messageType.label),
            value: messageType.name,
            disabled: checkIsPro(isPro, messageType.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>
      <br />

      {(lineConf?.messageType === 'sendPushMessage' ||
        lineConf?.messageType === 'sendBroadcastMessage') &&
        isPro && (
          <>
            <div>
              <b className="wdt-200 d-in-b mb-4 mt-4">{__('Recipient ID:', 'bit-integrations')}</b>
              <input
                className="btcd-paper-inp w-6 mt-1"
                onChange={handleInput}
                name="recipientId"
                value={lineConf.recipientId}
                type="text"
                placeholder={__('Recipient ID', 'bit-integrations')}
              />
            </div>
            <div>
              <b className="wdt-200 d-in-b mb-4 mt-4">{__('Message:', 'bit-integrations')}</b>
              <input
                className="btcd-paper-inp w-6 mt-1"
                onChange={handleInput}
                name="message"
                value={lineConf.message}
                type="text"
                placeholder={__('Message', 'bit-integrations')}
              />
            </div>
          </>
        )}

      {lineConf?.messageType === 'sendReplyMessage' && isPro && (
        <>
          <div>
            <b className="wdt-200 d-in-b mb-4 mt-4">{__('Reply Token:', 'bit-integrations')}</b>
            <input
              className="btcd-paper-inp w-6 mt-1"
              onChange={handleInput}
              name="replyToken"
              value={lineConf.replyToken}
              type="text"
              placeholder={__('Message', 'bit-integrations')}
            />
          </div>
          <div>
            <b className="wdt-200 d-in-b mb-4 mt-4">{__('Message:', 'bit-integrations')}</b>
            <input
              className="btcd-paper-inp w-6 mt-1"
              onChange={handleInput}
              name="message"
              value={lineConf.name}
              type="text"
              placeholder={__('Message', 'bit-integrations')}
            />
          </div>
        </>
      )}

      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      {lineConf?.messageType && (
        <>
          {lineConf?.sendEmojis && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Emojis Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Emoji Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.emojis_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-m-${i + 9}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.emojisFields}
                />
              ))}
            </>
          )}
          {lineConf?.sendEmojis && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.emojis_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.emojisFields}
                isLoading={isLoading}
                sendType="sendEmojis"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'emojis_field_map')
                }
              />
            </>
          )}
          <br />
          {lineConf?.sendSticker && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Sticker Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Sticker Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.sticker_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-m-${i + 9}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.stickerFields}
                />
              ))}
            </>
          )}
          {lineConf?.sendSticker && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.sticker_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.stickerFields}
                isLoading={isLoading}
                sendType="sendSticker"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'sticker_field_map')
                }
              />
            </>
          )}
          <br />
          {lineConf?.sendImage && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Image Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Image Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.image_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-m-${i + 9}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.imageFields}
                />
              ))}
            </>
          )}
          {lineConf?.sendImage && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.image_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.imageFields}
                isLoading={isLoading}
                sendType="sendImage"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'image_field_map')
                }
              />
            </>
          )}
          <br />
          {lineConf?.sendAudio && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Audio Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Audio Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.audio_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-m-${i + 9}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.audioFields}
                />
              ))}
            </>
          )}
          {lineConf?.sendAudio && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.audio_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.audioFields}
                isLoading={isLoading}
                sendType="sendAudio"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'audio_field_map')
                }
              />
            </>
          )}

          <br />
          {lineConf?.sendVideo && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Video Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Video Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.video_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-m-${i + 9}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.videoFields}
                />
              ))}
            </>
          )}

          <AddFieldButton
            fieldMapLength={lineConf.video_field_map.length}
            lineConf={lineConf}
            setLineConf={setLineConf}
            fields={lineConf.videoFields}
            isLoading={isLoading}
            sendType="sendVideo"
            addFieldMapFunc={(i, conf, setConf, fields) =>
              addFieldMap(i, conf, setConf, fields, 'video_field_map')
            }
          />

          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <LineUtilities lineConf={lineConf} setLineConf={setLineConf} formFields={formFields} />
        </>
      )}
    </>
  )
}

const textMsgNote = `<p>${__('To ensure successful message delivery using the Line Business API:', 'bit-integrations')}</p>
            <ul>
                <li><strong>${__('The conversation must be initiated by the user.', 'bit-integrations')}</strong></li>
                <li>${__("To begin, <strong>send a message from your Line number to the recipient's number.</strong>", 'bit-integrations')}</li>
                <li>${__('Once the user has started the conversation, you can continue to communicate with the recipient normally.', 'bit-integrations')}</li>
            </ul>`
