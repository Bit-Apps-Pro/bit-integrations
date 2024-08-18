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
import { handleInput, generateMappedField, checkDisabledButton } from './WhatsAppCommonFunc'
import WhatsAppIntegLayout from './WhatsAppIntegLayout'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'

function WhatsApp({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const whatsAppFields = [{ key: 'phone', label: "Recipient's Phone", required: true }]
  const messageTypes = [
    { name: 'template', label: 'Template Message', is_pro: false },
    { name: 'text', label: 'Text Message', is_pro: true },
    { name: 'contact', label: 'Contact Message', is_pro: true },
    { name: 'media', label: 'Media Message', is_pro: true }
  ]
  const mediaTypes = [
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/aac',
    'audio/mp4',
    'audio/mpeg',
    'audio/amr',
    'audio/ogg',
    'audio/opus',
    'video/mp4',
    'video/3gp',
    'image/webp'
  ]

  const [whatsAppConf, setWhatsAppConf] = useState({
    name: 'WhatsApp',
    type: 'WhatsApp',
    numberID: process.env.NODE_ENV === 'development' ? '115645968196230' : '',
    businessAccountID: process.env.NODE_ENV === 'development' ? '101082419667133' : '',
    messageTypes,
    mediaTypes,
    messageType: '',
    body: '',
    templateName: '',
    token:
      process.env.NODE_ENV === 'development'
        ? 'EAALIMHqNYCEBO9nAFnCSJL6G3O6dJ6k9L3CZB6iTbPqkVfFt9HH4UhSLQZA1BykHLR0xHgYaR9ZBkJuLdwex8v3N2wNI33GB5eBCK40lm1t0drOhoDodvrH3fw8kaT3ZCqTT2mRYE37fIMnAqVgEBwqygftCLseEmC0kLvLTte8HYW7KW6dXHEINnypkNUwZAG9drPZBdKtGTdnxEJKEQYegsMLz3LoZAQp7eL5'
        : '',
    field_map: generateMappedField(whatsAppFields),
    whatsAppFields,
    address_field: [],
    actions: {},
    allTemplates: []
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (checkDisabledButton(whatsAppConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    setstep(3)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

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
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <WhatsAppIntegLayout
          formFields={formFields}
          handleInput={(e) =>
            handleInput(e, whatsAppConf, setWhatsAppConf, setIsLoading, setSnackbar)
          }
          whatsAppConf={whatsAppConf}
          setWhatsAppConf={setWhatsAppConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={checkDisabledButton(whatsAppConf)}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')} &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            navigate,
            conf: whatsAppConf,
            setIsLoading,
            setSnackbar
          })
        }
        isLoading={isLoading}
        dataConf={whatsAppConf}
        setDataConf={setWhatsAppConf}
        formFields={formFields}
      />
    </div>
  )
}

export default WhatsApp
