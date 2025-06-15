import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Loader from '../../Loaders/Loader'
import TinyMCE from '../../Utilities/TinyMCE'
import SlackActions from './SlackActions'

export default function SlackIntegLayout({ formFields,
  slackConf,
  setSlackConf,
  isLoading }) {
  const { id } = useParams()
  const handleInput = (e) => {
    const newConf = { ...slackConf }
    newConf[e.target.name] = e.target.value
    setSlackConf(newConf)
  }

  const setMessageBody = (val) => {
    const newConf = { ...slackConf }
    newConf.body = val
    setSlackConf(newConf)
  }
  const changeActionRun = (e) => {
    const newConf = { ...slackConf }
    if (newConf?.body) {
      newConf.body = ''
    }
    newConf.parse_mode = e.target.value
    setSlackConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">
          {__('Channels List: ', 'bit-integrations')}
        </b>
        <select
          onChange={handleInput}
          name="channel_id"
          value={slackConf.channel_id}
          className="btcd-paper-inp w-5"
        >
          <option value="">
            {__('Select Channel List', 'bit-integrations')}
          </option>
          {
            slackConf?.tokenDetails?.channels
              && slackConf?.tokenDetails?.channels.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))
          }
        </select>
      </div>
      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)',
          }}
        />
      )}
      {slackConf?.channel_id && (
        <>
          <div className="flx mt-4">
            <b className="wdt-200 d-in-b mr-16">
              {__('Messages: ', 'bit-integrations')}
            </b>
            <textarea
              className="w-7"
              onChange={handleInput}
              name="body"
              rows="5"
              value={slackConf.body}
            />
            <MultiSelect
              options={formFields
                .filter((f) => f.type !== 'file')
                .map((f) => ({ label: f.label, value: `\${${f.name}}` }))}
              className="btcd-paper-drpdwn wdt-600 ml-2"
              onChange={(val) => setMessageBody(val)}
            />
          </div>
          <div className="mt-4">
            <b className="wdt-100">{__('Actions', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <SlackActions
            slackConf={slackConf}
            setSlackConf={setSlackConf}
            formFields={formFields}
          />
        </>
      )}
    </>
  )
}
