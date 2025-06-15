import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
// import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
// import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import WhatsAppAuthorization from './WhatsAppAuthorization'
import { handleInput, checkMappedFields } from './WhatsAppCommonFunc'
import WhatsAppIntegLayout from './WhatsAppIntegLayout'

function WhatsApp({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const whatsAppFields = [
    { key: 'phone', label: 'Phone', required: true },
  ]
  const messageType = [
    // { id: '1', label: 'Text' },
    { id: '2', label: 'Template' },
  ]
  const [whatsAppConf, setWhatsAppConf] = useState({
    name: 'WhatsApp',
    type: 'WhatsApp',
    numberID: process.env.NODE_ENV === 'development' ? '104197922315552' : '',
    businessAccountID: process.env.NODE_ENV === 'development' ? '105802232151489' : '',
    messageType,
    messageTypeId: '',
    body: '',
    templateName: '',
    token: process.env.NODE_ENV === 'development' ? 'EAAGKszJZAruMBAPbn3NeQ6YUe6THJHTv5qBhTr5ZAGmOhNsekyRnjYSUf2BZAZB1QotIJCKnyuikZCP0MQW4Izs65yLLSKuY8IxZBZCEaMsZBth5mqyxS4fllAZAmDRRCLZC7pMeESMBLgfyXfqs3SXgQ3tTD44XSGFee63m3sAP0UEG7U1zjeZCKsIJlxvRCCQZBKQgzXr5yNF3DgZDZD' : '',
    field_map: [
      { formField: '', whatsAppFormField: '' },
    ],
    whatsAppFields,
    address_field: [],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (checkMappedFields(whatsAppConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    setstep(3)
  }

  const disabledButton = whatsAppConf.messageTypeId === '1' ? whatsAppConf.body === '' : whatsAppConf.templateName === ''

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <WhatsAppAuthorization
        formID={formID}
        whatsAppConf={whatsAppConf}
        setWhatsAppConf={setWhatsAppConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <WhatsAppIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, whatsAppConf, setWhatsAppConf, setIsLoading, setSnackbar)}
          whatsAppConf={whatsAppConf}
          setWhatsAppConf={setWhatsAppConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={disabledButton}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: whatsAppConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={whatsAppConf}
        setDataConf={setWhatsAppConf}
        formFields={formFields}
      />

    </div>
  )
}

export default WhatsApp
