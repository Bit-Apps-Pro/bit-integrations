import { useRef } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { setFieldInputOnMsgBody } from '../IntegrationHelpers/IntegrationHelpers'
import LineActions from './LineActions'

export default function LineIntegLayout({ formFields, lineConf, setLineConf, isLoading }) {
  const textAreaRef = useRef(null)

  const handleInput = (e) => {
    const newConf = { ...lineConf }
    newConf[e.target.name] = e.target.value
    setLineConf(newConf)
  }

  const setMessageBody = (val) => {
    const newConf = { ...lineConf }
    newConf.body = val
    setLineConf(newConf)
  }
  const changeActionRun = (e) => {
    const newConf = { ...lineConf }
    if (newConf?.body) {
      newConf.body = ''
    }
    newConf.parse_mode = e.target.value
    setLineConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Channels List:', 'bit-integrations')}</b>
        <select
          onChange={handleInput}
          name="channel_id"
          value={lineConf.channel_id}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select Channel List', 'bit-integrations')}</option>
          {lineConf?.tokenDetails?.channels &&
            lineConf?.tokenDetails?.channels.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
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
      {lineConf?.channel_id && (
        <>
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b mr-16">{__('Messages:', 'bit-integrations')}</b>
            <textarea
              ref={textAreaRef}
              className="w-7"
              onChange={handleInput}
              name="body"
              rows="5"
              value={lineConf.body}
            />
            <MultiSelect
              options={formFields
                .filter((f) => f.type !== 'file')
                .map((f) => ({ label: f.label, value: `\${${f.name}}` }))}
              className="btcd-paper-drpdwn wdt-600 ml-2"
              onChange={(val) => setFieldInputOnMsgBody(val, setLineConf, textAreaRef)}
              singleSelect
              selectOnClose
            />
          </div>
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <LineActions lineConf={lineConf} setLineConf={setLineConf} formFields={formFields} />
        </>
      )}
    </>
  )
}
