import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
// import TwilioFieldMap from './TwilioFieldMap'

export default function TwilioIntegLayout({ formFields, handleInput, twilioConf, setTwilioConf, isLoading, setIsLoading, setSnackbar }) {
  const setMessageBody = (val) => {
    const newConf = { ...twilioConf }
    newConf.body = val
    setTwilioConf(newConf)
  }
  const handleInputt = e => {
    const newConf = { ...twilioConf }
    newConf[e.target.name] = e.target.value
    setTwilioConf(newConf)
  }
  const changeHandler = (val, status) => {
    const newConf = { ...twilioConf }
    newConf[status] = val
    setTwilioConf({ ...newConf })
  }

  return (
    <>
      <br />

      {/* {twilioConf?.field_map.map((itm, i) => (
        <TwilioFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          twilioConf={twilioConf}
          formFields={formFields}
          setTwilioConf={setTwilioConf}
          setSnackbar={setSnackbar}
        />
      ))} */}

      <div className="flx mt-4">
        <b className="wdt-135 d-in-b">{__('Select Number: ', 'bit-integrations')}</b>

        <MultiSelect
          defaultValue={twilioConf?.to}
          options={formFields.filter(f => (f.type !== 'file')).map(f => ({ label: f.label, value: `\${${f.name}}` }))}
          className="btcd-paper-drpdwn wdt-400 ml-2"
          onChange={(val) => changeHandler(val, 'to')}
          customValue
          singleSelect
        />
      </div>

      <div className="flx mt-4">
        <b className="wdt-200 d-in-b">{__('Messages: ', 'bit-integrations')}</b>
        <textarea className="w-7" onChange={handleInputt} name="body" rows="5" value={twilioConf.body} />
        <MultiSelect
          options={formFields.filter(f => (f.type !== 'file')).map(f => ({ label: f.label, value: `\${${f.name}}` }))}
          className="btcd-paper-drpdwn wdt-400 ml-2"
          onChange={val => setMessageBody(val)}
        />

      </div>

      <br />

    </>
  )
}
