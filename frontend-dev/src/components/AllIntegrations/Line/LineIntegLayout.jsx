import { create } from 'mutative'
import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import LineFieldMap from './LineFieldMap'
import LineUtilities from './LineActions'
import { addFieldMap } from './LineCommonFunc'
import AddFieldButton from './AddFieldButton'

export default function LineIntegLayout({ formFields, lineConf, setLineConf, isLoading }) {
  const textAreaRef = useRef(null)
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleInput = e => {
    const newConf = { ...lineConf }
    newConf[e.target.name] = e.target.value
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
      })
    )
  }

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

      {lineConf?.messageType === 'sendPushMessage' && (
        <>
          <div>
            <b className="wdt-200 d-in-b mb-4 mt-4">{__('Recipient ID:', 'bit-integrations')}</b>
            <input
              className="btcd-paper-inp w-6 mt-1"
              onChange={handleInput}
              name="recipientId"
              value={lineConf.recipientId || ''}
              type="text"
              placeholder={__('Recipient ID', 'bit-integrations')}
            />
          </div>
          <div className="mt-2" dangerouslySetInnerHTML={{ __html: recipientIdNote }} />
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
              value={lineConf.replyToken || ''}
              type="text"
              placeholder={__('Reply Token', 'bit-integrations')}
            />
          </div>
          <div className="mt-2" dangerouslySetInnerHTML={{ __html: replyTokenNote }} />
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
          {lineConf?.messageField && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Message:', 'bit-integrations')}</b>
                <p className="txt-dp mt-1"></p>
              </div>
              <div className="btcd-hr mt-1" />

              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Message Field', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.message_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-message-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.messageField}
                  fieldMapKey="message_field_map"
                />
              ))}
            </>
          )}
          <br />
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
                  key={`line-emojis-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.emojisFields}
                  fieldMapKey="emojis_field_map"
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
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: emojiNote }} />
            </>
          )}
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
                  key={`line-sticker-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.stickerFields}
                  fieldMapKey="sticker_field_map"
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
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: stickerNote }} />
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
                  key={`line-image-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.imageFields}
                  fieldMapKey="image_field_map"
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
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: imageNote }} />
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
                  key={`line-audio-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.audioFields}
                  fieldMapKey="audio_field_map"
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
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: audioNote }} />
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
                  key={`line-video-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.videoFields}
                  fieldMapKey="video_field_map"
                />
              ))}
            </>
          )}
          {lineConf?.sendVideo && (
            <>
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
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: videoNote }} />
            </>
          )}

          {lineConf?.sendVideo && (
            <>
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
            </>
          )}

          {lineConf?.sendLocation && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Location Map Fields', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Line Location Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {lineConf.location_field_map.map((itm, i) => (
                <LineFieldMap
                  key={`line-location-${i}`}
                  i={i}
                  field={itm}
                  lineConf={lineConf}
                  formFields={formFields}
                  setLineConf={setLineConf}
                  requiredFields={lineConf.locationFields}
                  fieldMapKey="location_field_map"
                />
              ))}
            </>
          )}
          {lineConf?.sendLocation && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.location_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.locationFields}
                isLoading={isLoading}
                sendType="sendLocation"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'location_field_map')
                }
              />
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: locationNote }} />
            </>
          )}

          {lineConf?.sendLocation && (
            <>
              <AddFieldButton
                fieldMapLength={lineConf.location_field_map.length}
                lineConf={lineConf}
                setLineConf={setLineConf}
                fields={lineConf.locationFields}
                isLoading={isLoading}
                sendType="sendLocation"
                addFieldMapFunc={(i, conf, setConf, fields) =>
                  addFieldMap(i, conf, setConf, fields, 'location_field_map')
                }
              />
            </>
          )}

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

const recipientIdNote = `<h2>${__('To get your Line Recipient ID:', 'bit-integrations')}</h2>
  <ul>
    <li>${__('From Line Developers Console go to the Messaging API tab. Your User ID is listed under the Webhook URL section.')}</li>
    <li>${__('The User ID is included in the webhook event data every time a user sends a message to your bot.')}</li>
</ul>`

const replyTokenNote = `<h2>${__('To get your Line Reply Token:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('From Line Developers Console go to the Messaging API tab. Your Reply Token is listed under the Webhook URL section.')}</li>
    <li>${__('The Reply Token is included in the webhook event data every time a user sends a message to your bot.')}</li>
    </ul>`

const emojiNote = `<h2>${__('To get Line Emoji IDs and Product IDs:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('For more information visit the <a href="https://developers.line.biz/en/docs/messaging-api/emoji-list/" target="_blank">Line Emoji List</a> documentation.', 'bit-integrations')}</li>
    </ul>`

const stickerNote = `<h2>${__('To get Line Sticker IDs and Package IDs:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('For more information visit the <a href="https://developers.line.biz/en/docs/messaging-api/sticker-list/" target="_blank">Line Sticker List</a> documentation.', 'bit-integrations')}</li>
    </ul>`

const imageNote = `<h2>${__('To set up LINE Image Messages:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('Use JPG, PNG, or GIF image files under 10MB in size.', 'bit-integrations')}</li>
        <li>${__('Original Content URL: Direct HTTPS link to the image file.', 'bit-integrations')}</li>
        <li>${__('Preview Image URL: Direct HTTPS link to a smaller preview image.', 'bit-integrations')}</li>
   
    </ul>`

const audioNote = `<h2>${__('To set up LINE Audio Messages:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('Use M4A audio files under 10MB in size.', 'bit-integrations')}</li>
        <li>${__('Original Content URL: Direct HTTPS link to the audio file.', 'bit-integrations')}</li>
        <li>${__('Duration: Length of the audio in milliseconds (e.g., 60000 for 1 minute).', 'bit-integrations')}</li>
        <li>${__('Host your audio file on a web server or cloud storage.', 'bit-integrations')}</li>
        <li>${__('Make sure the URL is publicly accessible and uses HTTPS.', 'bit-integrations')}</li>
    </ul>`

const videoNote = `<h2>${__('To set up LINE Video Messages:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('Use MP4 video files under 200MB in size.', 'bit-integrations')}</li>
        <li>${__('Original Content URL: Direct HTTPS link to the video file.', 'bit-integrations')}</li>
        <li>${__('Preview Image URL: Direct HTTPS link to the video thumbnail.', 'bit-integrations')}</li>
        <li>${__('Host your video and image on a web server or cloud storage.', 'bit-integrations')}</li>
        <li>${__('Make sure both URLs are publicly accessible and use HTTPS.', 'bit-integrations')}</li>
    </ul>`

const locationNote = `<h2>${__('To set up LINE Location Messages:', 'bit-integrations')}</h2>
    <ul>
        <li>${__('Title: Name of the location (e.g., "Tokyo Tower").', 'bit-integrations')}</li>
        <li>${__('Address: Full address of the location.', 'bit-integrations')}</li>
        <li>${__('Latitude: GPS latitude coordinate (e.g., 35.6586).', 'bit-integrations')}</li>
        <li>${__('Longitude: GPS longitude coordinate (e.g., 139.7454).', 'bit-integrations')}</li>
        <li>${__('You can get coordinates from Google Maps or other mapping services.', 'bit-integrations')}</li>
    </ul>`
