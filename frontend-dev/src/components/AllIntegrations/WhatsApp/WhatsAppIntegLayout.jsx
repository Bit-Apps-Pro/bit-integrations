// import { useEffect } from 'react'
// import { __ } from '../../../Utils/i18nwrap'
// import Loader from '../../Loaders/Loader'
// import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
// // import TrelloActions from './TrelloActions'
// // import { addFieldMap } from './IntegrationHelpers'
// import WhatsAppFieldMap from './WhatsAppFieldMap'

// export default function WhatsAppIntegLayout({ formFields, handleInput, whatsAppConf, setWhatsAppConf, isLoading, setIsLoading, setSnackbar }) {
//   return (
//     <>
//       <b className="wdt-200 d-in-b">{__('Message Type:', 'bit-integrations')}</b>
//       <select onChange={handleInput} name="messageTypeId" value={whatsAppConf.messageTypeId} className="btcd-paper-inp w-5">
//         <option value="">{__('Select Message Type', 'bit-integrations')}</option>
//         {
//           whatsAppConf?.messageType.map(({ id, label }) => (
//             <option key={id} value={id}>
//               {label}
//             </option>
//           ))
//         }
//       </select>

//       <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
//       <div className="btcd-hr mt-1" />
//       <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
//         <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
//         <div className="txt-dp"><b>{__('Trello Fields', 'bit-integrations')}</b></div>
//       </div>

//       {whatsAppConf?.field_map.map((itm, i) => (
//         <WhatsAppFieldMap
//           key={`rp-m-${i + 9}`}
//           i={i}
//           field={itm}
//           whatsAppConf={whatsAppConf}
//           formFields={formFields}
//           setWhatsAppConf={setWhatsAppConf}
//           setSnackbar={setSnackbar}
//         />
//       ))}
//       <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(whatsAppConf.field_map.length, whatsAppConf, setWhatsAppConf, false)} className="icn-btn sh-sm" type="button">+</button></div>

//       <br />
//       <br />
//       <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
//       <div className="btcd-hr mt-1" />
//       {/* <TrelloActions
//         whatsAppConf={whatsAppConf}
//         setWhatsAppConf={setWhatsAppConf}
//         formFields={formFields}
//       /> */}

//     </>
//   )
// }

import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import TinyMCE from '../../Utilities/TinyMCE'
import WhatsAppFieldMap from './WhatsAppFieldMap'

export default function WhatsAppIntegLayout({ formFields, handleInput,
  whatsAppConf,
  setWhatsAppConf,
  isLoading,
  setIsLoading,
  setSnackbar }) {
  // const handleInput = (e) => {
  //   const newConf = { ...whatsAppConf }
  //   newConf[e.target.name] = e.target.value
  //   setWhatsAppConf(newConf)
  // }

  const { id } = useParams()

  const setMessageBody = (val) => {
    const newConf = { ...whatsAppConf }
    newConf.body = val
    setWhatsAppConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">
          {__('Message Type: ', 'bit-integrations')}
        </b>
        <select
          onChange={handleInput}
          name="messageTypeId"
          value={whatsAppConf.messageTypeId}
          className="btcd-paper-inp w-5"
        >
          <option value="">
            {__('Select Message Type', 'bit-integrations')}
          </option>
          {
            whatsAppConf?.messageType.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
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
      <br />
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('WhatsApp Fields', 'bit-integrations')}</b></div>
      </div>
      <br />

      {whatsAppConf?.field_map.map((itm, i) => (
        <WhatsAppFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          whatsAppConf={whatsAppConf}
          formFields={formFields}
          setWhatsAppConf={setWhatsAppConf}
          setSnackbar={setSnackbar}
        />
      ))}
      {whatsAppConf?.messageTypeId === '1' && (
        <div>
          <b className="wdt-200 d-in-b mr-16 mb-4 mt-4">
            {__('Messages: ', 'bit-integrations')}
          </b>
          {/* <textarea
              className="w-7"
              onChange={handleInput}
              name="body"
              rows="5"
              value={whatsAppConf.body}
            />
            <MultiSelect
              options={formFields
                .filter((f) => f.type !== 'file')
                .map((f) => ({ label: f.label, value: `\${${f.name}}` }))}
              className="btcd-paper-drpdwn wdt-600 ml-2"
              onChange={(val) => setMessageBody(val)}
            /> */}

          <TinyMCE
            formFields={formFields}
            id={`telegram-message-${id}`}
            value={whatsAppConf.body}
            onChangeHandler={setMessageBody}
            width="100%"
            toolbarMnu="bold italic underline strikethrough | link | code | addFormField | toggleCode"
          />
        </div>
      )}
      <br />
      <br />
      {whatsAppConf?.messageTypeId === '2' && (
        <div className="flx mt-4">
          <b className="wdt-200 d-in-b">
            {__('Template Name: ', 'bit-integrations')}
          </b>
          <textarea
            className="w-5"
            onChange={handleInput}
            name="templateName"
            rows="5"
            value={whatsAppConf.templateName}
          />
        </div>
      )}
    </>
  )
}
