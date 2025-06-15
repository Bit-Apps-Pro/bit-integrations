import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Loader from '../../Loaders/Loader'
import TinyMCE from '../../Utilities/TinyMCE'
import DiscordActions from './DiscordActions'
import { getAllChannels, getAllServers } from './DiscordCommonFunc'
import { useEffect } from 'react'

export default function DiscordIntegLayout({ formFields,
  discordConf,
  setDiscordConf,
  isLoading, setIsLoading }) {
  const { id } = useParams()
  const handleInput = (e) => {
    const newConf = { ...discordConf }
    newConf[e.target.name] = e.target.value
    setDiscordConf(newConf)
  }


  const setChanges = (val, name) => {
    const newConf = { ...discordConf }
    newConf[name] = val

    if (name === 'selectedServer' && (newConf.selectedServer !== '' || newConf.selectedServer !== null) && val) {
      newConf.selectedChannel = ''
      getAllChannels(newConf, setDiscordConf, setIsLoading)
    }
    setDiscordConf({ ...newConf })
  }
  const setMessageBody = (val) => {
    const newConf = { ...discordConf }
    newConf.body = val
    setDiscordConf(newConf)
  }
  const changeActionRun = (e) => {
    const newConf = { ...discordConf }
    if (newConf?.body) {
      newConf.body = ''
    }
    newConf.parse_mode = e.target.value
    setDiscordConf(newConf)
  }
  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Servers:', 'bit-integrations')}</b>
        <MultiSelect
          options={discordConf?.servers?.map(Server => ({ label: Server.name, value: Server.id }))}
          className="msl-wrp-options dropdown-custom-width"
          defaultValue={discordConf?.selectedServer}
          onChange={val => setChanges(val, 'selectedServer')}
          disabled={isLoading.Servers}
          singleSelect
        />
        <button
          onClick={() => getAllServers(discordConf, setDiscordConf, setIsLoading)}
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Refresh Server List', 'bit-integrations')}'` }}
          type="button"
          disabled={isLoading.servers}
        >
          &#x21BB;
        </button>
      </div>
      <br />
      {discordConf?.selectedServer && (
        <>
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Channels:', 'bit-integrations')}</b>
            <MultiSelect
              options={discordConf?.channels?.map(Channel => ({ label: Channel.name, value: Channel.id }))}
              className="msl-wrp-options dropdown-custom-width"
              defaultValue={discordConf?.selectedChannel}
              onChange={val => setChanges(val, 'selectedChannel')}
              disabled={isLoading.Channels}
              singleSelect
            />
            <button
              onClick={() => getAllChannels(discordConf, setDiscordConf, setIsLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Channel List', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading.channels}
            >
              &#x21BB;
            </button>
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
            transform: 'scale(0.7)',
          }}
        />
      )}
      {discordConf?.selectedChannel && discordConf?.selectedServer && (
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
              value={discordConf.body}
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
          <DiscordActions
            discordConf={discordConf}
            setDiscordConf={setDiscordConf}
            formFields={formFields}
          />
        </>
      )}
    </>
  )
}
