import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Loader from '../../Loaders/Loader'
import TelegramActions from './TelegramActions'
import { refreshGetUpdates } from './TelegramCommonFunc'
import { create } from 'mutative'
import TinyMCE from '../../Utilities/TinyMCE'
import { useRef } from 'react'
import { setFieldInputOnMsgBody } from '../IntegrationHelpers/IntegrationHelpers'

export default function TelegramIntegLayout({
  formID,
  formFields,
  telegramConf,
  setTelegramConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const { id } = useParams()
  const textAreaRef = useRef(null)

  const handleInput = (e) => {
    const newConf = { ...telegramConf }
    newConf[e.target.name] = e.target.value
    setTelegramConf(newConf)
  }

  const setMessageBody = (val) => {
    setTelegramConf(prevConf => create(prevConf, draftConf => {
      draftConf.body = val
    }))
  }

  const changeActionRun = (e) => {
    setTelegramConf(prevConf => create(prevConf, draftConf => {
      draftConf.parse_mode = e.target.value
    }))
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-150 d-in-b">{__('Chat List:', 'bit-integrations')}</b>
        <select
          onChange={handleInput}
          name="chat_id"
          value={telegramConf.chat_id}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select Chat List', 'bit-integrations')}</option>
          {telegramConf?.default?.telegramChatLists &&
            Object.keys(telegramConf.default.telegramChatLists)
              .filter((item) => telegramConf.default.telegramChatLists[item].id !== null)
              .map((chatListname) => (
                <option
                  key={chatListname}
                  value={telegramConf.default.telegramChatLists[chatListname].id}>
                  {telegramConf.default.telegramChatLists[chatListname].name}
                </option>
              ))}
        </select>
        <button
          onClick={() =>
            refreshGetUpdates(telegramConf, setTelegramConf, setIsLoading, setSnackbar)
          }
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Refresh Telegram List', 'bit-integrations')}'` }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div>
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
      {telegramConf?.chat_id && (
        <>
          <div className="flx mt-4">
            <b className="wdt-150 d-in-b">{__('Parse Mode:', 'bit-integrations')}</b>
            <CheckBox
              radio
              onChange={changeActionRun}
              name="HTML"
              title={<small className="txt-dp">{__('HTML', 'bit-integrations')}</small>}
              checked={telegramConf.parse_mode === 'HTML'}
              value="HTML"
            />
            <CheckBox
              radio
              onChange={changeActionRun}
              name="MarkdownV2"
              title={<small className="txt-dp">{__('Markdown v2', 'bit-integrations')}</small>}
              checked={telegramConf.parse_mode === 'MarkdownV2'}
              value="MarkdownV2"
            />
          </div>
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b">{__('Messages:', 'bit-integrations')}</b>
            <TinyMCE
              formFields={formFields}
              id={`telegram-message-${id}`}
              value={telegramConf.body}
              onChangeHandler={setMessageBody}
              width="100%"
              toolbarMnu="bold italic underline strikethrough | link | code | addFormField | toggleCode"
              show={telegramConf?.parse_mode === 'HTML'}
            />
            {telegramConf?.parse_mode === 'MarkdownV2' && (
              <>
                <textarea
                  ref={textAreaRef}
                  className="w-7"
                  onChange={handleInput}
                  name="body"
                  rows="5"
                  value={telegramConf.body}
                />
                <MultiSelect
                  options={formFields
                    .filter((f) => f.type !== 'file')
                    .map((f) => ({ label: f.label, value: `\${${f.name}}` }))}
                  className="btcd-paper-drpdwn wdt-200 ml-2"
                  onChange={(val) => setFieldInputOnMsgBody(val, setTelegramConf, textAreaRef)}
                  singleSelect
                  selectOnClose
                />
              </>
            )}
          </div>
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <TelegramActions
            telegramConf={telegramConf}
            setTelegramConf={setTelegramConf}
            formFields={formFields}
          />
        </>
      )
      }
    </>
  )
}
